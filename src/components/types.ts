'use client';

export type Stage = 'Submitted' | 'Assigned' | 'In Progress' | 'Review' | 'Fabrication' | 'Complete';

export type Priority = 'High' | 'Medium' | 'Low';

export type SubTeam = 'CAD' | 'Mechanical' | 'Electrical' | 'Business' | 'Programming' | 'Strategy';

export type Label = 'Urgent' | 'Needs Review' | 'Approved' | 'Blocked' | 'Ready' | 'In Progress';

export type BuildPhase = 'Sprint1' | 'Sprint2' | 'Sprint3' | 'Sprint4' | 'Sprint5' | 'Sprint6' | 'Sprint7' | 'Sprint8';

export type TaskStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Done';

export type ManufacturingStatus = 'CAD' | 'CAM' | 'Cut' | 'Assembly';

export type WiringStatus = 'Planned' | 'Routed' | 'Crimped' | 'Tested';

export type SoftwareSubsystem = 'Drivetrain' | 'Arm' | 'Intake' | 'Vision' | 'Auto' | 'Diagnostics';

export type UserRole = 'Designer' | 'Lead';

export type ActivityType = 'created' | 'stage_change' | 'note_added' | 'version_created' | 'phase_change' | 'triage';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  userId: string;
  userName?: string;
}

export interface VersionSnapshot {
  version: number;
  title: string;
  description: string;
  notes: string;
  priority: Priority;
  assignee: string;
  subTeam: SubTeam | null;
  buildPhase: BuildPhase;
  savedAt: string;
  savedBy: string;
}

export interface DesignRequest {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  taskOwner: string;
  attachments: string;
  notes: string;
  stage: Stage;
  taskStatus: TaskStatus;
  subTeam: SubTeam | null;
  buildPhase: BuildPhase;
  labels: Label[];
  version: number;
  versionHistory: VersionSnapshot[];
  createdAt: string;
  updatedAt: string;
  activity: Activity[];
  createdBy: string;
  dueDate?: string;
  blobUrl?: string;
  dependency?: string;
  isBlocked: boolean;
  blockerReason?: string;
  manufacturingStatus?: ManufacturingStatus;
  machineRequired?: string;
  weightEstimate?: number;
  wiringStatus?: WiringStatus;
  componentReceived?: boolean;
  testedOnRobot?: boolean;
  softwareSubsystem?: SoftwareSubsystem;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  real_name?: string;
  role: UserRole;
  slackMemberId?: string;
}

export interface WorkloadEntry {
  name: string;
  total: number;
  byStage: Record<Stage, number>;
  subTeamBreakdown: Record<string, number>;
}

export const STAGES: Stage[] = ['Submitted', 'Assigned', 'In Progress', 'Review', 'Fabrication', 'Complete'];

export const TASK_STATUSES: TaskStatus[] = ['Not Started', 'In Progress', 'Blocked', 'Done'];

export const SUBTEAMS: SubTeam[] = ['CAD', 'Mechanical', 'Electrical', 'Business', 'Programming', 'Strategy'];

export const BUILD_PHASES: BuildPhase[] = ['Sprint1', 'Sprint2', 'Sprint3', 'Sprint4', 'Sprint5', 'Sprint6', 'Sprint7', 'Sprint8'];

export const LABELS: Label[] = ['Urgent', 'Needs Review', 'Approved', 'Blocked', 'Ready', 'In Progress'];

export const MANUFACTURING_STATUSES: ManufacturingStatus[] = ['CAD', 'CAM', 'Cut', 'Assembly'];

export const WIRING_STATUSES: WiringStatus[] = ['Planned', 'Routed', 'Crimped', 'Tested'];

export const SOFTWARE_SUBSYSTEMS: SoftwareSubsystem[] = ['Drivetrain', 'Arm', 'Intake', 'Vision', 'Auto', 'Diagnostics'];

export const PHASE_CONFIG: Record<BuildPhase, { name: string; startWeek: number; endWeek: number; deadline: string }> = {
  'Sprint1': { name: 'Sprint 1', startWeek: 1, endWeek: 1, deadline: '' },
  'Sprint2': { name: 'Sprint 2', startWeek: 2, endWeek: 2, deadline: '' },
  'Sprint3': { name: 'Sprint 3', startWeek: 3, endWeek: 3, deadline: '' },
  'Sprint4': { name: 'Sprint 4', startWeek: 4, endWeek: 4, deadline: '' },
  'Sprint5': { name: 'Sprint 5', startWeek: 5, endWeek: 5, deadline: '' },
  'Sprint6': { name: 'Sprint 6', startWeek: 6, endWeek: 6, deadline: '' },
  'Sprint7': { name: 'Sprint 7', startWeek: 7, endWeek: 7, deadline: '' },
  'Sprint8': { name: 'Sprint 8', startWeek: 8, endWeek: 8, deadline: '' },
};

export const STAGE_COLORS: Record<Stage, string> = {
  'Submitted': '#6366F1',
  'Assigned': '#8B5CF6',
  'In Progress': '#F59E0B',
  'Review': '#3B82F6',
  'Fabrication': '#10B981',
  'Complete': '#22C55E'
};

export const SUBTEAM_COLORS: Record<SubTeam, string> = {
  'CAD': '#F97316',
  'Mechanical': '#EF4444',
  'Electrical': '#3B82F6',
  'Business': '#10B981',
  'Programming': '#8B5CF6',
  'Strategy': '#F59E0B'
};

export const LABEL_COLORS: Record<Label, string> = {
  'Urgent': '#EF4444',
  'Needs Review': '#F59E0B',
  'Approved': '#10B981',
  'Blocked': '#DC2626',
  'Ready': '#3B82F6',
  'In Progress': '#8B5CF6'
};

export const PHASE_COLORS: Record<BuildPhase, string> = {
  'Sprint1': '#6366F1',
  'Sprint2': '#8B5CF6',
  'Sprint3': '#EC4899',
  'Sprint4': '#F59E0B',
  'Sprint5': '#10B981',
  'Sprint6': '#3B82F6',
  'Sprint7': '#F97316',
  'Sprint8': '#14B8A6',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  'Not Started': '#6B7280',
  'In Progress': '#F59E0B',
  'Blocked': '#EF4444',
  'Done': '#10B981'
};

export const MANUFACTURING_COLORS: Record<ManufacturingStatus, string> = {
  'CAD': '#6366F1',
  'CAM': '#8B5CF6',
  'Cut': '#F59E0B',
  'Assembly': '#10B981'
};

export const WIRING_COLORS: Record<WiringStatus, string> = {
  'Planned': '#6366F1',
  'Routed': '#8B5CF6',
  'Crimped': '#F59E0B',
  'Tested': '#10B981'
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  'High': '#EF4444',
  'Medium': '#F59E0B',
  'Low': '#22C55E'
};

export const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export const USER_ROLES: UserRole[] = ['Designer', 'Lead'];