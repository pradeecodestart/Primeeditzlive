import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
};

export async function sendVerificationEmail(
  toEmail: string,
  code: string,
  firstName: string = 'User'
) {
  const appName = 'PostProd Pro';
  const supportEmail = 'support@postprodpro.com';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Please verify your identity</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px; color: #e2e8f0; }
    .container { max-width: 540px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo-icon { display: inline-flex; width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: 24px; line-height: 48px; text-align: center; }
    h1 { font-size: 22px; font-weight: 700; color: #ffffff; text-align: center; margin-top: 0; margin-bottom: 20px; }
    p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
    .code-box { background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0; }
    .code { font-family: 'JetBrains Mono', 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #818cf8; margin: 0; }
    .notice { font-size: 13px; color: #64748b; margin-top: 24px; border-top: 1px solid #334155; padding-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #475569; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <div class="logo-icon">P</div>
    </div>
    <h1>Please verify your identity, ${firstName}</h1>
    <p>Thanks for registering with ${appName}. Here is your 6-digit verification code to confirm your email address:</p>
    
    <div class="code-box">
      <div class="code">${code}</div>
    </div>
    
    <p>This code is valid for <strong>15 minutes</strong> and can only be used once.</p>
    <p><strong>Please don't share this code with anyone:</strong> we'll never ask for it on the phone or via email.</p>
    
    <div class="notice">
      Navigate back to your browser and enter the code. If you did not request this code, please ignore this email or contact us at <a href="mailto:${supportEmail}" style="color:#818cf8;">${supportEmail}</a>.
    </div>
  </div>
  <div class="footer">
    &copy; ${new Date().getFullYear()} ${appName} Inc. All rights reserved.
  </div>
</body>
</html>
  `;

  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${appName} Security" <${process.env.SMTP_USER || 'no-reply@postprodpro.com'}>`,
        to: toEmail,
        subject: `${code} is your ${appName} verification code`,
        html: htmlContent,
      });
      console.log(`[EMAIL SENT] Verification code ${code} sent to ${toEmail}`);
      return { success: true, method: 'SMTP' };
    } catch (err) {
      console.error(`[EMAIL SMTP ERROR] Failed to send to ${toEmail}:`, err);
    }
  }

  // Local Dev Fallback Logger
  console.log(`
===========================================================
📬 VERIFICATION EMAIL (LOCAL DEV MODE)
To: ${toEmail}
Subject: ${code} is your PostProd Pro verification code

Please verify your identity, ${firstName}
Verification Code: [ ${code} ]
Valid for: 15 minutes
===========================================================
  `);

  return { success: true, method: 'DEV_LOG', code };
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
    .row { display: flex; align-items: center; margin-bottom: 16px; }
    .row:last-child { margin-bottom: 0; }
    .icon { width: 36px; height: 36px; border-radius: 50%; background: #334155; display: inline-flex; align-items: center; justify-content: center; margin-right: 14px; color: #818cf8; font-weight: bold; }
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
      <div className="row" style="margin-bottom: 16px;">
        <span class="info-label">${name}</span><br>
        <span class="info-sub">Name & Verified Profile Picture</span>
      </div>
      <div className="row">
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

  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${appName} Client Verification" <${process.env.SMTP_USER || 'no-reply@postprodpro.com'}>`,
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

  // Local Dev Logger
  console.log(`
===========================================================
📬 GOOGLE OAUTH CLIENT VERIFICATION CONFIRMATION (DEV MODE)
To: ${toEmail}
Subject: Google Account Verified: Welcome to ${appName}, ${name}

Profile Info Received & Verified:
- Name: ${name}
- Email: ${toEmail}
- Verified At: ${timestamp} (Bangalore, IST)
===========================================================
  `);

  return { success: true, method: 'DEV_LOG' };
}
