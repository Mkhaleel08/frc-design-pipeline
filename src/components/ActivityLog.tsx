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
          <div className="w-7 h-7 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'stage_change':
        return (
          <div className="w-7 h-7 rounded-full bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        );
      case 'note_added':
        return (
          <div className="w-7 h-7 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        );
      default:
        return <div className="w-2 h-2 rounded-full bg-[#404040]"></div>;
    }
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-sm font-semibold tracking-wide text-[#737373] mb-4">All Activity</h2>
      <div className="space-y-2">
        {allActivity.length === 0 ? (
          <div className="text-sm text-[#555] p-4 bg-[#171717] rounded-xl border border-[#2A2A2A]">
            No activity yet
          </div>
        ) : (
          allActivity.map((item, idx) => (
            <div 
              key={item.id} 
              className="flex items-start gap-3 py-3 px-4 bg-[#171717] rounded-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-200"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="pt-0.5">
                {getActivityIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[#737373]">{formatDateTime(item.timestamp)}</span>
                  <span className="text-xs text-[#404040]">•</span>
                  <span className="text-xs font-medium text-white truncate">{item.requestTitle}</span>
                </div>
                <p className="text-sm text-[#A1A1A1] mt-1">
                  {item.type === 'created' && <span className="text-[#10B981]">Request created</span>}
                  {item.type === 'stage_change' && <span className="text-[#3B82F6]">{item.message}</span>}
                  {item.type === 'note_added' && <span className="text-[#8B5CF6]">Note: {item.message}</span>}
                  {item.userName && <span className="text-[#555]"> by {item.userName}</span>}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}