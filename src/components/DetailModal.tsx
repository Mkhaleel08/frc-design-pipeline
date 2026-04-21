'use client';

import { useState } from 'react';
import { DesignRequest, STAGES, STAGE_COLORS, PRIORITY_COLORS } from './types';

interface DetailModalProps {
  request: DesignRequest;
  onClose: () => void;
  onAdvance: (id: string) => Promise<void>;
  onAddNote: (id: string, note: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export function DetailModal({ request, onClose, onAdvance, onAddNote, onDelete }: DetailModalProps) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await onAddNote(request.id, newNote);
    setNewNote('');
    setIsSubmitting(false);
  };

  const handleAdvance = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await onAdvance(request.id);
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this request?') || isSubmitting) return;
    setIsSubmitting(true);
    await onDelete(request.id);
  };

  const currentStageIndex = STAGES.indexOf(request.stage);
  const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#1A1A1A] rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <h2 className="text-lg font-semibold truncate">{request.title}</h2>
          <button onClick={onClose} className="text-[#666] hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#666] uppercase tracking-wider">Status</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[request.stage] }}></span>
                <span className="text-sm">{request.stage}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#666] uppercase tracking-wider">Priority</label>
              <div className="mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ 
                    backgroundColor: `${PRIORITY_COLORS[request.priority]}20`, 
                    color: PRIORITY_COLORS[request.priority] 
                  }}
                >
                  {request.priority}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#666] uppercase tracking-wider">Assignee</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-5 h-5 rounded-full bg-[#333] flex items-center justify-center text-[10px]">
                  {getInitials(request.assignee)}
                </div>
                <span className="text-sm">{request.assignee}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#666] uppercase tracking-wider">Role</label>
              <p className="text-sm mt-1">{request.role}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Description</label>
            <p className="text-sm mt-1 text-[#A0A0A0]">{request.description || 'No description'}</p>
          </div>

          {request.attachments && (
            <div>
              <label className="text-xs text-[#666] uppercase tracking-wider">Attachments</label>
              <p className="text-sm mt-1 text-[#3B82F6] whitespace-pre-wrap">{request.attachments}</p>
            </div>
          )}

          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Activity Log</label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {[...request.activity].reverse().map(entry => (
                <div key={entry.id} className="flex items-start gap-2 text-xs">
                  <span className="text-[#666] whitespace-nowrap">{formatTime(entry.timestamp)}</span>
                  {entry.userName && <span className="text-[#666]">({entry.userName})</span>}
                  <span className="text-[#A0A0A0]">
                    {entry.type === 'created' && 'Created'}
                    {entry.type === 'stage_change' && entry.message}
                    {entry.type === 'note_added' && `Note: ${entry.message}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Add Note</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 bg-[#242424] border border-[#333] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22C55E]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                disabled={isSubmitting}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isSubmitting}
                className="px-3 py-2 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-white text-sm rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-[#333]">
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="text-sm text-[#EF4444] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#EF4444]/20 transition-colors disabled:opacity-50"
          >
            Delete
          </button>
          {nextStage && (
            <button
              onClick={handleAdvance}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-white text-sm font-medium rounded-lg"
            >
              Advance to {nextStage}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}