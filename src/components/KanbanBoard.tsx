'use client';

import { DesignRequest, STAGES, STAGE_COLORS } from './types';

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

function KanbanCard({ request, onClick }: { request: DesignRequest; onClick: () => void }) {
  const priorityColors: Record<string, string> = {
    'High': '#EF4444',
    'Medium': '#F59E0B',
    'Low': '#22C55E'
  };
  
  const dueStatus = getDueDateStatus(request.dueDate);
  const isOverdue = dueStatus === 'overdue';
  const isWarning = dueStatus === 'warning';

  return (
    <div
      onClick={onClick}
      className={`bg-[#242424] hover:bg-[#2A2A2A] rounded-lg p-3 cursor-pointer transition-colors border-l-4 ${
        isOverdue ? 'border-red-500' : isWarning ? 'border-yellow-500' : ''
      }`}
      style={{ borderLeftColor: isOverdue || isWarning ? undefined : STAGE_COLORS[request.stage] }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-white truncate flex-1">{request.title}</h4>
        {isOverdue && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">OVERDUE</span>
        )}
        {isWarning && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-medium">DUE SOON</span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ 
            backgroundColor: `${priorityColors[request.priority]}20`, 
            color: priorityColors[request.priority] 
          }}
        >
          {request.priority}
        </span>
        <div
          className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-[10px] font-medium text-[#A0A0A0]"
          title={request.assignee}
        >
          {getInitials(request.assignee)}
        </div>
      </div>
      
      {request.dueDate && !isOverdue && !isWarning && (
        <div className="mt-2 text-[10px] text-[#666]">
          Due: {new Date(request.dueDate).toLocaleDateString()}
        </div>
      )}
      
      {request.activity.length > 1 && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-[#666]">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9z" clipRule="evenodd" />
          </svg>
          {request.activity.length - 1} note{request.activity.length - 1 !== 1 ? 's' : ''}
        </div>
      )}
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
    <div className="flex-1 flex gap-4 p-6 overflow-x-auto">
      {STAGES.map(stage => {
        let stageRequests = filteredRequests.filter(r => r.stage === stage);
        
        stageRequests.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        
        return (
          <div key={stage} className="flex-shrink-0 w-72 flex flex-col">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-t-lg"
              style={{ backgroundColor: `${STAGE_COLORS[stage]}20` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }}></span>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A0A0]">{stage}</h3>
              <span className="ml-auto text-xs text-[#666]">{stageRequests.length}</span>
            </div>
            <div className="flex-1 bg-[#1A1A1A] rounded-b-lg p-2 flex flex-col gap-2 min-h-[200px]">
              {stageRequests.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-xs text-[#666]">
                  No requests
                </div>
              ) : (
                stageRequests.map(req => (
                  <KanbanCard
                    key={req.id}
                    request={req}
                    onClick={() => onCardClick(req)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}