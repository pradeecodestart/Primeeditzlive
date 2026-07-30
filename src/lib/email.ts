import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"PostProd Pro" <noreply@postprodpro.com>',
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}

export function generateWelcomeEmail(name: string) {
  return `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4F46E5;">Welcome to PostProd Pro, ${name}!</h2>
      <p>We are excited to have you on board. Manage all your post-production orders and invoices effortlessly.</p>
      <p>Log in to your portal to start submitting orders today!</p>
    </div>
  `;
}

export function generateInvoiceEmail(invoiceNumber: string, amount: string) {
  return `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4F46E5;">New Invoice Generated</h2>
      <p>Invoice <strong>${invoiceNumber}</strong> for amount <strong>${amount}</strong> has been generated.</p>
      <p>Please log in to your dashboard to view details and process payment.</p>
    </div>
  `;
}
