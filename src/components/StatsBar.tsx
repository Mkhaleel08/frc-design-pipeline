'use client';

import { STAGES, Stage, STAGE_COLORS, DesignRequest } from './types';

interface StatsBarProps {
  requests: DesignRequest[];
}

export function StatsBar({ requests }: StatsBarProps) {
  const stats: Record<Stage, number> = {
    'Submitted': 0,
    'Assigned': 0,
    'In Progress': 0,
    'Review': 0,
    'Fabrication': 0,
    'Complete': 0,
  };

  requests.forEach(r => {
    stats[r.stage]++;
  });

  const now = new Date();
  const dueSoon = requests.filter(r => {
    if (!r.dueDate || r.stage === 'Complete') return false;
    const due = new Date(r.dueDate);
    const hoursUntil = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil > 0 && hoursUntil <= 24;
  }).length;

  const overdue = requests.filter(r => {
    if (!r.dueDate || r.stage === 'Complete') return false;
    const due = new Date(r.dueDate);
    return due < now;
  }).length;

  return (
    <div className="glass border-b border-[var(--glass-border)] h-12 flex items-center px-6 gap-2 overflow-x-auto scroll-hide">
      {STAGES.map((stage) => (
        <div
          key={stage}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 border ${
            stats[stage] === 0 
              ? 'opacity-50 border-transparent bg-transparent' 
              : 'glass-button cursor-default'
          }`}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }}></span>
          <span className="text-[var(--text-secondary)] font-medium">{stage}</span>
          <span className="font-semibold text-[var(--text-primary)] tabular-nums">{stats[stage]}</span>
        </div>
      ))}
      {dueSoon > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap bg-[var(--warning-glow)] border border-[var(--warning)]/30">
          <span className="w-2 h-2 rounded-full bg-[var(--warning)] animate-pulse"></span>
          <span className="text-[var(--warning)] font-medium">Due Soon</span>
          <span className="font-semibold text-[var(--text-primary)] tabular-nums">{dueSoon}</span>
        </div>
      )}
      {overdue > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap bg-[var(--danger-glow)] border border-[var(--danger)]/30">
          <span className="w-2 h-2 rounded-full bg-[var(--danger)]"></span>
          <span className="text-[var(--danger)] font-medium">Overdue</span>
          <span className="font-semibold text-[var(--text-primary)] tabular-nums">{overdue}</span>
        </div>
      )}
    </div>
  );
}