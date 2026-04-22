import { NextRequest, NextResponse } from 'next/server';
import { getRequestById, updateRequest, deleteRequest } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyRequestDeleted } from '@/lib/slack';

const VALID_PRIORITIES = ['High', 'Medium', 'Low'];

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

  const isLead = session.user.role === 'Lead';
  const isOwner = existing.createdBy === session.user.id;
  const isAssignee = existing.assignee === session.user.name;
  const canModify = isOwner || isAssignee;

  if (!isLead && !canModify) {
    return NextResponse.json({ error: 'You can only edit requests you created or are assigned to' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updates: Partial<typeof existing> = {};

    if (body.title !== undefined) updates.title = String(body.title).trim().slice(0, 200);
    if (body.description !== undefined) updates.description = String(body.description).slice(0, 2000);

    if (body.priority !== undefined) {
      if (!VALID_PRIORITIES.includes(body.priority)) {
        return NextResponse.json({ error: 'Priority must be High, Medium, or Low' }, { status: 400 });
      }
      updates.priority = body.priority;
    }

    if (body.notes !== undefined) updates.notes = String(body.notes).slice(0, 2000);
    if (body.dueDate !== undefined) updates.dueDate = body.dueDate || undefined;

    if (body.attachments !== undefined) updates.attachments = String(body.attachments).slice(0, 5000);
    if (body.blobUrl !== undefined) updates.blobUrl = body.blobUrl || undefined;

    if (!isLead) {
      if (body.assignee !== undefined) {
        return NextResponse.json({ error: 'Only Leads can assign requests' }, { status: 403 });
      }
      if (body.stage !== undefined) {
        return NextResponse.json({ error: 'Stage cannot be updated directly. Use the advance action.' }, { status: 403 });
      }
    } else {
      if (body.assignee !== undefined) {
        updates.assignee = body.assignee;
      }
    }

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

  if (session.user.role !== 'Lead') {
    return NextResponse.json({ error: 'Only Leads can delete requests' }, { status: 403 });
  }

  await deleteRequest(id);
  await notifyRequestDeleted(existing, session.user.name);

  return NextResponse.json({ success: true });
}