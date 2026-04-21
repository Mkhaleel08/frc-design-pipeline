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

  return (
    <div className="flex-1 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#666] mb-4">All Activity</h2>
      <div className="space-y-1">
        {allActivity.length === 0 ? (
          <div className="text-sm text-[#666]">No activity yet</div>
        ) : (
          allActivity.map(item => (
            <div key={item.id} className="flex items-start gap-3 py-2 px-3 bg-[#1A1A1A] rounded-lg">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-[#333]"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#666]">{formatDateTime(item.timestamp)}</span>
                  <span className="text-xs text-[#A0A0A0]">•</span>
                  <span className="text-xs text-white truncate">{item.requestTitle}</span>
                </div>
                <p className="text-sm text-[#A0A0A0] mt-0.5">
                  {item.type === 'created' && 'Request created'}
                  {item.type === 'stage_change' && item.message}
                  {item.type === 'note_added' && `Note: ${item.message}`}
                  {item.userName && <span className="text-[#666]"> by {item.userName}</span>}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}