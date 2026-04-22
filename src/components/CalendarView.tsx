'use client';

import { useState, useMemo } from 'react';
import { DesignRequest, STAGES, STAGE_COLORS, SubTeam, SUBTEAM_COLORS } from './types';

interface CalendarViewProps {
  requests: DesignRequest[];
  onRequestClick: (request: DesignRequest) => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView({ requests, onRequestClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const requestsByDay = useMemo(() => {
    const map: Record<string, DesignRequest[]> = {};
    requests.forEach(r => {
      if (r.dueDate) {
        const dateKey = r.dueDate.split('T')[0];
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(r);
      }
    });
    return map;
  }, [requests]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-20 border border-[var(--glass-border)]/30"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayRequests = requestsByDay[dateStr] || [];
    days.push(
      <div key={day} className="h-20 border border-[var(--glass-border)]/30 p-1 overflow-y-auto">
        <span className="text-[10px] text-[var(--text-muted)]">{day}</span>
        <div className="space-y-1 mt-1">
          {dayRequests.slice(0, 2).map(r => (
            <div
              key={r.id}
              onClick={() => onRequestClick(r)}
              className="text-[9px] px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: STAGE_COLORS[r.stage] + '30',
                color: STAGE_COLORS[r.stage],
                borderLeft: `2px solid ${STAGE_COLORS[r.stage]}`
              }}
            >
              {r.title.slice(0, 15)}
            </div>
          ))}
          {dayRequests.length > 2 && (
            <span className="text-[8px] text-[var(--text-muted)]">+{dayRequests.length - 2} more</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-3)] transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden border border-[var(--glass-border)]">
        {DAYS.map(day => (
          <div key={day} className="p-2 text-center text-xs font-semibold text-[var(--text-muted)] bg-[var(--surface-2)]">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}