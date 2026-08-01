import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/emailService';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email address is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user: any = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      return NextResponse.json({ message: 'User account not found' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: 'Email is already verified', alreadyVerified: true });
    }

    // Generate new 1-click token and 6-digit OTP
    const token = crypto.randomBytes(32).toString('hex');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { email: cleanEmail },
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: expires,
        verificationCode: code,
        verificationExpiry: expires,
      } as any,
    });

    await sendVerificationEmail(cleanEmail, code, user.firstName, token);

    return NextResponse.json({
      success: true,
      message: 'Verification link & code sent successfully! Please check your email.',
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ message: 'Failed to resend verification email' }, { status: 500 });
  }
}
