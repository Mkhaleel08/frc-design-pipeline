'use client';

export type Stage = 'Submitted' | 'Assigned' | 'In Progress' | 'Review' | 'Fabrication' | 'Complete';

export type Priority = 'High' | 'Medium' | 'Low';

export type Role = 'Designer' | 'Fabrication' | 'Lead';

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
  role: Role;
  attachments: string;
  notes: string;
  stage: Stage;
  createdAt: string;
  updatedAt: string;
  activity: Activity[];
  createdBy: string;
}

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  image_72: string;
  email?: string;
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

export const TEAM_MEMBERS = [
  'Alex Chen',
  'Jordan Williams',
  'Sam Rodriguez',
  'Taylor Kim',
  'Casey Johnson',
  'Morgan Lee',
  'Riley Thompson'
];

export const ROLES: Role[] = ['Designer', 'Fabrication', 'Lead'];
