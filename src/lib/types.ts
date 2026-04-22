export type Stage = 'Submitted' | 'Assigned' | 'In Progress' | 'Review' | 'Fabrication' | 'Complete';

export type Priority = 'High' | 'Medium' | 'Low';

export type UserRole = 'Designer' | 'Lead';

export type ActivityType = 'created' | 'stage_change' | 'note_added';

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
  attachments: string;
  notes: string;
  stage: Stage;
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
  role: UserRole;
  slackMemberId?: string;
}

export interface Session {
  user: SessionUser;
  accessToken: string;
  expiresAt: number;
}

export const STAGES: Stage[] = ['Submitted', 'Assigned', 'In Progress', 'Review', 'Fabrication', 'Complete'];

export const STAGE_COLORS: Record<Stage, string> = {
  'Submitted': '#6366F1',
  'Assigned': '#8B5CF6',
  'In Progress': '#F59E0B',
  'Review': '#3B82F6',
  'Fabrication': '#10B981',
  'Complete': '#22C55E'
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  'High': '#EF4444',
  'Medium': '#F59E0B',
  'Low': '#22C55E'
};