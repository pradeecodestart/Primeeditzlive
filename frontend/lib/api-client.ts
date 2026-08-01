import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add response interceptor
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError<ApiErrorResponse>) => {
        const message = error.response?.data?.message || error.message;
        return Promise.reject(new Error(message));
      },
    );
  }

  // Auth endpoints
  register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    portal: 'STAFF' | 'CLIENT';
  }) {
    return this.instance.post('/auth/register', data);
  }

  verifyEmailOTP(email: string, otp: string) {
    return this.instance.post('/auth/verify-email-otp', { email, otp });
  }

  resendEmailOTP(email: string) {
    return this.instance.post('/auth/resend-email-otp', { email });
  }

  login(email: string, password: string, portal: 'STAFF' | 'CLIENT') {
    return this.instance.post('/auth/login', {
      email,
      password,
      portal,
    });
  }

  requestLoginOTP(email: string, portal: 'STAFF' | 'CLIENT') {
    return this.instance.post('/auth/request-login-otp', {
      email,
      portal,
    });
  }

  verifyLoginOTP(email: string, otp: string, portal: 'STAFF' | 'CLIENT') {
    return this.instance.post('/auth/verify-login-otp', {
      email,
      otp,
      portal,
    });
  }

  requestPasswordReset(email: string) {
    return this.instance.post('/auth/request-password-reset', { email });
  }

  verifyPasswordResetOTP(email: string, otp: string) {
    return this.instance.post('/auth/verify-password-reset-otp', { email, otp });
  }

  resetPassword(resetToken: string, newPassword: string) {
    return this.instance.post('/auth/reset-password', {
      resetToken,
      newPassword,
    });
  }

  refresh(refreshToken: string) {
    return this.instance.post('/auth/refresh', { refreshToken });
  }

  getProfile() {
    return this.instance.get('/auth/me');
  }
}

export const apiClient = new ApiClient();
