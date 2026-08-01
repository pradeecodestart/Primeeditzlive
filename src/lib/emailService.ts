import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && apiKey !== 'your-resend-api-key-here') {
    return new Resend(apiKey);
  }
  return null;
};

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (user && pass && user !== 'your-gmail@gmail.com' && pass !== 'your-gmail-app-password') {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return null;
};

export async function sendVerificationEmail(
  toEmail: string,
  code: string,
  firstName: string = 'User',
  token?: string
) {
  const appName = 'PostProd Pro';
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token || code}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Please verify your identity</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px; color: #e2e8f0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo-icon { display: inline-flex; width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: 24px; line-height: 48px; text-align: center; }
    h1 { font-size: 22px; font-weight: 700; color: #ffffff; text-align: center; margin-top: 0; margin-bottom: 20px; }
    p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px; }
    .code-box { background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .code { font-family: 'JetBrains Mono', 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #818cf8; margin: 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; margin: 16px 0; text-align: center; }
    .notice { font-size: 13px; color: #64748b; margin-top: 28px; border-top: 1px solid #334155; padding-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #475569; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <div class="logo-icon">P</div>
    </div>
    <h1>Please verify your identity, ${firstName}</h1>
    <p>Thanks for registering with ${appName}. Use either option below to verify your email address:</p>
    
    <div style="text-align: center;">
      <a href="${verificationUrl}" class="btn">Click Here to Verify Email (1-Click)</a>
    </div>

    <p style="text-align: center; font-size: 13px; color: #64748b; margin-top: 20px;">OR enter this 6-digit OTP code in your browser:</p>

    <div class="code-box">
      <div class="code">${code}</div>
    </div>
    
    <p>This verification link and code are valid for <strong>24 hours</strong>.</p>
    <p><strong>Please don't share this with anyone:</strong> we'll never ask for it on the phone or via email.</p>
    
    <div class="notice">
      Or copy and paste this link into your browser: <br>
      <a href="${verificationUrl}" style="color:#818cf8; word-break: break-all;">${verificationUrl}</a>
    </div>
  </div>
  <div class="footer">
    &copy; ${new Date().getFullYear()} ${appName} Inc. Bangalore, Karnataka, India.
  </div>
</body>
</html>
  `;

  // Option 1: Resend SDK
  const resend = getResendClient();
  if (resend) {
    try {
      const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
      const response = await resend.emails.send({
        from: `${appName} Security <${fromEmail}>`,
        to: [toEmail],
        subject: `Verify Your Email Address - ${appName}`,
        html: htmlContent,
      });
      console.log(`[RESEND API EMAIL SENT SUCCESS]:`, response);
      return { success: true, method: 'RESEND', data: response };
    } catch (err) {
      console.error(`[RESEND API ERROR]:`, err);
    }
  }

  // Option 2: Nodemailer SMTP (Gmail / SendGrid / Custom SMTP)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const fromEmail = process.env.SMTP_USER || process.env.EMAIL_USER;
      const info = await transporter.sendMail({
        from: `"${appName} Security" <${fromEmail}>`,
        to: toEmail,
        subject: `Verify Your Email Address - ${appName}`,
        html: htmlContent,
      });
      console.log(`[SMTP GMAIL EMAIL SENT SUCCESS to ${toEmail}]:`, info.messageId);
      return { success: true, method: 'SMTP', messageId: info.messageId };
    } catch (err) {
      console.error(`[SMTP GMAIL ERROR] Failed to send email to ${toEmail}:`, err);
    }
  }

  // Local Dev Fallback Logger
  console.log(`
===========================================================
📬 VERIFICATION EMAIL & LINK (LOCAL DEV MODE)
To: ${toEmail}
Subject: Verify Your Email Address - PostProd Pro

Verify Email Link: ${verificationUrl}
6-Digit OTP Code:  [ ${code} ]
===========================================================
  `);

  return { success: true, method: 'DEV_LOG', code, verificationUrl };
}

export async function sendWelcomeEmail(toEmail: string, firstName: string = 'Valued Client') {
  const appName = 'PostProd Pro';
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to PostProd Pro</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px; color: #e2e8f0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; }
    h1 { font-size: 24px; font-weight: 700; color: #38ef7d; text-align: center; margin-top: 0; }
    p { font-size: 15px; line-height: 1.6; color: #cbd5e1; }
    .btn { display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 Welcome, ${firstName}!</h1>
    <p>Your email address <strong>${toEmail}</strong> has been successfully verified!</p>
    <p>You now have 100% full access to all features in PostProd Pro Client Portal including project orders, video reviews, invoices, and real-time chat.</p>
    <div style="text-align: center;">
      <a href="${baseUrl}/dashboard" class="btn">Explore Your Dashboard →</a>
    </div>
  </div>
</body>
</html>
  `;

  const resend = getResendClient();
  if (resend) {
    try {
      const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
      await resend.emails.send({
        from: `${appName} <${fromEmail}>`,
        to: [toEmail],
        subject: `🎉 Welcome! Your Email is Verified - ${appName}`,
        html: htmlContent,
      });
      return { success: true, method: 'RESEND' };
    } catch (e) {
      console.warn('Welcome email Resend error:', e);
    }
  }

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${appName}" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `🎉 Welcome! Your Email is Verified - ${appName}`,
        html: htmlContent,
      });
      return { success: true, method: 'SMTP' };
    } catch (e) {
      console.warn('Welcome email SMTP error:', e);
    }
  }

  console.log(`[WELCOME EMAIL SENT TO]: ${toEmail}`);
  return { success: true, method: 'DEV_LOG' };
}

