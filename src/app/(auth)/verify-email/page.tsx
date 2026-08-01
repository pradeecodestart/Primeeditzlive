'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get('token');
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'idle' | 'verifying' | 'success' | 'error' | 'already-verified'>('idle');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes countdown

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  // Handle 1-Click Verification Link Token if present in URL
  useEffect(() => {
    if (tokenParam) {
      setTokenStatus('verifying');
      fetch(`/api/auth/verify-email?token=${encodeURIComponent(tokenParam)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.alreadyVerified) {
              setTokenStatus('already-verified');
              setSuccess('Your email address is already verified!');
            } else {
              setTokenStatus('success');
              setSuccess('Email verified successfully! Welcome to PostProd Pro.');
              setTimeout(() => {
                router.push('/login?verified=true');
              }, 2500);
            }
          } else {
            setTokenStatus('error');
            setError(data.message || 'Verification link failed or expired');
          }
        })
        .catch(() => {
          setTokenStatus('error');
          setError('An error occurred while validating verification link.');
        });
    }
  }, [tokenParam, router]);

  // 15-minute OTP countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      setError('Please enter all 6 digits of your verification code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setSuccess('Identity verified successfully! Redirecting to login...');
      setTimeout(() => {
        router.push(`/login?registered=true&email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Please provide your registered email address');
      return;
    }

    setResending(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setSuccess('A new verification link & 6-digit code have been sent to your email.');
      setTimeLeft(900);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Could not resend verification code');
    } finally {
      setResending(false);
    }
  };

  // 1-Click Link Verification UI States
  if (tokenParam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          
          {tokenStatus === 'verifying' && (
            <div>
              <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-indigo-500 mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-white mb-2">Verifying Email Link...</h2>
              <p className="text-slate-400 text-sm">Please wait while we validate your 1-click token.</p>
            </div>
          )}

          {tokenStatus === 'success' && (
            <div>
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-6">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified! 🎉</h2>
              <p className="text-slate-300 text-sm mb-6">{success}</p>
              <Link
                href="/login"
                className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
              >
                Continue to Login →
              </Link>
            </div>
          )}

          {tokenStatus === 'already-verified' && (
            <div>
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mb-6">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Already Verified</h2>
              <p className="text-slate-300 text-sm mb-6">{success}</p>
              <Link
                href="/login"
                className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg text-sm"
              >
                Sign In to Dashboard →
              </Link>
            </div>
          )}

          {tokenStatus === 'error' && (
            <div>
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-6">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-rose-400 text-sm mb-6">{error}</p>
              <Link
                href="/login"
                className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-xl transition-all text-sm"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard 6-Digit OTP Verification Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4 border border-indigo-500/30 shadow-lg shadow-indigo-600/20">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Please verify your identity</h1>
          <p className="text-slate-400 mt-2 text-sm">
            We sent a verification link & 6-digit code to <br />
            <strong className="text-indigo-400 font-semibold">{email || 'your email'}</strong>
          </p>
        </div>

        {/* Notifications */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex justify-between items-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-2xl font-bold font-mono bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                required
              />
            ))}
          </div>

          <div className="text-center text-xs text-slate-500">
            This code is valid for <strong className="text-slate-300 font-semibold">{formatTime(timeLeft)}</strong> and can only be used once.
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 text-sm"
          >
            {loading ? 'Verifying Code...' : 'Verify Identity'}
          </button>
        </form>

        {/* Resend Action */}
        <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
          <p className="text-xs text-slate-400 mb-2">Didn&apos;t receive the email?</p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resending}
            className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-colors disabled:opacity-50"
          >
            {resending ? 'Sending Email...' : 'Resend Verification Link & Code'}
          </button>
        </div>

        <div className="mt-6 text-center text-xs">
          <Link href="/signup" className="text-slate-500 hover:text-slate-400 transition-colors">
            ← Change Email Address
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Loading verification page...
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
