import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ message: 'Email and verification code are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    const user: any = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    if (user.isEmailVerified && !user.verificationCode) {
      return NextResponse.json({ message: 'Email is already verified', verified: true });
    }

    if (!user.verificationCode || user.verificationCode !== cleanCode) {
      return NextResponse.json({ message: 'Invalid verification code. Please check your email and try again.' }, { status: 400 });
    }

    if (user.verificationExpiry && new Date() > new Date(user.verificationExpiry)) {
      return NextResponse.json({ message: 'Verification code has expired. Please request a new code.' }, { status: 400 });
    }

    // Update user as email verified
    const updatedUser: any = await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        isEmailVerified: true,
        emailVerified: new Date(),
        verificationCode: null,
        verificationExpiry: null,
      } as any,
    });

    return NextResponse.json({
      success: true,
      message: 'Email address verified successfully!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        portal: updatedUser.portal,
        isEmailVerified: true,
      },
    });
  } catch (error: any) {
    console.error('Verify code error:', error);
    return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
  }
}
