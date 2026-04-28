'use client';

import { useMemo } from 'react';
import {
  DesignRequest, STAGES, STAGE_COLORS, SUBTEAMS, SUBTEAM_COLORS,
  BUILD_PHASES, PHASE_COLORS, PHASE_CONFIG, SubTeam
} from './types';

interface DashboardViewProps {
  requests: DesignRequest[];
  onRequestClick: (request: DesignRequest) => void;
  currentUserName: string;
  competitionDate?: string;
}

export function DashboardView({ requests, onRequestClick, currentUserName, competitionDate }: DashboardViewProps) {
  const stats = useMemo(() => {
    const total = requests.length;
    const complete = requests.filter(r => r.stage === 'Complete').length;
    const inProgress = requests.filter(r => r.stage === 'In Progress').length;
    const blocked = requests.filter(r => r.isBlocked || r.taskStatus === 'Blocked').length;
    const overdue = requests.filter(r => {
      if (!r.dueDate || r.stage === 'Complete') return false;
      return new Date(r.dueDate) < new Date();
    }).length;
    const completionPct = total > 0 ? Math.round((complete / total) * 100) : 0;
    return { total, complete, inProgress, blocked, overdue, completionPct };
  }, [requests]);

  const myTasks = useMemo(() => {
    return requests
      .filter(r => r.assignee === currentUserName && r.stage !== 'Complete')
      .sort((a, b) => {
        if (a.priority === 'High' && b.priority !== 'High') return -1;
        if (b.priority === 'High' && a.priority !== 'High') return 1;
        return 0;
      })
      .slice(0, 5);
  }, [requests, currentUserName]);

  const recentActivity = useMemo(() => {
    const all: Array<{ id: string; timestamp: string; type: string; message: string; userName?: string; requestTitle: string }> = [];
    requests.forEach(r => {
      r.activity.forEach(a => {
        all.push({ id: a.id, timestamp: a.timestamp, type: a.type, message: a.message, userName: a.userName, requestTitle: r.title });
      });
    });
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
  }, [requests]);

  const sprintStats = useMemo(() => {
    return BUILD_PHASES.map(phase => {
      const phaseReqs = requests.filter(r => r.buildPhase === phase);
      const done = phaseReqs.filter(r => r.taskStatus === 'Done').length;
      return { phase, total: phaseReqs.length, done, pct: phaseReqs.length > 0 ? Math.round((done / phaseReqs.length) * 100) : 0 };
    });
  }, [requests]);

  const daysUntilComp = competitionDate
    ? Math.max(0, Math.ceil((new Date(competitionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, color: 'var(--accent)', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Completed', value: `${stats.completionPct}%`, color: '#10B981', icon: 'M5 13l4 4L19 7' },
    { label: 'In Progress', value: stats.inProgress, color: '#F59E0B', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Blocked', value: stats.blocked, color: '#EF4444', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Competition Countdown */}
      {daysUntilComp !== null && (
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between border-l-[4px] border-[var(--accent)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Competition Countdown</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {daysUntilComp} <span className="text-base font-normal text-[var(--text-secondary)]">days remaining</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)]">Event Date</p>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {new Date(competitionDate!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                <svg className="w-5 h-5" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{card.label}</p>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint Progress */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Sprint Progress</h3>
          <div className="space-y-3">
            {sprintStats.map(s => (
              <div key={s.phase} className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)] w-16 shrink-0">{PHASE_CONFIG[s.phase].name}</span>
                <div className="flex-1 h-3 rounded-full bg-[var(--surface-3)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${s.pct}%`, backgroundColor: PHASE_COLORS[s.phase] }}
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)] tabular-nums w-16 text-right">
                  {s.done}/{s.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* My Tasks */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">My Tasks</h3>
          {myTasks.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-10 h-10 mx-auto mb-2 text-[var(--text-muted)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-[var(--text-muted)]">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => onRequestClick(t)}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[var(--surface-3)] cursor-pointer transition-colors group"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STAGE_COLORS[t.stage] }} />
                  <span className="text-sm text-[var(--text-secondary)] truncate flex-1 group-hover:text-[var(--text-primary)]">{t.title}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0"
                    style={{
                      backgroundColor: t.priority === 'High' ? '#EF444420' : t.priority === 'Medium' ? '#F59E0B20' : '#22C55E20',
                      color: t.priority === 'High' ? '#EF4444' : t.priority === 'Medium' ? '#F59E0B' : '#22C55E',
                    }}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">No activity yet</p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  item.type === 'created' ? 'bg-emerald-500/15' :
                  item.type === 'stage_change' ? 'bg-blue-500/15' :
                  'bg-purple-500/15'
                }`}>
                  <svg className={`w-3.5 h-3.5 ${
                    item.type === 'created' ? 'text-emerald-400' :
                    item.type === 'stage_change' ? 'text-blue-400' :
                    'text-purple-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                      item.type === 'created' ? 'M12 4v16m8-8H4' :
                      item.type === 'stage_change' ? 'M9 5l7 7-7 7' :
                      'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
                    } />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">{item.requestTitle}</span>
                    {' — '}
                    {item.type === 'created' ? 'Created' : item.type === 'stage_change' ? item.message : `Note: ${item.message}`}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {item.userName && `${item.userName} · `}{formatTime(item.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
