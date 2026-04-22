import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getRequestById, updateRequest } from '@/lib/db';

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

    const { put } = await import('@vercel/blob');
    const blob = await put(file.name, file, {
      access: 'public',
    });

    const existingRequest = await getRequestById(id);
    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const attachments = existingRequest.blobUrl 
      ? `${existingRequest.blobUrl},${blob.url}`
      : blob.url;

    const updatedRequest = await updateRequest(id, {
      blobUrl: attachments,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}