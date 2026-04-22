import { NextRequest, NextResponse } from 'next/server';
import { getAllRequests, createRequest } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyNewRequest, generateId } from '@/lib/slack';
import { DesignRequest } from '@/lib/types';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const requests = await getAllRequests();

  if (session.user.role === 'Lead') {
    return NextResponse.json({ requests });
  }

  const filteredRequests = requests.filter(
    (req) => req.createdBy === session.user.id || req.assignee === session.user.name
  );

  return NextResponse.json({ requests: filteredRequests });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { title, description, priority, subTeam, assignee, attachments, notes, dueDate } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newRequest: DesignRequest = {
      id: generateId(),
      title: title.trim().slice(0, 200),
      description: String(description || '').slice(0, 2000),
      priority: priority || 'Medium',
      subTeam: subTeam || null,
      assignee: assignee || session.user.name,
      attachments: String(attachments || '').slice(0, 5000),
      notes: String(notes || '').slice(0, 2000),
      stage: 'Submitted',
      version: 1,
      versionHistory: [],
      createdAt: now,
      updatedAt: now,
      activity: [{
        id: generateId(),
        type: 'created',
        message: 'Request created',
        timestamp: now,
        userId: session.user.id,
        userName: session.user.name,
      }],
      createdBy: session.user.id,
      dueDate: dueDate || undefined,
    };

    await createRequest(newRequest);
    await notifyNewRequest(newRequest, session.user.name);

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (e) {
    console.error('Error creating request:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}