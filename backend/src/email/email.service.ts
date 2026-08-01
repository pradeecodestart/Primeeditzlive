import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get('FROM_EMAIL', 'noreply@yourdomain.com');
  }

  async sendEmailVerificationOTP(email: string, otp: string, firstName: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `${this.configService.get('APP_NAME', 'MyApp')} <${this.fromEmail}>`,
        to: [email],
        subject: 'Verify Your Email - OTP Code',
        html: this.getEmailOTPTemplate(firstName, otp),
      });

      if (error) {
        this.logger.error('Failed to send email verification OTP', error);
        throw new Error('Failed to send verification OTP');
      }

      this.logger.log(`Email verification OTP sent to ${email}`);
      return data;
    } catch (error) {
      this.logger.error('Error sending email verification OTP', error);
      throw error;
    }
  }

  async sendLoginOTP(email: string, otp: string, firstName: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `${this.configService.get('APP_NAME', 'MyApp')} <${this.fromEmail}>`,
        to: [email],
        subject: 'Your Login Code',
        html: this.getLoginOTPTemplate(firstName, otp),
      });

      if (error) {
        this.logger.error('Failed to send login OTP', error);
        throw new Error('Failed to send login OTP');
      }

      this.logger.log(`Login OTP sent to ${email}`);
      return data;
    } catch (error) {
      this.logger.error('Error sending login OTP', error);
      throw error;
    }
  }

  async sendPasswordResetOTP(email: string, otp: string, firstName: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `${this.configService.get('APP_NAME', 'MyApp')} <${this.fromEmail}>`,
        to: [email],
        subject: 'Reset Your Password - OTP Code',
        html: this.getPasswordResetOTPTemplate(firstName, otp),
      });

      if (error) {
        this.logger.error('Failed to send password reset OTP', error);
        throw new Error('Failed to send password reset OTP');
      }

      this.logger.log(`Password reset OTP sent to ${email}`);
      return data;
    } catch (error) {
      this.logger.error('Error sending password reset OTP', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `${this.configService.get('APP_NAME', 'MyApp')} <${this.fromEmail}>`,
        to: [email],
        subject: 'Welcome! Your Email is Verified',
        html: this.getWelcomeEmailTemplate(firstName),
      });

      if (error) {
        this.logger.error('Failed to send welcome email', error);
      }

      this.logger.log(`Welcome email sent to ${email}`);
      return data;
    } catch (error) {
      this.logger.error('Error sending welcome email', error);
    }
  }

  private getEmailOTPTemplate(firstName: string, otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Verify Your Email</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                        Hi ${firstName || 'there'},
                      </p>
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                        Thank you for signing up! Use the verification code below to complete your registration:
                      </p>
                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
                        <p style="margin: 0; font-size: 48px; font-weight: bold; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${otp}
                        </p>
                      </div>
                      <p style="margin: 30px 0 20px 0; font-size: 14px; line-height: 20px; color: #666666; text-align: center;">
                        This code will expire in <strong>10 minutes</strong>
                      </p>
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0; font-size: 14px; line-height: 20px; color: #856404;">
                          <strong>⚠️ Security Note:</strong> Never share this code with anyone. We will never ask for your verification code.
                        </p>
                      </div>
                      <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 20px; color: #999999; text-align: center;">
                        If you didn't create an account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999;">
                        © ${new Date().getFullYear()} ${this.configService.get('APP_NAME', 'MyApp')}. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private getLoginOTPTemplate(firstName: string, otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔐 Login Code</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                        Hi ${firstName},
                      </p>
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                        Use the code below to log in to your account:
                      </p>
                      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">Your Login Code</p>
                        <p style="margin: 0; font-size: 48px; font-weight: bold; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${otp}
                        </p>
                      </div>
                      <p style="margin: 30px 0 20px 0; font-size: 14px; line-height: 20px; color: #666666; text-align: center;">
                        This code will expire in <strong>10 minutes</strong>
                      </p>
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0; font-size: 14px; line-height: 20px; color: #856404;">
                          <strong>⚠️ Security Alert:</strong> If you didn't request this code, someone may be trying to access your account. Please secure your account immediately.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999;">
                        © ${new Date().getFullYear()} ${this.configService.get('APP_NAME', 'MyApp')}. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private getPasswordResetOTPTemplate(firstName: string, otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Reset Password</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                        Hi ${firstName},
                      </p>
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                        We received a request to reset your password. Use the code below to proceed:
                      </p>
                      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">Password Reset Code</p>
                        <p style="margin: 0; font-size: 48px; font-weight: bold; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${otp}
                        </p>
                      </div>
                      <p style="margin: 30px 0 20px 0; font-size: 14px; line-height: 20px; color: #666666; text-align: center;">
                        This code will expire in <strong>10 minutes</strong>
                      </p>
                      <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 20px; color: #999999; text-align: center;">
                        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999;">
                        © ${new Date().getFullYear()} ${this.configService.get('APP_NAME', 'MyApp')}. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome!</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 Welcome!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                        Hi ${firstName},
                      </p>
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #333333;">
                        Your email has been successfully verified! You now have full access to all features.
                      </p>
                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #333333;">
                        Get started by exploring your dashboard:
                      </p>
                      <table role="presentation" style="margin: 0 auto;">
                        <tr>
                          <td style="border-radius: 6px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
                            <a href="${this.configService.get('CLIENT_PORTAL_URL')}/dashboard" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                              Go to Dashboard
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999;">
                        © ${new Date().getFullYear()} ${this.configService.get('APP_NAME', 'MyApp')}. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }
}
