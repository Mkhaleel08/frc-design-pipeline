import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getRequestById, updateRequest } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let fileUrl = '';
    
    if (process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN !== 'your_blob_token_here') {
      const { put } = await import('@vercel/blob');
      const blob = await put(file.name, file, {
        access: 'public',
      });
      fileUrl = blob.url;
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {
        // Ignore if directory already exists
      }
      
      const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);
      fileUrl = `/uploads/${uniqueName}`;
    }

    const existingRequest = await getRequestById(id);
    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const attachments = existingRequest.blobUrl 
      ? `${existingRequest.blobUrl},${fileUrl}`
      : fileUrl;

    const updatedRequest = await updateRequest(id, {
      blobUrl: attachments,
    });

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}