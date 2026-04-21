import { NextRequest, NextResponse } from 'next/server';
import { getRequestById, updateRequest, deleteRequest } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyRequestDeleted } from '@/lib/slack';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const req = await getRequestById(id);
  
  if (!req) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ request: req });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getRequestById(id);
  
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updates: Partial<typeof existing> = {};
    
    if (body.title !== undefined) updates.title = String(body.title).trim().slice(0, 200);
    if (body.description !== undefined) updates.description = String(body.description).slice(0, 2000);
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.assignee !== undefined) updates.assignee = body.assignee;
    if (body.role !== undefined) updates.role = body.role;
    if (body.attachments !== undefined) updates.attachments = String(body.attachments).slice(0, 5000);
    if (body.notes !== undefined) updates.notes = String(body.notes).slice(0, 2000);

    const updated = await updateRequest(id, updates);
    return NextResponse.json({ request: updated });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getRequestById(id);
  
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await deleteRequest(id);
  await notifyRequestDeleted(existing, session.user.real_name);
  
  return NextResponse.json({ success: true });
}