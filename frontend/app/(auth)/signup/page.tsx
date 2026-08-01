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

const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  // Handle signup form submission
  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.register({
        ...values,
        portal: 'CLIENT',
      });

      setEmail(values.email);
      setStep('verify');

      // Start resend timer
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
      const response = await apiClient.verifyEmailOTP(email, otp);

      // Store tokens and user
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
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
      await apiClient.resendEmailOTP(email);
      setOtp('');
      setResendTimer(60);

      const timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600 text-sm mt-2">
              We've sent a verification code to {email}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

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
            className="w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="mt-6 space-y-2">
            <p className="text-center text-sm text-gray-600">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || isLoading}
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : 'Resend Code'}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            This code will expire in 10 minutes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 text-sm mt-2">Join us and get started</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                disabled={isLoading}
                {...form.register('firstName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {form.formState.errors.firstName && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                disabled={isLoading}
                {...form.register('lastName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {form.formState.errors.lastName && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              disabled={isLoading}
              {...form.register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              {...form.register('password')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
