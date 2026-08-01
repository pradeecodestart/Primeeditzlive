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
  const formattedCode = code.split('').join(' ');
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
    .logo-icon { display: inline-flex; width: 48px; h-height: 48px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: 24px; line-height: 48px; text-align: center; }
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
    <p>Thanks for registering with ${appName}. Here is your verification code to confirm your email address:</p>
    
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

  // Fallback visual logger for local development / testing
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
