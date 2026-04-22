'use client';

import { useState, useMemo } from 'react';
import { 
  DesignRequest, SubTeam, TASK_STATUSES, TaskStatus, 
  TASK_STATUS_COLORS, PHASE_COLORS, BuildPhase,
  ManufacturingStatus, WiringStatus, SoftwareSubsystem,
  MANUFACTURING_COLORS, WIRING_COLORS
} from './types';

interface FRCTaskBoardProps {
  requests: DesignRequest[];
  subTeam: SubTeam;
  onTaskClick: (request: DesignRequest) => void;
}

const SUBTEAM_TASKS: Record<SubTeam, TaskStatus[]> = {
  'Mechanical': TASK_STATUSES,
  'Electrical': TASK_STATUSES,
  'Programming': TASK_STATUSES,
  'CAD': TASK_STATUSES,
  'Business': TASK_STATUSES,
  'Strategy': TASK_STATUSES
};

export function FRCTaskBoard({ requests, subTeam, onTaskClick }: FRCTaskBoardProps) {
  const statuses = SUBTEAM_TASKS[subTeam] || TASK_STATUSES;
  
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, DesignRequest[]> = {
      'Not Started': [],
      'In Progress': [],
      'Blocked': [],
      'Done': []
    };
    
    requests
      .filter(r => r.subTeam === subTeam)
      .forEach(r => {
        const status = r.taskStatus || 'Not Started';
        if (grouped[status]) {
          grouped[status].push(r);
        }
      });
    
    return grouped;
  }, [requests, subTeam]);

  const renderTaskCard = (task: DesignRequest) => {
    const isBlocked = task.isBlocked || task.taskStatus === 'Blocked';
    
    return (
      <div
        key={task.id}
        onClick={() => onTaskClick(task)}
        className={`glass-card rounded-xl p-3 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-l-[3px] ${
          isBlocked ? 'border-[var(--danger)]' : 
          task.taskStatus === 'Done' ? 'border-[var(--accent)]' :
          'border-[var(--glass-border)]'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-medium text-[var(--text-primary)] truncate flex-1">
            {task.title}
          </h4>
          {isBlocked && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--danger-glow)] text-[var(--danger)] font-semibold">
              BLOCKED
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-2">
          {task.buildPhase && (
            <span 
              className="text-[9px] px-1.5 py-0.5 rounded font-medium"
              style={{ 
                backgroundColor: `${PHASE_COLORS[task.buildPhase]}20`, 
                color: PHASE_COLORS[task.buildPhase] 
              }}
            >
              {task.buildPhase}
            </span>
          )}
          {task.priority && (
            <span 
              className="text-[9px] px-1.5 py-0.5 rounded font-medium"
              style={{ 
                backgroundColor: task.priority === 'High' ? '#EF444420' : 
                task.priority === 'Medium' ? '#F59E0B20' : '#22C55E20', 
                color: task.priority === 'High' ? '#EF4444' : 
                task.priority === 'Medium' ? '#F59E0B' : '#22C55E' 
              }}
            >
              {task.priority}
            </span>
          )}
        </div>

        {subTeam === 'Mechanical' && (
          <div className="space-y-1">
            {task.manufacturingStatus && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: MANUFACTURING_COLORS[task.manufacturingStatus as ManufacturingStatus] }}></span>
                <span className="text-[10px] text-[var(--text-secondary)]">{task.manufacturingStatus}</span>
              </div>
            )}
            {task.machineRequired && (
              <span className="text-[10px] text-[var(--text-muted)]">Machine: {task.machineRequired}</span>
            )}
            {task.weightEstimate !== undefined && (
              <span className="text-[10px] text-[var(--text-muted)]">{task.weightEstimate} lbs</span>
            )}
          </div>
        )}

        {subTeam === 'Electrical' && (
          <div className="space-y-1">
            {task.wiringStatus && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: WIRING_COLORS[task.wiringStatus as WiringStatus] }}></span>
                <span className="text-[10px] text-[var(--text-secondary)]">{task.wiringStatus}</span>
              </div>
            )}
            {task.componentReceived !== undefined && (
              <span className={`text-[10px] ${task.componentReceived ? 'text-[var(--accent)]' : 'text-[var(--warning)]'}`}>
                {task.componentReceived ? '✓ Parts Received' : '⚠ Parts Pending'}
              </span>
            )}
          </div>
        )}

        {subTeam === 'Programming' && (
          <div className="space-y-1">
            {task.softwareSubsystem && (
              <span className="text-[10px] text-[var(--text-secondary)]">{task.softwareSubsystem}</span>
            )}
            {task.testedOnRobot && (
              <span className="text-[10px] text-[var(--accent)]">✓ Tested on Robot</span>
            )}
            {!task.testedOnRobot && task.taskStatus === 'Done' && (
              <span className="text-[10px] text-[var(--warning)]">⚠ Sim Only</span>
            )}
          </div>
        )}

        {task.dependency && (
          <div className="mt-2 pt-2 border-t border-[var(--glass-border)]">
            <span className="text-[9px] text-[var(--text-muted)]">Depends on: {task.dependency}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--glass-border)]">
          <span className="text-[10px] text-[var(--text-muted)]">{task.taskOwner || task.assignee}</span>
          {task.dueDate && (
            <span className="text-[10px] text-[var(--text-muted)]">
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 p-6 overflow-x-auto h-full">
      {statuses.map(status => (
        <div key={status} className="flex-shrink-0 w-72 flex flex-col">
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-t-xl border-b-[3px]"
            style={{ 
              backgroundColor: `${TASK_STATUS_COLORS[status]}15`,
              borderBottomColor: TASK_STATUS_COLORS[status]
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TASK_STATUS_COLORS[status] }}></span>
            <h3 className="text-xs font-semibold text-[var(--text-secondary)]">{status}</h3>
            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded bg-[var(--surface-3)] text-[var(--text-muted)]">
              {tasksByStatus[status].length}
            </span>
          </div>
          
          <div className="flex-1 glass rounded-b-xl p-3 space-y-3 min-h-[400px]">
            {tasksByStatus[status].length === 0 ? (
              <div className="flex items-center justify-center h-32 text-xs text-[var(--text-muted)]">
                No tasks
              </div>
            ) : (
              tasksByStatus[status].map(task => renderTaskCard(task))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}