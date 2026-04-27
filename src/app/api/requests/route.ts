import { NextRequest, NextResponse } from 'next/server';
import { getAllRequests, createRequest } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyNewRequest, generateId } from '@/lib/slack';
import { DesignRequest, BUILD_PHASES, BuildPhase, PHASE_CONFIG } from '@/lib/types';

function determineSprint(buildPhase?: string): BuildPhase {
  if (buildPhase && BUILD_PHASES.includes(buildPhase as BuildPhase)) {
    return buildPhase as BuildPhase;
  }
  return 'Sprint1';
}

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

    const { 
      title, description, priority, subTeam, labels, assignee, attachments, notes, dueDate,
      buildPhase, taskStatus, dependency, isBlocked, blockerReason,
      manufacturingStatus, machineRequired, weightEstimate,
      wiringStatus, componentReceived,
      testedOnRobot, softwareSubsystem,
    } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const targetSprint = determineSprint(buildPhase);

    const now = new Date().toISOString();
    const newRequest: DesignRequest = {
      id: generateId(),
      title: title.trim().slice(0, 200),
      description: String(description || '').slice(0, 2000),
      priority: priority || 'Medium',
      subTeam: subTeam || null,
      labels: labels || [],
      buildPhase: targetSprint,
      taskStatus: taskStatus || 'Not Started',
      assignee: assignee || session.user.name,
      taskOwner: assignee || session.user.name,
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
        message: `Created in ${PHASE_CONFIG[targetSprint]?.name || targetSprint}`,
        timestamp: now,
        userId: session.user.id,
        userName: session.user.name,
      }],
      createdBy: session.user.id,
      dueDate: dueDate || undefined,
      dependency: dependency || undefined,
      isBlocked: isBlocked || false,
      blockerReason: blockerReason || undefined,
      manufacturingStatus: manufacturingStatus || undefined,
      machineRequired: machineRequired || undefined,
      weightEstimate: weightEstimate || undefined,
      wiringStatus: wiringStatus || undefined,
      componentReceived: componentReceived || false,
      testedOnRobot: testedOnRobot || false,
      softwareSubsystem: softwareSubsystem || undefined,
    };

    await createRequest(newRequest);
    await notifyNewRequest(newRequest, session.user.name);

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (e) {
    console.error('Error creating request:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}