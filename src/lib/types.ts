export type Stage = 'Submitted' | 'Assigned' | 'In Progress' | 'Review' | 'Fabrication' | 'Complete';

export type Priority = 'High' | 'Medium' | 'Low';

export type SubTeam = 'CAD' | 'Mechanical' | 'Electrical' | 'Business' | 'Programming' | 'Strategy';

export type UserRole = 'Designer' | 'Lead';

export type ActivityType = 'created' | 'stage_change' | 'note_added' | 'version_created';

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

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  userId: string;
  userName?: string;
}

export interface DesignRequest {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  role?: UserRole;
  attachments: string;
  notes: string;
  stage: Stage;
  subTeam: SubTeam | null;
  version: number;
  versionHistory: VersionSnapshot[];
  createdAt: string;
  updatedAt: string;
  activity: Activity[];
  createdBy: string;
  dueDate?: string;
  blobUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  createdAt: string;
  slackMemberId?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  real_name?: string;
  role: UserRole;
  slackMemberId?: string;
}

export interface Session {
  user: SessionUser;
  accessToken: string;
  expiresAt: number;
}

export const STAGES: Stage[] = ['Submitted', 'Assigned', 'In Progress', 'Review', 'Fabrication', 'Complete'];

export const SUBTEAMS: SubTeam[] = ['CAD', 'Mechanical', 'Electrical', 'Business', 'Programming', 'Strategy'];

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

export const SUBTEAM_ICONS: Record<SubTeam, string> = {
  'CAD': 'M9 3v8l3-3 3 3 3-3 3-3V3M9 3H7a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2z',
  'Mechanical': 'M10.325 4.317c.426-1.256 1.623-1.256 2.05 0m1.014 9.67c.35.284.82.42 1.305.385.964-.068 1.75-.954 1.75-1.952v-1.557c0-1.22-.987-2.195-2.167-2.05-1.026.126-1.827 1.113-1.693 2.159',
  'Electrical': 'M9 3v2m6-2v2M9 3v6m6-6v6m6-4v8m-6 4h8m2-18h-2m-4 0h-2m4 0H7',
  'Business': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-5a3 3 0 00-3-3h-1m8 3h3m-3 3v-3m0 3h3',
  'Programming': 'M10 20l4-16m4 4l4 4 4-4-4-4-4 4z',
  'Strategy': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2 0M9 5a2 2 0 012-2h2a2 2 0 012 2'
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  'High': '#EF4444',
  'Medium': '#F59E0B',
  'Low': '#22C55E'
};