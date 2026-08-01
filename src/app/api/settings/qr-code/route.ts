import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCeoSettings, updateCeoSettings } from '@/lib/settingsStore';

export async function GET() {
  try {
    const settings = getCeoSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'CLIENT';

    // Allow CEO, SUPER_ADMIN, ADMIN to modify payment QR Code
    if (role !== 'CEO' && role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only CEO / Admin can modify Payment QR Code' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updated = updateCeoSettings({
      upiId: body.upiId,
      payeeName: body.payeeName,
      bankName: body.bankName,
      accountNumber: body.accountNumber,
      ifscCode: body.ifscCode,
      qrCodeUrl: body.qrCodeUrl,
      updatedBy: session?.user?.name || 'CEO Admin',
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
