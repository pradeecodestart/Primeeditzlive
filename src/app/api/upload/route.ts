import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileUrl = `https://utfs.io/f/sample-${Date.now()}-${file.name}`;
    return NextResponse.json({
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
