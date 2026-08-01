import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { saveRegisteredUser, getRegisteredUserByEmail } from '@/lib/registeredUsersStore';

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
      // Ignore DB error
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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
    };

    // Save to shared memory store for instant login availability
    saveRegisteredUser(newUserObj);

    // Save to Database if online
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
        } as any,
      });
    } catch (dbErr) {
      // Ignored if db initializing
    }

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully.',
      user: {
        id: newUserObj.id,
        email: newUserObj.email,
        name: `${newUserObj.firstName} ${newUserObj.lastName}`,
        role: newUserObj.role,
        portal: newUserObj.portal,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
