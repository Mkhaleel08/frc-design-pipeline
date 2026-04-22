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
    <div className="bg-[#171717] border-b border-[#2A2A2A] h-14 flex items-center px-6 gap-2 overflow-x-auto">
      {STAGES.map((stage) => (
        <div
          key={stage}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs whitespace-nowrap transition-all duration-200 hover:bg-[#1F1F1F] cursor-default border border-transparent hover:border-[#2A2A2A]"
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }}></span>
          <span className="text-[#A1A1A1] font-medium">{stage}</span>
          <span className="font-semibold text-white tabular-nums">{stats[stage]}</span>
        </div>
      ))}
      {dueSoon > 0 && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs whitespace-nowrap bg-[#F59E0B]/10 border border-[#F59E0B]/20">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
          <span className="text-[#F59E0B] font-medium">Due Soon</span>
          <span className="font-semibold text-white tabular-nums">{dueSoon}</span>
        </div>
      )}
      {overdue > 0 && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs whitespace-nowrap bg-[#EF4444]/10 border border-[#EF4444]/20">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
          <span className="text-[#EF4444] font-medium">Overdue</span>
          <span className="font-semibold text-white tabular-nums">{overdue}</span>
        </div>
      )}
    </div>
  );
}