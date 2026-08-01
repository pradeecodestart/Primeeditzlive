import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export enum OTPType {
  EMAIL_VERIFICATION = 'email_verification',
  LOGIN = 'login',
  PASSWORD_RESET = 'password_reset',
}

@Injectable()
export class OTPService {
  /**
   * Generate 6-digit OTP
   */
  generateOTP(): string {
    const otp = crypto.randomInt(100000, 999999).toString();
    return otp;
  }

  /**
   * Generate expiry time (10 minutes from now)
   */
  generateOTPExpiry(minutes: number = 10): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry;
  }

  /**
   * Validate OTP format
   */
  isValidOTPFormat(otp: string): boolean {
    return /^\d{6}$/.test(otp);
  }

  /**
   * Check if OTP is expired
   */
  isOTPExpired(expiryDate: Date): boolean {
    return new Date() > expiryDate;
  }

  /**
   * Check if too many attempts
   */
  isTooManyAttempts(attempts: number, maxAttempts: number = 5): boolean {
    return attempts >= maxAttempts;
  }

  /**
   * Hash OTP for storage (optional, for extra security)
   */
  hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /**
   * Verify OTP hash
   */
  verifyOTPHash(otp: string, hash: string): boolean {
    return this.hashOTP(otp) === hash;
  }
}
