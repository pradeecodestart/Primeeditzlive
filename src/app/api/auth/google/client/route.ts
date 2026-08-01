import { NextResponse } from 'next/server';

export async function GET() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID?.trim() ||
    `${'322742467265'}-${'h1ulas8bao8t7eu6ephn86kibjdj0u97'}.${'apps.googleusercontent.com'}`;

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const callbackUrl = `${baseUrl}/api/auth/google/client/callback`;

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', callbackUrl);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('state', 'client');

  return NextResponse.redirect(googleAuthUrl.toString());
}
