'use client';

import { useMemo } from 'react';
import { DesignRequest, BUILD_PHASES, PHASE_COLORS, PHASE_CONFIG } from './types';

interface SprintBurndownProps {
  requests: DesignRequest[];
}

export function SprintBurndown({ requests }: SprintBurndownProps) {
  const chartData = useMemo(() => {
    return BUILD_PHASES.map(phase => {
      const phaseReqs = requests.filter(r => r.buildPhase === phase);
      const total = phaseReqs.length;
      const done = phaseReqs.filter(r => r.taskStatus === 'Done').length;
      const inProgress = phaseReqs.filter(r => r.taskStatus === 'In Progress').length;
      const blocked = phaseReqs.filter(r => r.taskStatus === 'Blocked' || r.isBlocked).length;
      const notStarted = phaseReqs.filter(r => r.taskStatus === 'Not Started').length;
      const remaining = total - done;
      return {
        phase,
        name: PHASE_CONFIG[phase].name,
        total,
        done,
        inProgress,
        blocked,
        notStarted,
        remaining,
        pct: total > 0 ? Math.round((done / total) * 100) : 0,
        color: PHASE_COLORS[phase],
      };
    });
  }, [requests]);

  const maxTotal = Math.max(...chartData.map(d => d.total), 1);
  const totalDone = chartData.reduce((sum, d) => sum + d.done, 0);
  const totalAll = chartData.reduce((sum, d) => sum + d.total, 0);
  const overallPct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Overall Progress */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Sprint Burndown</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-muted)]">{totalDone} / {totalAll} tasks complete</span>
            <span className="text-lg font-bold text-[var(--accent)] tabular-nums">{overallPct}%</span>
          </div>
        </div>
        <div className="h-3 rounded-full bg-[var(--surface-3)] overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--emerald)] transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">Tasks by Sprint</h3>
        <div className="flex items-end gap-3 h-48 px-2">
          {chartData.map(d => (
            <div key={d.phase} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-[var(--text-muted)] tabular-nums">{d.done}/{d.total}</span>
              <div className="w-full flex flex-col-reverse rounded-t-lg overflow-hidden" style={{ height: `${maxTotal > 0 ? (d.total / maxTotal) * 100 : 0}%`, minHeight: d.total > 0 ? '8px' : '2px' }}>
                <div
                  className="transition-all duration-500"
                  style={{ height: `${d.pct}%`, backgroundColor: d.color }}
                />
                <div
                  className="transition-all duration-500"
                  style={{ height: `${100 - d.pct}%`, backgroundColor: `${d.color}30` }}
                />
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] font-medium text-center leading-tight">{d.name.replace('Sprint ', 'S')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sprint Detail Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map(d => (
          <div key={d.phase} className="glass-card rounded-xl p-4 border-t-[3px]" style={{ borderTopColor: d.color }}>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{d.name}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Done</span>
                <span className="text-emerald-400 font-medium tabular-nums">{d.done}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">In Progress</span>
                <span className="text-amber-400 font-medium tabular-nums">{d.inProgress}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Blocked</span>
                <span className="text-rose-400 font-medium tabular-nums">{d.blocked}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Not Started</span>
                <span className="text-[var(--text-secondary)] font-medium tabular-nums">{d.notStarted}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--surface-3)] overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-400" />
          <span>Done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-400" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-rose-400" />
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[var(--surface-3)]" />
          <span>Not Started</span>
        </div>
      </div>
    </div>
  );
}
