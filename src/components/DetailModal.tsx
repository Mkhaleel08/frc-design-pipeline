'use client';

import { useState, useEffect, useRef } from 'react';
import { DesignRequest, STAGES, STAGE_COLORS, PRIORITY_COLORS, SessionUser } from './types';

interface DetailModalProps {
  request: DesignRequest;
  onClose: () => void;
  onAdvance: (id: string) => Promise<void>;
  onAddNote: (id: string, note: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<DesignRequest>) => Promise<void>;
  currentUser: SessionUser | null;
  refreshRequests: () => Promise<void>;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string): string {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export function DetailModal({ request, onClose, onAdvance, onAddNote, onDelete, onUpdate, currentUser, refreshRequests }: DetailModalProps) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: request.title,
    description: request.description,
    priority: request.priority,
    assignee: request.assignee,
    dueDate: request.dueDate || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditData({
      title: request.title,
      description: request.description,
      priority: request.priority,
      assignee: request.assignee,
      dueDate: request.dueDate || '',
    });
  }, [request]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isUploading) return;
    
    const allowedTypes = ['.stp', '.step', '.pdf', '.png', '.jpg', '.jpeg', '.dwg', '.dxf'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(ext)) {
      setUploadError('Invalid file type. Allowed: .stp, .step, .pdf, .png, .jpg, .jpeg, .dwg, .dxf');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large. Max 10MB.');
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.open('POST', `/api/requests/${request.id}/upload`);
        xhr.send(formData);
      });
      
      await refreshRequests();
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    await onUpdate(request.id, editData);
    setIsEditing(false);
    setIsSubmitting(false);
  };

  const currentStageIndex = STAGES.indexOf(request.stage);
  const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;
  const isLead = currentUser?.role === 'Lead';

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fadeIn" onClick={onClose}></div>
      <div className="relative bg-[#171717] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn shadow-2xl border border-[#2A2A2A]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2A2A2A] bg-[#1F1F1F]">
          {isEditing ? (
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="flex-1 bg-[#262626] border border-[#3A3A3A] rounded-lg px-3 py-1.5 text-lg font-semibold focus:outline-none focus:border-[#10B981]"
            />
          ) : (
            <h2 className="text-lg font-semibold truncate pr-4">{request.title}</h2>
          )}
          <button onClick={onClose} className="text-[#737373] hover:text-white transition-colors p-1 hover:bg-[#262626] rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
              <label className="text-xs text-[#555] uppercase tracking-wider mb-2 block">Status</label>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[request.stage] }}></span>
                <span className="font-medium">{request.stage}</span>
              </div>
            </div>
            <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
              <label className="text-xs text-[#555] uppercase tracking-wider mb-2 block">Priority</label>
              {isEditing ? (
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value as any })}
                  className="w-full bg-[#171717] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              ) : (
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                  style={{ 
                    backgroundColor: `${PRIORITY_COLORS[request.priority]}15`, 
                    color: PRIORITY_COLORS[request.priority] 
                  }}
                >
                  {request.priority}
                </span>
              )}
            </div>
          </div>

          {/* Assignee */}
          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
            <label className="text-xs text-[#555] uppercase tracking-wider mb-2 block">Assignee</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.assignee}
                onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
                className="w-full bg-[#171717] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm"
                placeholder="Assignee name"
              />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3A3A3A] to-[#4A4A4A] flex items-center justify-center text-xs font-semibold">
                  {getInitials(request.assignee)}
                </div>
                <span className="text-[#A1A1A1]">{request.assignee || 'Unassigned'}</span>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
            <label className="text-xs text-[#555] uppercase tracking-wider mb-2 block">Due Date</label>
            {isEditing ? (
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                className="w-full bg-[#171717] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm"
              />
            ) : (
              <div className="text-[#A1A1A1]">
                {request.dueDate ? formatDate(request.dueDate) : 'No due date'}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
            <label className="text-xs text-[#555] uppercase tracking-wider mb-2 block">Description</label>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={3}
                className="w-full bg-[#171717] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm resize-none"
              />
            ) : (
              <p className="text-[#A1A1A1] text-sm leading-relaxed">{request.description || 'No description'}</p>
            )}
          </div>

          {/* File Attachments */}
          {request.blobUrl && (
            <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
              <label className="text-xs text-[#555] uppercase tracking-wider mb-2 block">Attachments</label>
              <div className="space-y-2">
                {request.blobUrl.split(',').filter(Boolean).map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-[#171717] rounded-lg hover:bg-[#262626] transition-colors text-sm"
                  >
                    <svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-[#A1A1A1] truncate">{url.split('/').pop()}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
            <label className="text-xs text-[#555] uppercase tracking-wider mb-2 block">Upload File</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              accept=".stp,.step,.pdf,.png,.jpg,.jpeg,.dwg,.dxf"
              className="w-full text-sm text-[#737373] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#10B981] file:text-white file:cursor-pointer file:transition-colors file:hover:bg-[#059669] disabled:opacity-50"
            />
            {isUploading && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-[#737373] mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 bg-[#262626] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#10B981] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            {uploadError && (
              <p className="text-[#EF4444] text-xs mt-2">{uploadError}</p>
            )}
          </div>
          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
            <label className="text-xs text-[#555] uppercase tracking-wider mb-3 block">Activity</label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {[...request.activity].reverse().map((entry) => (
                <div key={entry.id} className="flex items-start gap-2 text-sm animate-fadeIn">
                  <span className="text-[#555] whitespace-nowrap text-xs">{formatTime(entry.timestamp)}</span>
                  <span className="text-[#404040]">•</span>
                  <span className="text-[#737373]">
                    {entry.type === 'created' && 'Created'}
                    {entry.type === 'stage_change' && entry.message}
                    {entry.type === 'note_added' && `Note: ${entry.message}`}
                  </span>
                  {entry.userName && <span className="text-[#555]">by {entry.userName}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Add Note */}
          <div className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
            <label className="text-xs text-[#555] uppercase tracking-wider mb-2 block">Add Note</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 bg-[#171717] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#10B981] transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                disabled={isSubmitting}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isSubmitting}
                className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#2A2A2A] bg-[#1F1F1F]">
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-sm text-[#737373] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-sm text-[#737373] hover:text-white hover:bg-[#262626] transition-colors flex items-center gap-1 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                {isLead && (
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-sm text-[#EF4444] hover:text-white hover:bg-[#EF4444]/20 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
          {nextStage && (
            <button
              onClick={handleAdvance}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
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