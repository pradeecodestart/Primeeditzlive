import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { saveRegisteredUser, getRegisteredUserByEmail } from '@/lib/registeredUsersStore';
import { sendVerificationEmail } from '@/lib/emailService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, company, phone, portal } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'First name, last name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const targetPortal = (portal || 'CLIENT').toUpperCase() === 'STAFF' ? 'STAFF' : 'CLIENT';
    const assignedRole = targetPortal === 'STAFF' ? 'STAFF' : 'CLIENT';

    // Check registered store first
    const existingMemoryUser = getRegisteredUserByEmail(cleanEmail);
    if (existingMemoryUser) {
      return NextResponse.json(
        { message: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    // Check DB
    try {
      const existingDbUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingDbUser) {
        return NextResponse.json(
          { message: 'An account with this email address already exists.' },
          { status: 400 }
        );
      }
    } catch (e) {
      // Ignore DB check error if starting up
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newUserObj = {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      email: cleanEmail,
      password: hashedPassword,
      firstName,
      lastName,
      role: assignedRole as any,
      portal: targetPortal as any,
      company: company || '',
      phone: phone || '',
      isEmailVerified: false,
      verificationCode,
      verificationExpiry,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiry,
    };

    // Save to shared memory store
    saveRegisteredUser(newUserObj);

    // Save to Database
    try {
      await prisma.user.create({
        data: {
          id: newUserObj.id,
          firstName,
          lastName,
          email: cleanEmail,
          password: hashedPassword,
          role: assignedRole as any,
          portal: targetPortal as any,
          company: company || null,
          phone: phone || null,
          isEmailVerified: false,
          verificationCode,
          verificationExpiry,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpiry,
        } as any,
      });
    } catch (dbErr) {
      console.warn('Prisma create user warning:', dbErr);
    }

    // Send Verification Email with 1-Click Link and OTP Code
    await sendVerificationEmail(cleanEmail, verificationCode, firstName, verificationToken);

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      email: cleanEmail,
      message: 'Account created! Please check your email for your verification link and 6-digit code.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
