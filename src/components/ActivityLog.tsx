'use client';

import { DesignRequest } from './types';

interface ActivityLogProps {
  requests: DesignRequest[];
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + 
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function ActivityLog({ requests }: ActivityLogProps) {
  const allActivity: Array<{
    id: string;
    timestamp: string;
    type: string;
    message: string;
    userName?: string;
    requestTitle: string;
  }> = [];

  requests.forEach(r => {
    r.activity.forEach(a => {
      allActivity.push({
        id: a.id,
        timestamp: a.timestamp,
        type: a.type,
        message: a.message,
        userName: a.userName,
        requestTitle: r.title,
      });
    });
  });

  allActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return (
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'stage_change':
        return (
          <div className="w-8 h-8 rounded-xl bg-[var(--info-glow)] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[var(--info)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        );
      case 'note_added':
        return (
          <div className="w-8 h-8 rounded-xl bg-[var(--purple-glow)] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[var(--purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        );
      default:
        return <div className="w-8 h-8 rounded-xl bg-[var(--surface-3)]"></div>;
    }
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] mb-4">All Activity</h2>
      <div className="space-y-3">
        {allActivity.length === 0 ? (
          <div className="glass-card rounded-xl p-6 text-center">
            <svg className="w-10 h-10 mx-auto mb-3 text-[var(--text-muted)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[var(--text-muted)]">No activity yet</p>
          </div>
        ) : (
          allActivity.map((item, idx) => (
            <div 
              key={item.id} 
              className="glass-card rounded-xl p-4 hover:border-[var(--accent)]/30 transition-all duration-200 cursor-pointer"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  {getActivityIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-[var(--text-muted)]">{formatDateTime(item.timestamp)}</span>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span className="text-xs font-medium text-[var(--text-primary)] truncate">{item.requestTitle}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                    {item.type === 'created' && <span className="text-[var(--accent)] font-medium">Request created</span>}
                    {item.type === 'stage_change' && <span className="text-[var(--info)] font-medium">{item.message}</span>}
                    {item.type === 'note_added' && <span className="text-[var(--purple)] font-medium">Note: {item.message}</span>}
                    {item.userName && <span className="text-[var(--text-muted)]"> by {item.userName}</span>}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}