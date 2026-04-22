'use client';

import { STAGES, Stage, STAGE_COLORS, DesignRequest, SUBTEAMS, SubTeam, SUBTEAM_COLORS } from './types';

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

  const subTeamStats: Record<string, number> = {};
  SUBTEAMS.forEach(team => { subTeamStats[team] = 0; });
  requests.forEach(r => {
    if (r.subTeam) subTeamStats[r.subTeam]++;
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

  const totalRequests = requests.length || 1;
  const hasSubTeams = Object.values(subTeamStats).some(v => v > 0);

  return (
    <div className="glass border-b border-[var(--glass-border)] flex flex-col">
      <div className="h-10 flex items-center px-6 gap-2 overflow-x-auto scroll-hide">
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
      
      {hasSubTeams && (
        <div className="h-6 flex items-center px-6 gap-1 overflow-x-auto scroll-hide border-t border-[var(--glass-border)]">
          <span className="text-[10px] text-[var(--text-muted)] mr-2 font-medium">Teams:</span>
          {SUBTEAMS.map(team => {
            const count = subTeamStats[team];
            if (count === 0) return null;
            const percent = Math.round((count / totalRequests) * 100);
            return (
              <div
                key={team}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs whitespace-nowrap cursor-default"
                style={{ 
                  backgroundColor: `${SUBTEAM_COLORS[team]}15`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SUBTEAM_COLORS[team] }}></span>
                <span className="font-medium" style={{ color: SUBTEAM_COLORS[team] }}>{team}</span>
                <span className="text-[var(--text-secondary)] tabular-nums">{count}</span>
                <span className="text-[var(--text-muted)] text-[9px]">({percent}%)</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}