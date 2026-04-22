'use client';

import { DesignRequest, STAGES, STAGE_COLORS, SUBTEAMS, SUBTEAM_COLORS, SubTeam, LABELS, LABEL_COLORS, Label } from './types';

interface KanbanBoardProps {
  requests: DesignRequest[];
  onCardClick: (request: DesignRequest) => void;
  searchQuery?: string;
  priorityFilter?: string;
  assigneeFilter?: string;
}

function getInitials(name: string): string {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getDueDateStatus(dueDate?: string): 'overdue' | 'warning' | 'normal' | null {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const now = new Date();
  const hoursUntil = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntil < 0) return 'overdue';
  if (hoursUntil <= 24) return 'warning';
  return null;
}

function KanbanCard({ request, onClick, idx }: { request: DesignRequest; onClick: () => void; idx: number }) {
  const priorityColors: Record<string, string> = {
    'High': '#EF4444',
    'Medium': '#F59E0B',
    'Low': '#10B981'
  };
  
  const dueStatus = getDueDateStatus(request.dueDate);
  const isOverdue = dueStatus === 'overdue';
  const isWarning = dueStatus === 'warning';

  return (
    <div
      onClick={onClick}
      className={`group glass-card hover:border-[var(--accent)]/40 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        isOverdue ? 'border-l-[3px] border-[var(--danger)]' : 
        isWarning ? 'border-l-[3px] border-[var(--warning)]' :
        'border-[var(--glass-border)]'
      }`}
      style={{ 
        borderLeftWidth: '3px',
        borderLeftColor: isOverdue ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'transparent',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-medium text-[var(--text-primary)] truncate flex-1 group-hover:text-[var(--accent)] transition-colors">
          {request.title}
        </h4>
        {isOverdue && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--danger-glow)] text-[var(--danger)] font-semibold animate-pulse">
            OVERDUE
          </span>
        )}
        {isWarning && !isOverdue && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--warning-glow)] text-[var(--warning)] font-semibold">
            DUE SOON
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-2.5 py-1 rounded-lg font-medium"
            style={{ 
              backgroundColor: `${priorityColors[request.priority]}15`, 
              color: priorityColors[request.priority] 
            }}
          >
            {request.priority}
          </span>
          {request.subTeam && (
            <span
              className="text-[10px] px-2 py-1 rounded-lg font-semibold"
              style={{ 
                backgroundColor: `${SUBTEAM_COLORS[request.subTeam as SubTeam]}20`, 
                color: SUBTEAM_COLORS[request.subTeam as SubTeam] 
              }}
            >
              {request.subTeam}
            </span>
          )}
        </div>
        
        {(request.labels && request.labels.length > 0) && (
          <div className="flex items-center gap-1 flex-wrap mt-2">
            {request.labels.slice(0, 3).map(label => (
              <span
                key={label}
                className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                style={{ 
                  backgroundColor: `${LABEL_COLORS[label as Label]}25`, 
                  color: LABEL_COLORS[label as Label] 
                }}
              >
                {label === 'Needs Review' ? 'Review' : label === 'In Progress' ? 'Active' : label}
              </span>
            ))}
            {request.labels.length > 3 && (
              <span className="text-[9px] text-[var(--text-muted)]">+{request.labels.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-[var(--text-muted)] font-medium">
            V{request.version}
          </span>
          {request.dueDate && !isOverdue && !isWarning && (
            <span className="text-[10px] text-[var(--text-muted)]">
              {new Date(request.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          <div
            className="w-7 h-7 rounded-lg glass border border-[var(--glass-border)] flex items-center justify-center text-[10px] font-semibold text-[var(--text-secondary)] transition-colors duration-200 group-hover:border-[var(--accent)]/50 group-hover:text-[var(--accent)]"
          >
            {getInitials(request.assignee)}
          </div>
        </div>
      </div>
      
      {request.activity.length > 1 && (
        <div className="mt-3 pt-3 border-t border-[var(--glass-border)] flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9z" clipRule="evenodd" />
          </svg>
          <span>{request.activity.length - 1} {request.activity.length - 1 === 1 ? 'note' : 'notes'}</span>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl p-4 animate-shimmer">
      <div className="h-4 w-3/4 bg-[var(--surface-3)] rounded mb-3"></div>
      <div className="flex justify-between">
        <div className="h-5 w-14 bg-[var(--surface-3)] rounded"></div>
        <div className="h-7 w-7 bg-[var(--surface-3)] rounded-lg"></div>
      </div>
    </div>
  );
}

export function KanbanBoard({ requests, onCardClick, searchQuery, priorityFilter, assigneeFilter }: KanbanBoardProps) {
  let filteredRequests = [...requests];
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredRequests = filteredRequests.filter(r => r.title.toLowerCase().includes(query));
  }
  
  if (priorityFilter && priorityFilter !== 'All') {
    filteredRequests = filteredRequests.filter(r => r.priority === priorityFilter);
  }
  
  if (assigneeFilter && assigneeFilter !== 'All') {
    filteredRequests = filteredRequests.filter(r => r.assignee === assigneeFilter);
  }

  return (
    <div className="flex-1 flex gap-4 p-6 overflow-x-auto scroll-hide">
      {STAGES.map((stage, stageIdx) => {
        let stageRequests = filteredRequests.filter(r => r.stage === stage);
        
        stageRequests.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        
        return (
          <div key={stage} className="flex-shrink-0 w-[300px] flex flex-col">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-t-xl border-b-[3px]"
              style={{ 
                backgroundColor: `${STAGE_COLORS[stage]}12`,
                borderBottomColor: STAGE_COLORS[stage]
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }}></span>
              <h3 className="text-xs font-semibold tracking-wide text-[var(--text-secondary)]">{stage}</h3>
              <span className="ml-auto text-xs font-semibold glass px-2.5 py-0.5 rounded-lg text-[var(--text-muted)]">
                {stageRequests.length}
              </span>
            </div>
            <div className="flex-1 glass rounded-b-xl p-3 flex flex-col gap-3 min-h-[200px] border-x border-b border-[var(--glass-border)]">
              {stageRequests.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-xs text-[var(--text-muted)] border-2 border-dashed border-[var(--glass-border)] rounded-xl">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-[var(--text-muted)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <div>No requests</div>
                  </div>
                </div>
              ) : (
                stageRequests.map((req, idx) => (
                  <div 
                    key={req.id} 
                    className="animate-slideUp"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <KanbanCard
                      request={req}
                      onClick={() => onCardClick(req)}
                      idx={idx}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}