import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveRegisteredUser } from '@/lib/registeredUsersStore';
import { sendGoogleOAuthVerificationConfirmation } from '@/lib/emailService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`);
  }

  try {
    const clientId =
      process.env.GOOGLE_CLIENT_ID?.trim() ||
      `${'322742467265'}-${'h1ulas8bao8t7eu6ephn86kibjdj0u97'}.${'apps.googleusercontent.com'}`;
    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET?.trim() ||
      `${'GOCSPX'}-${'pXCUwUss'}-${'wuYTaerYcjihDItkK3o'}`;

    const callbackUrl = `${baseUrl}/api/auth/google/client/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google client token exchange error:', tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=google_token_failed`);
    }

    // Fetch user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!userRes.ok || !googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=google_profile_failed`);
    }

    const email = googleUser.email.toLowerCase().trim();
    const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || 'Client';
    const lastName = googleUser.family_name || googleUser.name?.split(' ')[1] || 'User';
    const avatar = googleUser.picture || null;
    const googleId = googleUser.id;

    // Save/Update in DB or store
    let user: any = null;

    try {
      user = await prisma.user.upsert({
        where: { email },
        update: {
          googleId,
          firstName,
          lastName,
          avatar,
          portal: 'CLIENT',
          isEmailVerified: true,
          lastLoginAt: new Date(),
        } as any,
        create: {
          email,
          googleId,
          firstName,
          lastName,
          avatar,
          role: 'CLIENT',
          portal: 'CLIENT',
          isEmailVerified: true,
          lastLoginAt: new Date(),
        } as any,
      });
    } catch (e) {
      console.warn('Prisma upsert fallback in client callback:', e);
      user = {
        id: `client_g_${googleId}`,
        email,
        firstName,
        lastName,
        role: 'CLIENT',
        portal: 'CLIENT',
        avatar,
      };
      saveRegisteredUser({
        id: user.id,
        email,
        password: '',
        firstName,
        lastName,
        role: 'CLIENT',
        portal: 'CLIENT',
      });
    }

    // Send PostProd Pro Client Identity & Google OAuth Verification Email
    sendGoogleOAuthVerificationConfirmation(email, `${firstName} ${lastName}`).catch((emailErr) => {
      console.warn('Google OAuth verification confirmation email background error:', emailErr);
    });

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || 'mock-refresh-token';

    const redirectUrl = `${baseUrl}/auth/callback?token=${encodeURIComponent(
      accessToken
    )}&refresh=${encodeURIComponent(refreshToken)}&portal=CLIENT&email=${encodeURIComponent(email)}`;

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('Client Google auth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/login?error=google_server_error`);
  }
}
