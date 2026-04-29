'use client';

import { useState } from 'react';
import { SubTeam, SUBTEAMS, Label, LABELS, LABEL_COLORS, BuildPhase, BUILD_PHASES, PHASE_CONFIG, TaskStatus, TASK_STATUSES, ManufacturingStatus, MANUFACTURING_STATUSES, WiringStatus, WIRING_STATUSES, SoftwareSubsystem, SOFTWARE_SUBSYSTEMS, SessionUser } from './types';

interface FormModalProps {
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export interface FormData {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  subTeam: SubTeam | null;
  labels: Label[];
  assignee: string;
  attachments: string;
  notes: string;
  dueDate?: string;
  buildPhase: BuildPhase;
  taskStatus: TaskStatus;
  dependency?: string;
  isBlocked: boolean;
  blockerReason?: string;
  manufacturingStatus?: ManufacturingStatus;
  machineRequired?: string;
  weightEstimate?: number;
  wiringStatus?: WiringStatus;
  componentReceived?: boolean;
  testedOnRobot?: boolean;
  softwareSubsystem?: SoftwareSubsystem;
}

export function FormModal({ onSubmit, onClose, isLoading }: FormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'Medium',
    subTeam: null,
    labels: [],
    assignee: '',
    attachments: '',
    notes: '',
    dueDate: '',
    buildPhase: 'Sprint1',
    taskStatus: 'Not Started',
    dependency: '',
    isBlocked: false,
    blockerReason: '',
    manufacturingStatus: undefined,
    machineRequired: '',
    weightEstimate: undefined,
    wiringStatus: undefined,
    componentReceived: false,
    testedOnRobot: false,
    softwareSubsystem: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleLabel = (label: Label) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-lg animate-fadeIn" onClick={onClose}></div>
      <div className="relative glass-card rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)] bg-[var(--surface-2)]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">New Parts Request</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Create a new parts request for the team</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="glass-input rounded-xl p-5">
            <label className="text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">Title <span className="text-[var(--danger)]">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={handleChange('title')}
              required
              placeholder="What do you need designed?"
              className={`w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-0 ${
                errors.title ? 'text-[var(--danger)]' : ''
              }`}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-[var(--danger)] text-xs mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          <div className="glass-input rounded-xl p-5">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Description</label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Describe what you need and any specific requirements..."
              rows={3}
              className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-0 resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">Priority</label>
              <select
                value={formData.priority}
                onChange={handleChange('priority')}
                className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0"
                disabled={isLoading}
              >
                <option value="High" className="bg-[var(--bg-vibrant-1)]">High</option>
                <option value="Medium" className="bg-[var(--bg-vibrant-1)]">Medium</option>
                <option value="Low" className="bg-[var(--bg-vibrant-1)]">Low</option>
              </select>
            </div>
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Sub-Team</label>
              <select
                value={formData.subTeam || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, subTeam: e.target.value as SubTeam || null }))}
                className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0"
                disabled={isLoading}
              >
                <option value="" className="bg-[var(--bg-vibrant-1)]">Select team...</option>
                {SUBTEAMS.map(team => (
                  <option key={team} value={team} className="bg-[var(--bg-vibrant-1)]">{team}</option>
                ))}
              </select>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">Sprint</label>
              <select
                value={formData.buildPhase}
                onChange={handleChange('buildPhase')}
                className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0"
                disabled={isLoading}
              >
                {BUILD_PHASES.map(phase => (
                  <option key={phase} value={phase} className="bg-[var(--bg-vibrant-1)]">{PHASE_CONFIG[phase].name}</option>
                ))}
              </select>
            </div>
            <div className="glass-input rounded-xl p-4">
              <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Task Status</label>
              <select
                value={formData.taskStatus}
                onChange={handleChange('taskStatus')}
                className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0"
                disabled={isLoading}
              >
                {TASK_STATUSES.map(status => (
                  <option key={status} value={status} className="bg-[var(--bg-vibrant-1)]">{status}</option>
                ))}
              </select>
            </div>
          </div>

          {(formData.subTeam === 'Mechanical' || formData.subTeam === 'CAD') && (
            <div className="glass-input rounded-xl p-4 space-y-3">
              <label className="text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">Mechanical Fields</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Manufacturing Status</label>
                  <select
                    value={formData.manufacturingStatus || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, manufacturingStatus: (e.target.value || undefined) as ManufacturingStatus }))}
                    className="w-full mt-1 bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  >
                    <option value="" className="bg-[var(--bg-vibrant-1)]">Not Started</option>
                    {MANUFACTURING_STATUSES.map(status => (
                      <option key={status} value={status} className="bg-[var(--bg-vibrant-1)]">{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Machine/Tool Required</label>
                  <input
                    type="text"
                    value={formData.machineRequired || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, machineRequired: e.target.value || undefined }))}
                    placeholder="e.g., Lathe, Mill, CNC"
                    className="w-full mt-1 bg-transparent border-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Weight Estimate (lbs)</label>
                  <input
                    type="number"
                    value={formData.weightEstimate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, weightEstimate: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    placeholder="0.0"
                    step="0.1"
                    className="w-full mt-1 bg-transparent border-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {formData.subTeam === 'Electrical' && (
            <div className="glass-input rounded-xl p-4 space-y-3">
              <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Electrical Fields</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Wiring Status</label>
                  <select
                    value={formData.wiringStatus || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, wiringStatus: (e.target.value || undefined) as WiringStatus }))}
                    className="w-full mt-1 bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  >
                    <option value="" className="bg-[var(--bg-vibrant-1)]">Not Started</option>
                    {WIRING_STATUSES.map(status => (
                      <option key={status} value={status} className="bg-[var(--bg-vibrant-1)]">{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.componentReceived || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, componentReceived: e.target.checked }))}
                      className="w-4 h-4 rounded border-[var(--glass-border)] bg-transparent text-[var(--accent)] focus:ring-0 focus:ring-offset-0"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-[var(--text-secondary)]">Parts Received</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {formData.subTeam === 'Programming' && (
            <div className="glass-input rounded-xl p-4 space-y-3">
              <label className="text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">Software Fields</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Subsystem</label>
                  <select
                    value={formData.softwareSubsystem || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, softwareSubsystem: (e.target.value || undefined) as SoftwareSubsystem }))}
                    className="w-full mt-1 bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  >
                    <option value="" className="bg-[var(--bg-vibrant-1)]">Select...</option>
                    {SOFTWARE_SUBSYSTEMS.map(sub => (
                      <option key={sub} value={sub} className="bg-[var(--bg-vibrant-1)]">{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.testedOnRobot || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, testedOnRobot: e.target.checked }))}
                      className="w-4 h-4 rounded border-[var(--glass-border)] bg-transparent text-[var(--accent)] focus:ring-0 focus:ring-offset-0"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-[var(--text-secondary)]">Tested on Robot</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="glass-input rounded-xl p-4">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={formData.isBlocked || false}
                onChange={(e) => setFormData(prev => ({ ...prev, isBlocked: e.target.checked }))}
                className="w-4 h-4 rounded border-[var(--glass-border)] bg-transparent text-[var(--danger)] focus:ring-0 focus:ring-offset-0"
                disabled={isLoading}
              />
              <span className="text-xs text-[var(--danger)] uppercase tracking-wider font-semibold">Blocked</span>
            </label>
            {formData.isBlocked && (
              <input
                type="text"
                value={formData.blockerReason || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, blockerReason: e.target.value || undefined }))}
                placeholder="Reason for blocking..."
                className="w-full bg-transparent border-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-0"
                disabled={isLoading}
              />
            )}
          </div>

          <div className="glass-input rounded-xl p-4">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Dependency (Task ID)</label>
            <input
              type="text"
              value={formData.dependency || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, dependency: e.target.value || undefined }))}
              placeholder="ID of task this depends on..."
              className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-0"
              disabled={isLoading}
            />
          </div>

          <div className="glass-input rounded-xl p-5">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={handleChange('dueDate')}
              className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              disabled={isLoading}
            />
          </div>

          <div className="glass-input rounded-xl p-5">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Assignee</label>
            <input
              type="text"
              value={formData.assignee}
              onChange={handleChange('assignee')}
              placeholder="Who should work on this?"
              className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-0"
              disabled={isLoading}
            />
          </div>

          <div className="glass-input rounded-xl p-5">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attachment URL
            </label>
            <input
              type="url"
              value={formData.attachments}
              onChange={handleChange('attachments')}
              placeholder="Paste a link to your CAD file, PDF, or image"
              className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-0"
              disabled={isLoading}
            />
          </div>

          <div className="glass-input rounded-xl p-5">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Initial Notes</label>
            <textarea
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Add any initial notes, specifications, or context..."
              rows={2}
              className="w-full mt-2 bg-transparent border-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-0 resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-5 py-3 glass-button text-[var(--text-secondary)] rounded-xl hover:text-[var(--text-primary)] transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--accent)] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[var(--accent-glow)] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}