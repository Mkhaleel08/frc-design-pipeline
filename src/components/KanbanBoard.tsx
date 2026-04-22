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
      className={`group bg-[#1F1F1F] hover:bg-[#262626] rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/30 border border-[#2A2A2A] hover:border-[#3A3A3A] ${
        isOverdue ? 'ring-1 ring-red-500/30' : isWarning ? 'ring-1 ring-yellow-500/30' : ''
      }`}
      style={{ 
        boxShadow: isOverdue || isWarning 
          ? `0 4px 20px -3px ${isOverdue ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`
          : '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-medium text-white truncate flex-1 group-hover:text-[#10B981] transition-colors duration-200">
          {request.title}
        </h4>
        {isOverdue && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold animate-pulse">
            OVERDUE
          </span>
        )}
        {isWarning && !isOverdue && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold">
            DUE SOON
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] px-2.5 py-1 rounded-md font-medium"
          style={{ 
            backgroundColor: `${priorityColors[request.priority]}15`, 
            color: priorityColors[request.priority] 
          }}
        >
          {request.priority}
        </span>
        
        <div className="flex items-center gap-2">
          {request.dueDate && !isOverdue && !isWarning && (
            <span className="text-[10px] text-[#737373]">
              {new Date(request.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          <div
            className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3A3A3A] to-[#4A4A4A] flex items-center justify-center text-[10px] font-semibold text-[#A1A1A1] ring-2 ring-[#171717] group-hover:ring-[#10B981]/30 transition-all duration-300"
          >
            {getInitials(request.assignee)}
          </div>
        </div>
      </div>
      
      {request.activity.length > 1 && (
        <div className="mt-3 pt-3 border-t border-[#2A2A2A] flex items-center gap-1 text-[10px] text-[#555]">
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
    <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A] animate-pulse">
      <div className="h-4 w-3/4 bg-[#2A2A2A] rounded mb-3"></div>
      <div className="flex justify-between">
        <div className="h-5 w-14 bg-[#2A2A2A] rounded"></div>
        <div className="h-7 w-7 bg-[#2A2A2A] rounded-full"></div>
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
    <div className="flex-1 flex gap-4 p-6 overflow-x-auto">
      {STAGES.map((stage, stageIdx) => {
        let stageRequests = filteredRequests.filter(r => r.stage === stage);
        
        stageRequests.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        
        return (
          <div key={stage} className="flex-shrink-0 w-80 flex flex-col">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-t-xl border-b-2"
              style={{ 
                backgroundColor: `${STAGE_COLORS[stage]}08`,
                borderBottomColor: STAGE_COLORS[stage]
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: STAGE_COLORS[stage] }}></span>
              <h3 className="text-xs font-semibold tracking-wide text-[#A1A1A1]">{stage}</h3>
              <span className="ml-auto text-xs font-medium bg-[#262626] px-2.5 py-0.5 rounded-md text-[#737373]">
                {stageRequests.length}
              </span>
            </div>
            <div className="flex-1 bg-[#171717] rounded-b-xl p-3 flex flex-col gap-3 min-h-[300px] border-x border-b border-[#2A2A2A]">
              {stageRequests.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-xs text-[#404040] border-2 border-dashed border-[#2A2A2A] rounded-xl">
                  <div className="text-center">
                    <div className="mb-1">No requests</div>
                    <div className="text-[#333333]">Drop one here</div>
                  </div>
                </div>
              ) : (
                stageRequests.map((req, idx) => (
                  <div 
                    key={req.id} 
                    className="animate-slideUp"
                    style={{ animationDelay: `${stageIdx * 50 + idx * 30}ms` }}
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