import { NextRequest, NextResponse } from 'next/server';
import { getRequestById, updateRequest } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyNoteAdded, generateId } from '@/lib/slack';

export async function POST(
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
    const note = String(body.note || '').trim();
    
    if (!note) {
      return NextResponse.json({ error: 'Note is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const activityEntry = {
      id: generateId(),
      type: 'note_added' as const,
      message: note.slice(0, 1000),
      timestamp: now,
      userId: session.user.id,
      userName: session.user.real_name,
    };

    const updated = await updateRequest(id, {
      activity: [...existing.activity, activityEntry],
    });

    await notifyNoteAdded(updated!, note, session.user.real_name);

    return NextResponse.json({ request: updated });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}