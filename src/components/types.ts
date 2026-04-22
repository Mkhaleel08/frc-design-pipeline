'use client';

export type Stage = 'Submitted' | 'Assigned' | 'In Progress' | 'Review' | 'Fabrication' | 'Complete';

export type Priority = 'High' | 'Medium' | 'Low';

export type SubTeam = 'CAD' | 'Mechanical' | 'Electrical' | 'Business' | 'Programming' | 'Strategy';

export type Label = 'Urgent' | 'Needs Review' | 'Approved' | 'Blocked' | 'Ready' | 'In Progress';

export type UserRole = 'Designer' | 'Lead';

export type ActivityType = 'created' | 'stage_change' | 'note_added' | 'version_created';

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
  savedAt: string;
  savedBy: string;
}

export interface DesignRequest {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  attachments: string;
  notes: string;
  stage: Stage;
  subTeam: SubTeam | null;
  labels: Label[];
  version: number;
  versionHistory: VersionSnapshot[];
  createdAt: string;
  updatedAt: string;
  activity: Activity[];
  createdBy: string;
  dueDate?: string;
  blobUrl?: string;
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

export const SUBTEAMS: SubTeam[] = ['CAD', 'Mechanical', 'Electrical', 'Business', 'Programming', 'Strategy'];

export const LABELS: Label[] = ['Urgent', 'Needs Review', 'Approved', 'Blocked', 'Ready', 'In Progress'];

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

export const PRIORITY_COLORS: Record<Priority, string> = {
  'High': '#EF4444',
  'Medium': '#F59E0B',
  'Low': '#22C55E'
};

export const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export const USER_ROLES: UserRole[] = ['Designer', 'Lead'];