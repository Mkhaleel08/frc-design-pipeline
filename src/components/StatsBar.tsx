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

  return (
    <div className="bg-[#0C0C0C] border-b border-[#2A2A2A] h-14 flex items-center px-6 gap-2 overflow-x-auto">
      {STAGES.map((stage, idx) => (
        <div
          key={stage}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-all duration-200 hover:bg-[#1F1F1F] cursor-default"
          style={{ 
            backgroundColor: stats[stage] > 0 ? `${STAGE_COLORS[stage]}12` : '#171717',
            border: stats[stage] > 0 ? `1px solid ${STAGE_COLORS[stage]}30` : '1px solid transparent'
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }}></span>
          <span className="text-[#A1A1A1] font-medium">{stage}</span>
          <span className="font-semibold text-white tabular-nums">{stats[stage]}</span>
        </div>
      ))}
    </div>
  );
}