'use client';

import { useState, useEffect, useRef } from 'react';
import { DesignRequest, STAGES, STAGE_COLORS, PRIORITY_COLORS, SUBTEAMS, SUBTEAM_COLORS, SessionUser } from './types';

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
    subTeam: request.subTeam,
    assignee: request.assignee,
    dueDate: request.dueDate || '',
  });
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditData({
      title: request.title,
      description: request.description,
      priority: request.priority,
      subTeam: request.subTeam,
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
  const isAdmin = currentUser?.role === 'Admin';
  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Project Lead';

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-lg animate-fadeIn" onClick={onClose}></div>
      <div className="relative glass-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn shadow-2xl">
        
        <div className="flex items-center justify-between p-5 border-b border-[var(--glass-border)] bg-[var(--surface-2)]">
          {isEditing ? (
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="flex-1 glass-input rounded-lg px-3 py-1.5 text-lg font-semibold"
            />
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold truncate pr-4 text-[var(--text-primary)]">{request.title}</h2>
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold glass">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7a2 2 0 010-2.828l7-7A2 2 0 017 3z" />
                </svg>
                V{request.version}
              </span>
              {request.subTeam && (
                <span
                  className="px-2 py-1 rounded-lg text-xs font-semibold"
                  style={{ 
                    backgroundColor: `${SUBTEAM_COLORS[request.subTeam]}20`, 
                    color: SUBTEAM_COLORS[request.subTeam] 
                  }}
                >
                  {request.subTeam}
                </span>
              )}
            </div>
          )}
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2 hover:bg-[var(--surface-3)] rounded-lg cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--accent)] uppercase tracking-wider font-semibold mb-2 block">Status</label>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[request.stage] }}></span>
                <span className="font-medium text-[var(--text-primary)]">{request.stage}</span>
              </div>
            </div>
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2 block">Sub-Team</label>
              {isEditing ? (
                <select
                  value={editData.subTeam || ''}
                  onChange={(e) => setEditData({ ...editData, subTeam: e.target.value as any })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                >
                  <option value="">None</option>
                  {SUBTEAMS.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              ) : (
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{ 
                    backgroundColor: request.subTeam ? `${SUBTEAM_COLORS[request.subTeam]}15` : 'var(--surface-3)', 
                    color: request.subTeam ? SUBTEAM_COLORS[request.subTeam] : 'var(--text-muted)' 
                  }}
                >
                  {request.subTeam || 'Unassigned'}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2 block">Priority</label>
              {isEditing ? (
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value as any })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              ) : (
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{ 
                    backgroundColor: `${PRIORITY_COLORS[request.priority]}15`, 
                    color: PRIORITY_COLORS[request.priority] 
                  }}
                >
                  {request.priority}
                </span>
              )}
            </div>
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2 block">Version</label>
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-primary)] font-semibold">V{request.version}</span>
                {(request.versionHistory?.length || 0) > 0 && (
                  <button
                    onClick={() => setShowVersionHistory(!showVersionHistory)}
                    className="text-[10px] px-2 py-1 rounded-lg text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-colors cursor-pointer"
                  >
                    {request.versionHistory?.length} saved
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="glass-input rounded-xl p-4">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2 block">Assignee</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.assignee}
                onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
                className="w-full glass-input rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                placeholder="Assignee name"
              />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--surface-3)] to-[var(--surface-2)] flex items-center justify-center text-xs font-semibold text-[var(--accent)]">
                  {getInitials(request.assignee)}
                </div>
                <span className="text-[var(--text-secondary)]">{request.assignee || 'Unassigned'}</span>
              </div>
            )}
          </div>

          <div className="glass-input rounded-xl p-4">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2 block">Due Date</label>
            {isEditing ? (
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                className="w-full glass-input rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
              />
            ) : (
              <div className="text-[var(--text-secondary)]">
                {request.dueDate ? formatDate(request.dueDate) : 'No due date'}
              </div>
            )}
          </div>

          <div className="glass-input rounded-xl p-4">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2 block">Description</label>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={3}
                className="w-full glass-input rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] resize-none"
              />
            ) : (
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{request.description || 'No description'}</p>
            )}
          </div>

          {request.blobUrl && (
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2 block">Attachments</label>
              <div className="space-y-2">
                {request.blobUrl.split(',').filter(Boolean).map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 glass rounded-lg hover:bg-[var(--surface-3)] transition-colors text-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-[var(--text-secondary)] truncate">{url.split('/').pop()}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="glass-input rounded-xl p-4">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2 block">Upload File</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              accept=".stp,.step,.pdf,.png,.jpg,.jpeg,.dwg,.dxf"
              className="w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-white file:cursor-pointer file:transition-colors file:hover:file:shadow-[var(--accent-glow)] disabled:opacity-50"
            />
            {isUploading && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 glass rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--cyan)] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            {uploadError && (
              <p className="text-[var(--danger)] text-xs mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {uploadError}
              </p>
            )}
          </div>

          <div className="glass-input rounded-xl p-4">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-3 block">Activity</label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {[...request.activity].reverse().map((entry) => (
                <div key={entry.id} className="flex items-start gap-2 text-sm animate-fadeIn">
                  <span className="text-[var(--text-muted)] whitespace-nowrap text-xs">{formatTime(entry.timestamp)}</span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-[var(--text-secondary)]">
                    {entry.type === 'created' && 'Created'}
                    {entry.type === 'stage_change' && entry.message}
                    {entry.type === 'note_added' && `Note: ${entry.message}`}
                  </span>
                  {entry.userName && <span className="text-[var(--text-muted)]">by {entry.userName}</span>}
                </div>
              ))}
            </div>
          </div>

          {showVersionHistory && request.versionHistory && request.versionHistory.length > 0 && (
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--accent)] uppercase tracking-wider font-semibold mb-3 block">Version History</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {[...request.versionHistory].reverse().map((snapshot, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-3)]">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-[var(--accent)]">V{snapshot.version}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{snapshot.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        Saved by {snapshot.savedBy} on {formatDate(snapshot.savedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-input rounded-xl p-4">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2 block">Add Note</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 glass-input rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                disabled={isSubmitting}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isSubmitting}
                className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-[var(--glass-border)] bg-[var(--surface-2)]">
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors flex items-center gap-1 rounded-lg cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (isSubmitting) return;
                    setIsSubmitting(true);
                    try {
                      await onUpdate(request.id, { saveAsVersion: true } as any);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-3 py-2 text-sm text-[var(--info)] hover:text-[var(--text-primary)] hover:bg-[var(--info-glow)] transition-colors flex items-center gap-1 rounded-lg cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M16 7h3m-3 4h3m-5 4v3a2 2 0 01-2 2H9a2 2 0 01-2-2V7" />
                  </svg>
                  Save V{request.version + 1}
                </button>
                {isAdmin && (
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-3 py-2 text-sm text-[var(--danger)] hover:text-white hover:bg-[var(--danger-glow)] rounded-lg transition-colors cursor-pointer"
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
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--accent)] to-[#059669] hover:from-[var(--accent-hover)] hover:to-[#047857] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[var(--accent-glow)] cursor-pointer"
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