import { NextResponse } from 'next/server';
import { getSharedTeam, addSharedTeamMember, EmployeeProfile } from '@/lib/teamStore';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let dbUsers: any[] = [];
    try {
      dbUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      // Ignore
    }

    const shared = getSharedTeam();
    const combinedMap = new Map<string, EmployeeProfile>();

    shared.forEach((emp) => combinedMap.set(emp.id, emp));

    dbUsers.forEach((u) => {
      if (!combinedMap.has(u.id)) {
        combinedMap.set(u.id, {
          id: u.id,
          name: `${u.firstName} ${u.lastName || ''}`.trim(),
          role: u.role,
          email: u.email,
          phone: u.phone || '+1 (555) 000-0000',
          specialty: u.company || 'Enterprise Operations',
          avatarBg: 'bg-indigo-600 text-white',
          rating: 5.0,
          completedThisMonth: 0,
          avgTurnaround: 'New Staff',
          workload: 'LOW',
          activeProjectName: 'Ready for Assignment',
          activeProjectProgress: 0,
          activeClient: 'Unassigned',
          deadline: 'Flexible',
          isOnline: true,
          documents: [],
        });
      }
    });

    return NextResponse.json({ employees: Array.from(combinedMap.values()) });
  } catch (error: any) {
    return NextResponse.json({ employees: getSharedTeam() });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newEmpObj: EmployeeProfile = {
      id: body.id || `emp_${Math.random().toString(36).substring(2, 9)}`,
      name: body.name || 'New Staff Member',
      role: body.role || 'EDITOR',
      email: body.email || 'staff@postprodpro.com',
      phone: body.phone || '+91 98765 00000',
      specialty: body.specialty || 'Enterprise Specialist',
      avatarUrl: body.avatarUrl || undefined,
      avatarBg: body.avatarBg || 'bg-indigo-600 text-white',
      rating: 5.0,
      completedThisMonth: 0,
      avgTurnaround: 'New Staff',
      workload: 'LOW',
      activeProjectName: 'Ready for Assignment',
      activeProjectProgress: 0,
      activeClient: 'Unassigned',
      deadline: 'Flexible',
      isOnline: true,
      aadhaarNumber: body.aadhaarNumber || 'Verified',
      panNumber: body.panNumber || 'Verified',
      bankName: body.bankName || 'State Bank of India',
      accountNumber: body.accountNumber || '334455667788',
      ifscCode: body.ifscCode || 'SBIN0001234',
      emergencyContactName: body.emergencyContactName || 'Family Member',
      emergencyContactPhone: body.emergencyContactPhone || body.phone,
      documents: body.documents || [],
    };

    // Save to shared team store
    addSharedTeamMember(newEmpObj);

    // Save user to Database if online
    try {
      const nameParts = newEmpObj.name.split(' ');
      await prisma.user.create({
        data: {
          id: newEmpObj.id,
          firstName: nameParts[0] || 'Staff',
          lastName: nameParts.slice(1).join(' ') || 'Member',
          email: newEmpObj.email.toLowerCase(),
          password: '$2a$12$eA8bL7pQ8i.aG2bC3dE4f.gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4a', // Hashed password
          role: (newEmpObj.role as any) || 'EDITOR',
          company: newEmpObj.specialty,
          phone: newEmpObj.phone,
        },
      });
    } catch (dbErr) {
      // Ignored if db initializing
    }

    return NextResponse.json({ success: true, employee: newEmpObj });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
