'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');
    const portal = searchParams.get('portal') || 'CLIENT';
    const email = searchParams.get('email');

    if (token && email) {
      localStorage.setItem('accessToken', token);
      if (refresh) localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('portal', portal);

      // Attempt NextAuth session sign-in or auto-redirect
      signIn('google', { callbackUrl: '/dashboard', redirect: false })
        .then(() => {
          router.push('/dashboard');
        })
        .catch(() => {
          router.push('/dashboard');
        });
    } else {
      const errorPortal = portal === 'STAFF' ? '/staff/login' : '/login';
      router.push(`${errorPortal}?error=no_token`);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-white mb-1">Completing Sign In</h2>
        <p className="text-sm text-slate-400">Authenticating with Google OAuth...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading authentication callback...
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
