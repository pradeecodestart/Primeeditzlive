import { Injectable, BadRequestException, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { OTPService } from '../otp/otp.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private otp: OTPService,
    private email: EmailService,
  ) {}

  /**
   * Register a new user
   */
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    portal: 'STAFF' | 'CLIENT';
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Generate OTP
    const emailOtp = this.otp.generateOTP();
    const emailOtpExpires = this.otp.generateOTPExpiry();

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        portal: data.portal,
        emailOtp,
        emailOtpExpires,
        emailOtpAttempts: 0,
      },
    });

    // Send OTP email
    try {
      await this.email.sendEmailVerificationOTP(
        user.email,
        emailOtp,
        user.firstName,
      );
    } catch (error) {
      this.logger.error('Failed to send verification OTP', error);
      // Delete user if email fails
      await this.prisma.user.delete({ where: { id: user.id } });
      throw new Error('Failed to send verification email');
    }

    return {
      message: 'User registered. Please verify your email.',
      email: user.email,
    };
  }

  /**
   * Verify email OTP
   */
  async verifyEmailOTP(email: string, otp: string) {
    // Validate OTP format
    if (!this.otp.isValidOTPFormat(otp)) {
      throw new BadRequestException('Invalid OTP format');
    }

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if already verified
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Check OTP attempts
    if (this.otp.isTooManyAttempts(user.emailOtpAttempts)) {
      throw new BadRequestException('Too many attempts. Please request a new OTP.');
    }

    // Check OTP expiry
    if (!user.emailOtpExpires || this.otp.isOTPExpired(user.emailOtpExpires)) {
      throw new BadRequestException('OTP expired. Please request a new code.');
    }

    // Verify OTP
    if (user.emailOtp !== otp) {
      // Increment attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailOtpAttempts: user.emailOtpAttempts + 1 },
      });
      throw new BadRequestException('Invalid OTP');
    }

    // Mark email as verified
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        emailOtp: null,
        emailOtpExpires: null,
        emailOtpAttempts: 0,
      },
    });

    // Send welcome email
    try {
      await this.email.sendWelcomeEmail(updatedUser.email, updatedUser.firstName);
    } catch (error) {
      this.logger.warn('Failed to send welcome email', error);
    }

    // Generate tokens
    const tokens = this.generateTokens(updatedUser);

    return {
      message: 'Email verified successfully',
      user: this.formatUser(updatedUser),
      ...tokens,
    };
  }

  /**
   * Resend email OTP
   */
  async resendEmailOTP(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new OTP
    const emailOtp = this.otp.generateOTP();
    const emailOtpExpires = this.otp.generateOTPExpiry();

    // Reset attempts
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailOtp,
        emailOtpExpires,
        emailOtpAttempts: 0,
      },
    });

    // Send OTP email
    await this.email.sendEmailVerificationOTP(user.email, emailOtp, user.firstName);

    return { message: 'OTP resent to your email' };
  }

  /**
   * Password login
   */
  async login(
    email: string,
    password: string,
    portal: 'STAFF' | 'CLIENT',
  ) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email verified
    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email first');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Check portal access
    if (user.portal !== portal) {
      throw new UnauthorizedException('Access denied for this portal');
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      message: 'Login successful',
      user: this.formatUser(user),
      ...tokens,
    };
  }

  /**
   * Request login OTP
   */
  async requestLoginOTP(email: string, portal: 'STAFF' | 'CLIENT') {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If user exists, OTP will be sent' };
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email first');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (user.portal !== portal) {
      throw new UnauthorizedException('Access denied for this portal');
    }

    // Generate OTP
    const loginOtp = this.otp.generateOTP();
    const loginOtpExpires = this.otp.generateOTPExpiry();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        loginOtp,
        loginOtpExpires,
        loginOtpAttempts: 0,
      },
    });

    // Send OTP email
    await this.email.sendLoginOTP(user.email, loginOtp, user.firstName);

    return { message: 'Login OTP sent to your email' };
  }

  /**
   * Verify login OTP
   */
  async verifyLoginOTP(email: string, otp: string, portal: 'STAFF' | 'CLIENT') {
    // Validate OTP format
    if (!this.otp.isValidOTPFormat(otp)) {
      throw new BadRequestException('Invalid OTP format');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email first');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (user.portal !== portal) {
      throw new UnauthorizedException('Access denied for this portal');
    }

    // Check OTP attempts
    if (this.otp.isTooManyAttempts(user.loginOtpAttempts)) {
      throw new BadRequestException('Too many attempts. Please request a new OTP.');
    }

    // Check OTP expiry
    if (!user.loginOtpExpires || this.otp.isOTPExpired(user.loginOtpExpires)) {
      throw new BadRequestException('OTP expired. Please request a new code.');
    }

    // Verify OTP
    if (user.loginOtp !== otp) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { loginOtpAttempts: user.loginOtpAttempts + 1 },
      });
      throw new BadRequestException('Invalid OTP');
    }

    // Clear OTP and update last login
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        loginOtp: null,
        loginOtpExpires: null,
        loginOtpAttempts: 0,
        lastLoginAt: new Date(),
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(updatedUser);

    return {
      message: 'Login successful',
      user: this.formatUser(updatedUser),
      ...tokens,
    };
  }

  /**
   * Request password reset OTP
   */
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If user exists, reset code will be sent' };
    }

    // Generate OTP
    const resetPasswordOtp = this.otp.generateOTP();
    const resetPasswordOtpExpires = this.otp.generateOTPExpiry();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordOtp,
        resetPasswordOtpExpires,
        resetPasswordOtpAttempts: 0,
      },
    });

    // Send OTP email
    await this.email.sendPasswordResetOTP(
      user.email,
      resetPasswordOtp,
      user.firstName,
    );

    return { message: 'Password reset code sent to your email' };
  }

  /**
   * Verify password reset OTP
   */
  async verifyPasswordResetOTP(email: string, otp: string) {
    // Validate OTP format
    if (!this.otp.isValidOTPFormat(otp)) {
      throw new BadRequestException('Invalid OTP format');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check OTP attempts
    if (this.otp.isTooManyAttempts(user.resetPasswordOtpAttempts)) {
      throw new BadRequestException('Too many attempts. Please request a new code.');
    }

    // Check OTP expiry
    if (
      !user.resetPasswordOtpExpires ||
      this.otp.isOTPExpired(user.resetPasswordOtpExpires)
    ) {
      throw new BadRequestException('Reset code expired. Please request a new one.');
    }

    // Verify OTP
    if (user.resetPasswordOtp !== otp) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordOtpAttempts: user.resetPasswordOtpAttempts + 1 },
      });
      throw new BadRequestException('Invalid reset code');
    }

    // Generate reset token
    const resetToken = this.jwt.sign(
      { sub: user.id, type: 'password_reset' },
      { expiresIn: '15m' },
    );

    return { resetToken };
  }

  /**
   * Reset password
   */
  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const decoded = this.jwt.verify(resetToken);

      if (decoded.type !== 'password_reset') {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update password and clear reset fields
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetPasswordOtp: null,
          resetPasswordOtpExpires: null,
          resetPasswordOtpAttempts: 0,
        },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  /**
   * Refresh tokens
   */
  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const tokens = this.generateTokens(user);

      return {
        message: 'Tokens refreshed',
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(user: any) {
    const accessToken = this.jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        portal: user.portal,
      },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwt.sign(
      { sub: user.id },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  /**
   * Format user object for response
   */
  private formatUser(user: any) {
    const { passwordHash, emailOtp, loginOtp, resetPasswordOtp, ...rest } = user;
    return rest;
  }
}
