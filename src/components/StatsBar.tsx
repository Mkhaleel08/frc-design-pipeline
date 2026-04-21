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
    <div className="bg-[#0D0D0D] border-b border-[#333] h-12 flex items-center px-6 gap-3 overflow-x-auto">
      {STAGES.map(stage => (
        <div
          key={stage}
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs whitespace-nowrap"
          style={{ backgroundColor: `${STAGE_COLORS[stage]}20` }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }}></span>
          <span className="text-[#A0A0A0]">{stage}</span>
          <span className="font-semibold text-white">{stats[stage]}</span>
        </div>
      ))}
    </div>
  );
}