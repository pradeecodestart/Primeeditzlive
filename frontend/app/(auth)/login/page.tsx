'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { OTPInput } from '@/components/OTPInput';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';

const passwordLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

const otpLoginSchema = z.object({
  email: z.string().email('Invalid email'),
});

type PasswordLoginValues = z.infer<typeof passwordLoginSchema>;
type OTPLoginValues = z.infer<typeof otpLoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const passwordForm = useForm<PasswordLoginValues>({
    resolver: zodResolver(passwordLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const otpForm = useForm<OTPLoginValues>({
    resolver: zodResolver(otpLoginSchema),
    defaultValues: {
      email: '',
    },
  });

  // Password login
  const onPasswordSubmit = async (values: PasswordLoginValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(values.email, values.password, 'CLIENT');

      if (response.requiresEmailVerification) {
        router.push(`/verify-email?email=${values.email}`);
        return;
      }

      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Request OTP
  const onOTPRequest = async (values: OTPLoginValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.requestLoginOTP(values.email, 'CLIENT');
      setOtpEmail(values.email);
      setOtpStep('verify');

      // Start resend timer
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.verifyLoginOTP(otpEmail, otp, 'CLIENT');

      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiClient.requestLoginOTP(otpEmail, 'CLIENT');
      setOtp('');
      setResendTimer(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="text-gray-600 text-sm mt-2">Welcome back</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Tab buttons */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setLoginMethod('password');
              setError(null);
            }}
            className={`px-4 py-2 font-medium text-sm ${
              loginMethod === 'password'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Password
          </button>
          <button
            onClick={() => {
              setLoginMethod('otp');
              setError(null);
            }}
            className={`px-4 py-2 font-medium text-sm ${
              loginMethod === 'otp'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            OTP Code
          </button>
        </div>

        {/* PASSWORD LOGIN */}
        {loginMethod === 'password' && (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                disabled={isLoading}
                {...passwordForm.register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {passwordForm.formState.errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {passwordForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                {...passwordForm.register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {passwordForm.formState.errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* OTP LOGIN */}
        {loginMethod === 'otp' && (
          <>
            {otpStep === 'request' ? (
              <form onSubmit={otpForm.handleSubmit(onOTPRequest)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    disabled={isLoading}
                    {...otpForm.register('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  {otpForm.formState.errors.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {otpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP Code'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  We've sent a code to {otpEmail}
                </p>

                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOTP}
                  disabled={isLoading}
                  title="Verification Code"
                />

                <button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>

                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isLoading}
                  className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>

                <button
                  onClick={() => {
                    setOtpStep('request');
                    setOtp('');
                    otpForm.reset();
                  }}
                  className="w-full py-2 px-4 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Try Different Email
                </button>
              </div>
            )}
          </>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