export async function sendGoogleOAuthVerificationConfirmation(
  toEmail: string,
  name: string = 'Client User'
) {
  const appName = 'PostProd Pro';
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Google Sign-In Email Verification Confirmation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px; color: #e2e8f0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .banner { background: #dbeafe; border: 1px solid #93c5fd; border-radius: 12px; padding: 18px; color: #1e3a8a; font-size: 14px; line-height: 1.5; margin-bottom: 28px; }
    .banner strong { color: #1e40af; }
    h2 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 20px; }
    .card { background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .info-label { font-size: 14px; font-weight: 600; color: #ffffff; }
    .info-sub { font-size: 12px; color: #94a3b8; }
    .btn { display: inline-block; background: #6366f1; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; margin-top: 12px; }
    .footer { text-align: center; font-size: 12px; color: #475569; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="banner">
      <strong>ℹ️ Identity Verification Confirmed:</strong> You're receiving this email because you signed in to <strong>${appName}</strong> using your verified Google Account on <strong>${timestamp} (Bangalore, IST)</strong>.
    </div>

    <h2>${appName} received and verified your client profile:</h2>

    <div class="card">
      <div style="margin-bottom: 16px;">
        <span class="info-label">${name}</span><br>
        <span class="info-sub">Name & Verified Profile Picture</span>
      </div>
      <div>
        <span class="info-label" style="color:#818cf8;">${toEmail}</span><br>
        <span class="info-sub">Verified Gmail Address</span>
      </div>
    </div>

    <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
      Your Gmail identity has been <strong>100% verified</strong> for long-term client collaboration, project orders, and invoices.
    </p>

    <div style="text-align: center; margin-top: 28px;">
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="btn">Go to Client Dashboard →</a>
    </div>
  </div>
  <div class="footer">
    &copy; ${new Date().getFullYear()} ${appName} Inc. Bangalore, Karnataka, India.
  </div>
</body>
</html>
  `;

  const resend = getResendClient();
  if (resend) {
    try {
      const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
      await resend.emails.send({
        from: `${appName} Client Verification <${fromEmail}>`,
        to: [toEmail],
        subject: `Google Account Verified: Welcome to ${appName}, ${name}`,
        html: htmlContent,
      });
      return { success: true, method: 'RESEND' };
    } catch (e) {
      console.warn('Google verification email Resend error:', e);
    }
  }

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${appName} Client Verification" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Google Account Verified: Welcome to ${appName}, ${name}`,
        html: htmlContent,
      });
      console.log(`[GOOGLE OAUTH VERIFICATION EMAIL SENT] Confirmation sent to ${toEmail}`);
      return { success: true, method: 'SMTP' };
    } catch (err) {
      console.error(`[EMAIL SMTP ERROR] Failed to send Google confirmation to ${toEmail}:`, err);
    }
  }

  console.log(`[GOOGLE OAUTH CONFIRMATION SENT TO]: ${toEmail}`);
  return { success: true, method: 'DEV_LOG' };
}
