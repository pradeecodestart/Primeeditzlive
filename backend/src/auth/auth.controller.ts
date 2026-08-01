import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private auth: AuthService) {}

  /**
   * POST /auth/register
   * Register a new user
   */
  @Post('register')
  async register(@Body() data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    portal: 'STAFF' | 'CLIENT';
  }) {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new BadRequestException('Missing required fields');
    }

    return this.auth.register(data);
  }

  /**
   * POST /auth/verify-email-otp
   * Verify email with OTP
   */
  @Post('verify-email-otp')
  async verifyEmailOTP(@Body() data: { email: string; otp: string }) {
    if (!data.email || !data.otp) {
      throw new BadRequestException('Email and OTP required');
    }

    return this.auth.verifyEmailOTP(data.email, data.otp);
  }

  /**
   * POST /auth/resend-email-otp
   * Resend email verification OTP
   */
  @Post('resend-email-otp')
  async resendEmailOTP(@Body() data: { email: string }) {
    if (!data.email) {
      throw new BadRequestException('Email required');
    }

    return this.auth.resendEmailOTP(data.email);
  }

  /**
   * POST /auth/login
   * Login with email and password
   */
  @Post('login')
  async login(@Body() data: {
    email: string;
    password: string;
    portal: 'STAFF' | 'CLIENT';
  }) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password required');
    }

    return this.auth.login(data.email, data.password, data.portal);
  }

  /**
   * POST /auth/request-login-otp
   * Request OTP for passwordless login
   */
  @Post('request-login-otp')
  async requestLoginOTP(@Body() data: {
    email: string;
    portal: 'STAFF' | 'CLIENT';
  }) {
    if (!data.email) {
      throw new BadRequestException('Email required');
    }

    return this.auth.requestLoginOTP(data.email, data.portal);
  }

  /**
   * POST /auth/verify-login-otp
   * Verify login OTP
   */
  @Post('verify-login-otp')
  async verifyLoginOTP(@Body() data: {
    email: string;
    otp: string;
    portal: 'STAFF' | 'CLIENT';
  }) {
    if (!data.email || !data.otp) {
      throw new BadRequestException('Email and OTP required');
    }

    return this.auth.verifyLoginOTP(data.email, data.otp, data.portal);
  }

  /**
   * POST /auth/request-password-reset
   * Request password reset OTP
   */
  @Post('request-password-reset')
  async requestPasswordReset(@Body() data: { email: string }) {
    if (!data.email) {
      throw new BadRequestException('Email required');
    }

    return this.auth.requestPasswordReset(data.email);
  }

  /**
   * POST /auth/verify-password-reset-otp
   * Verify password reset OTP and get reset token
   */
  @Post('verify-password-reset-otp')
  async verifyPasswordResetOTP(@Body() data: { email: string; otp: string }) {
    if (!data.email || !data.otp) {
      throw new BadRequestException('Email and OTP required');
    }

    return this.auth.verifyPasswordResetOTP(data.email, data.otp);
  }

  /**
   * POST /auth/reset-password
   * Complete password reset
   */
  @Post('reset-password')
  async resetPassword(@Body() data: {
    resetToken: string;
    newPassword: string;
  }) {
    if (!data.resetToken || !data.newPassword) {
      throw new BadRequestException('Reset token and new password required');
    }

    return this.auth.resetPassword(data.resetToken, data.newPassword);
  }

  /**
   * POST /auth/refresh
   * Refresh JWT token
   */
  @Post('refresh')
  async refresh(@Body() data: { refreshToken: string }) {
    if (!data.refreshToken) {
      throw new BadRequestException('Refresh token required');
    }

    return this.auth.refreshTokens(data.refreshToken);
  }

  /**
   * GET /auth/me
   * Get current user profile (requires JWT)
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return { user: req.user };
  }
}
