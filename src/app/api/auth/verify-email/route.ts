import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/emailService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      );
    }

    const cleanToken = token.trim();

    // Look up user by emailVerificationToken OR verificationCode
    const user: any = await prisma.user.findFirst({
      where: {
        OR: [
          { emailVerificationToken: cleanToken },
          { verificationCode: cleanToken },
        ],
      } as any,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification link' },
        { status: 400 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: 'Your email address is already verified!',
      });
    }

    const expiryDate = user.emailVerificationExpires || user.verificationExpiry;
    if (expiryDate && new Date() > new Date(expiryDate)) {
      return NextResponse.json(
        { success: false, message: 'Verification link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Update user status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerified: new Date(),
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
        verificationCode: null,
        verificationExpiry: null,
      } as any,
    });

    // Send Welcome Email asynchronously
    sendWelcomeEmail(user.email, user.firstName).catch((e) =>
      console.warn('Welcome email error:', e)
    );

    return NextResponse.json({
      success: true,
      alreadyVerified: false,
      message: 'Email verified successfully!',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error: any) {
    console.error('Verify email GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification server error' },
      { status: 500 }
    );
  }
}
