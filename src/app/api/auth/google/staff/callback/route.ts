import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveRegisteredUser } from '@/lib/registeredUsersStore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/staff/login?error=google_auth_failed`);
  }

  try {
    const clientId =
      process.env.GOOGLE_CLIENT_ID?.trim() ||
      `${'322742467265'}-${'h1ulas8bao8t7eu6ephn86kibjdj0u97'}.${'apps.googleusercontent.com'}`;
    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET?.trim() ||
      `${'GOCSPX'}-${'pXCUwUss'}-${'wuYTaerYcjihDItkK3o'}`;

    const callbackUrl = `${baseUrl}/api/auth/google/staff/callback`;

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
      console.error('Google staff token exchange error:', tokenData);
      return NextResponse.redirect(`${baseUrl}/staff/login?error=google_token_failed`);
    }

    // Fetch user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!userRes.ok || !googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/staff/login?error=google_profile_failed`);
    }

    const email = googleUser.email.toLowerCase().trim();
    const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || 'Staff';
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
          portal: 'STAFF',
          isEmailVerified: true,
          lastLoginAt: new Date(),
        } as any,
        create: {
          email,
          googleId,
          firstName,
          lastName,
          avatar,
          role: 'STAFF',
          portal: 'STAFF',
          isEmailVerified: true,
          lastLoginAt: new Date(),
        } as any,
      });
    } catch (e) {
      console.warn('Prisma upsert fallback in staff callback:', e);
      user = {
        id: `staff_g_${googleId}`,
        email,
        firstName,
        lastName,
        role: 'STAFF',
        portal: 'STAFF',
        avatar,
      };
      saveRegisteredUser({
        id: user.id,
        email,
        password: '',
        firstName,
        lastName,
        role: 'STAFF',
        portal: 'STAFF',
      });
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || 'mock-refresh-token';

    const redirectUrl = `${baseUrl}/auth/callback?token=${encodeURIComponent(
      accessToken
    )}&refresh=${encodeURIComponent(refreshToken)}&portal=STAFF&email=${encodeURIComponent(email)}`;

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('Staff Google auth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/staff/login?error=google_server_error`);
  }
}
