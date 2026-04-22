'use client';

import { useMemo } from 'react';
import { DesignRequest, STAGES, STAGE_COLORS, SubTeam, SUBTEAM_COLORS } from './types';

interface WorkloadViewProps {
  requests: DesignRequest[];
  onRequestClick: (request: DesignRequest) => void;
}

export function WorkloadView({ requests, onRequestClick }: WorkloadViewProps) {
  const workloadData = useMemo(() => {
    const assignees = new Map<string, {
      total: number;
      byStage: Record<string, number>;
      subTeams: Record<string, number>;
      requests: DesignRequest[];
    }>();

    requests.forEach(r => {
      if (r.stage === 'Complete') return;
      
      const key = r.assignee || 'Unassigned';
      if (!assignees.has(key)) {
        assignees.set(key, { total: 0, byStage: {}, subTeams: {}, requests: [] });
      }
      
      const data = assignees.get(key)!;
      data.total++;
      data.byStage[r.stage] = (data.byStage[r.stage] || 0) + 1;
      if (r.subTeam) {
        data.subTeams[r.subTeam] = (data.subTeams[r.subTeam] || 0) + 1;
      }
      data.requests.push(r);
    });

    return Array.from(assignees.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [requests]);

  const totalActive = requests.filter(r => r.stage !== 'Complete').length;

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Team Workload</h2>
          <p className="text-sm text-[var(--text-muted)]">{totalActive} active requests across {workloadData.length} assignees</p>
        </div>
      </div>

      {workloadData.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-[var(--text-muted)]">No active requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workloadData.map(entry => {
            const isOverloaded = entry.total > 5;
            const activeRequests = entry.requests.filter(r => r.stage !== 'Complete');
            
            return (
              <div key={entry.name} className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--surface-3)] flex items-center justify-center text-sm font-bold text-white">
                      {entry.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{entry.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{entry.total} active requests</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    isOverloaded 
                      ? 'bg-[var(--danger-glow)] text-[var(--danger)]' 
                      : 'bg-[var(--accent-glow)] text-[var(--accent)]'
                  }`}>
                    {isOverloaded ? 'Overloaded' : 'Available'}
                  </div>
                </div>

                <div className="flex h-3 rounded-lg overflow-hidden mb-3">
                  {STAGES.filter(s => s !== 'Complete').map(stage => {
                    const count = entry.byStage[stage] || 0;
                    if (count === 0) return null;
                    const width = (count / entry.total) * 100;
                    return (
                      <div
                        key={stage}
                        className="transition-all duration-300"
                        style={{
                          width: `${width}%`,
                          backgroundColor: STAGE_COLORS[stage]
                        }}
                        title={`${stage}: ${count}`}
                      />
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {STAGES.filter(s => s !== 'Complete').map(stage => {
                    const count = entry.byStage[stage] || 0;
                    if (count === 0) return null;
                    return (
                      <div key={stage} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }}></span>
                        <span className="text-[10px] text-[var(--text-muted)]">{stage.split(' ')[0]}: {count}</span>
                      </div>
                    );
                  })}
                </div>

                {activeRequests.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Active Tasks</p>
                    {activeRequests.slice(0, 3).map(r => (
                      <div
                        key={r.id}
                        onClick={() => onRequestClick(r)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--surface-3)] cursor-pointer transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[r.stage] }}></span>
                        <span className="text-xs text-[var(--text-secondary)] truncate flex-1">{r.title}</span>
                      </div>
                    ))}
                    {activeRequests.length > 3 && (
                      <p className="text-[10px] text-[var(--text-muted)] text-center">+{activeRequests.length - 3} more</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}