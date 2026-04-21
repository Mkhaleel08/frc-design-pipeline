import { NextRequest, NextResponse } from 'next/server';
import { getRequestById, updateRequest } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyStageChange, generateId } from '@/lib/slack';
import { STAGES, Stage } from '@/lib/types';

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

  const currentIndex = STAGES.indexOf(existing.stage);
  if (currentIndex === -1 || currentIndex === STAGES.length - 1) {
    return NextResponse.json({ error: 'Already at final stage' }, { status: 400 });
  }

  const newStage = STAGES[currentIndex + 1] as Stage;
  const now = new Date().toISOString();

  const activityEntry = {
    id: generateId(),
    type: 'stage_change' as const,
    message: `Moved to ${newStage}`,
    timestamp: now,
    userId: session.user.id,
    userName: session.user.real_name,
  };

  const updated = await updateRequest(id, {
    stage: newStage,
    activity: [...existing.activity, activityEntry],
  });

  await notifyStageChange(updated!, existing.stage, newStage, session.user.real_name);

  return NextResponse.json({ request: updated });
}