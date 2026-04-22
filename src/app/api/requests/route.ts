import { NextRequest, NextResponse } from 'next/server';
import { getAllRequests, createRequest } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyNewRequest, generateId } from '@/lib/slack';
import { DesignRequest, PHASE_CONFIG, BuildPhase } from '@/lib/types';

function determinePhase(buildPhase?: string): BuildPhase {
  if (buildPhase && buildPhase !== 'ParkingLot') {
    return buildPhase as BuildPhase;
  }
  return 'ParkingLot';
}

function isPhaseLocked(requestedPhase: BuildPhase, isLeadOverride: boolean): { locked: boolean; reason?: string } {
  const now = new Date();
  const currentWeek = Math.floor((now.getTime() - new Date('2025-01-05').getTime()) / (1000 * 60 * 60 * 24 * 7));
  
  const phaseConfigs: Record<BuildPhase, { endWeek: number; deadline: string }> = {
    'Shape': { endWeek: 1, deadline: '2025-01-12' },
    'BuildCycle1': { endWeek: 3, deadline: '2025-01-26' },
    'BuildCycle2': { endWeek: 5, deadline: '2025-02-09' },
    'Cooldown': { endWeek: 6, deadline: '2025-02-16' },
    'ParkingLot': { endWeek: -1, deadline: '' }
  };
  
  const phaseDeadline = new Date(phaseConfigs[requestedPhase].deadline);
  
  if (now > phaseDeadline && !isLeadOverride) {
    return { 
      locked: true, 
      reason: `Phase ${requestedPhase} deadline has passed (${phaseConfigs[requestedPhase].deadline}). Tasks cannot be added without lead approval.` 
    };
  }
  
  return { locked: false };
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
      leadOverride
    } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const targetPhase = determinePhase(buildPhase);
    const isLead = session.user.role === 'Lead';
    const canOverride = leadOverride === true && isLead;
    
    const phaseCheck = isPhaseLocked(targetPhase, canOverride);
    if (phaseCheck.locked) {
      return NextResponse.json({ error: phaseCheck.reason }, { status: 403 });
    }

    const now = new Date().toISOString();
    const newRequest: DesignRequest = {
      id: generateId(),
      title: title.trim().slice(0, 200),
      description: String(description || '').slice(0, 2000),
      priority: priority || 'Medium',
      subTeam: subTeam || null,
      labels: labels || [],
      buildPhase: targetPhase,
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
        message: `Created in phase ${targetPhase}`,
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