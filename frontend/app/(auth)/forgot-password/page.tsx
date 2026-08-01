'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { OTPInput } from '@/components/OTPInput';
import { apiClient } from '@/lib/api-client';

const requestSchema = z.object({
  email: z.string().email('Invalid email'),
});

const resetSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RequestValues = z.infer<typeof requestSchema>;
type ResetValues = z.infer<typeof resetSchema>;

type Step = 'request' | 'verify' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Request password reset OTP
  const onRequest = async (values: RequestValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.requestPasswordReset(values.email);
      setEmail(values.email);
      setStep('verify');

      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify reset OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.verifyPasswordResetOTP(email, otp);
      setResetToken(response.resetToken);
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const onReset = async (values: ResetValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.resetPassword(resetToken, values.newPassword);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
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
      await apiClient.requestPasswordReset(email);
      setOtp('');
      setResendTimer(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Password Reset</h1>
          <p className="text-gray-600 text-sm mt-2">
            Your password has been successfully reset
          </p>

          <p className="text-sm text-gray-600 mt-6 mb-6">
            You can now sign in with your new password.
          </p>

          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 text-sm mt-2">
            We'll help you regain access to your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                disabled={isLoading}
                {...requestForm.register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {requestForm.formState.errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {requestForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              We've sent a reset code to {email}
            </p>

            <OTPInput
              value={otp}
              onChange={setOtp}
              onComplete={handleVerifyOTP}
              disabled={isLoading}
              title="Reset Code"
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
          </div>
        )}

        {step === 'reset' && (
          <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                {...resetForm.register('newPassword')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {resetForm.formState.errors.newPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {resetForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                {...resetForm.register('confirmPassword')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
