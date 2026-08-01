import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/emailService';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email address is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json({ message: 'User account not found' }, { status: 404 });
    }

    // Generate 6-digit numeric OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        verificationCode: code,
        verificationExpiry: expiry,
      } as any,
    });

    await sendVerificationEmail(normalizedEmail, code, user.firstName);

    return NextResponse.json({
      message: 'Verification code sent successfully',
      email: normalizedEmail,
      expiresInMinutes: 15,
    });
  } catch (error: any) {
    console.error('Send verification code error:', error);
    return NextResponse.json({ message: 'Failed to send verification code' }, { status: 500 });
  }
}
