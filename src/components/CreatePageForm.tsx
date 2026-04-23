'use client';

import { useState } from 'react';
import { FormData } from './FormModal';
import { SubTeam, SUBTEAMS, Label, LABELS, LABEL_COLORS, BuildPhase, BUILD_PHASES, TaskStatus, TASK_STATUSES, ManufacturingStatus, MANUFACTURING_STATUSES, WiringStatus, WIRING_STATUSES, SoftwareSubsystem, SOFTWARE_SUBSYSTEMS } from './types';

interface CreatePageFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export function CreatePageForm({ onSubmit, isLoading }: CreatePageFormProps) {
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
    buildPhase: 'ParkingLot',
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
    leadOverride: false,
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
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;
    await onSubmit(formData);
  };

  const section = (label: string, accent: boolean, children: React.ReactNode) => (
    <div className="space-y-1">
      <label className={`text-[10px] ${accent ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'} uppercase tracking-wider font-semibold block`}>
        {label}
      </label>
      {children}
    </div>
  );

  const inputClass = (hasError?: string) =>
    `w-full px-4 py-3 bg-[rgba(13,17,23,0.6)] backdrop-blur-sm border rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-all ${
      hasError
        ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_var(--danger-glow)]'
        : 'border-[var(--border-subtle)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)]'
    }`;

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-[var(--glass-border)] bg-gradient-to-r from-[var(--surface-2)] to-[var(--surface-1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[#059669] flex items-center justify-center shadow-lg accent-glow">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">New Design Request</h2>
            <p className="text-xs text-[var(--text-muted)]">Fill out the form below to submit your request to the pipeline</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="glass-input rounded-xl p-5">
          {section('Title', true,
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={handleChange('title')}
                required
                placeholder="What needs to be designed?"
                className={inputClass(errors.title)}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-[var(--danger)] text-xs mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="glass-input rounded-xl p-5">
          {section('Description', false,
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Describe what you need, constraints, and any specific requirements..."
              rows={3}
              className={`${inputClass()} resize-none`}
              disabled={isLoading}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-input rounded-xl p-4">
            {section('Priority', true,
              <select
                value={formData.priority}
                onChange={handleChange('priority')}
                className="bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0 w-full"
                disabled={isLoading}
              >
                <option value="High" className="bg-[var(--bg-vibrant-1)]">High</option>
                <option value="Medium" className="bg-[var(--bg-vibrant-1)]">Medium</option>
                <option value="Low" className="bg-[var(--bg-vibrant-1)]">Low</option>
              </select>
            )}
          </div>
          <div className="glass-input rounded-xl p-4">
            {section('Sub-Team', false,
              <select
                value={formData.subTeam || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, subTeam: e.target.value as SubTeam || null }))}
                className="bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0 w-full"
                disabled={isLoading}
              >
                <option value="" className="bg-[var(--bg-vibrant-1)]">Select team...</option>
                {SUBTEAMS.map(team => (
                  <option key={team} value={team} className="bg-[var(--bg-vibrant-1)]">{team}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="glass-input rounded-xl p-5">
          {section('Labels', false,
            <div className="flex flex-wrap gap-2">
              {LABELS.map(label => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleLabel(label)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: formData.labels.includes(label) ? LABEL_COLORS[label] : `${LABEL_COLORS[label]}20`,
                    color: formData.labels.includes(label) ? 'white' : LABEL_COLORS[label],
                    border: `1px solid ${formData.labels.includes(label) ? LABEL_COLORS[label] : 'transparent'}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-input rounded-xl p-4">
            {section('Build Phase', true,
              <select
                value={formData.buildPhase}
                onChange={handleChange('buildPhase')}
                className="bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0 w-full"
                disabled={isLoading}
              >
                {BUILD_PHASES.map(phase => (
                  <option key={phase} value={phase} className="bg-[var(--bg-vibrant-1)]">
                    {phase === 'Shape' ? 'Shape' :
                     phase === 'BuildCycle1' ? 'Build Cycle 1' :
                     phase === 'BuildCycle2' ? 'Build Cycle 2' :
                     phase === 'Cooldown' ? 'Cooldown' : 'Parking Lot'}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="glass-input rounded-xl p-4">
            {section('Task Status', false,
              <select
                value={formData.taskStatus}
                onChange={handleChange('taskStatus')}
                className="bg-transparent border-0 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-0 w-full"
                disabled={isLoading}
              >
                {TASK_STATUSES.map(status => (
                  <option key={status} value={status} className="bg-[var(--bg-vibrant-1)]">{status}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {(formData.subTeam === 'Mechanical' || formData.subTeam === 'CAD') && (
          <div className="glass-input rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-[#F97316]"></div>
              <span className="text-xs text-[var(--accent)] uppercase tracking-wider font-bold">Mechanical / CAD Fields</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold block mb-2">Manufacturing Status</label>
                <select
                  value={formData.manufacturingStatus || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, manufacturingStatus: (e.target.value || undefined) as ManufacturingStatus }))}
                  className={`${inputClass()} text-sm`}
                  disabled={isLoading}
                >
                  <option value="" className="bg-[var(--bg-vibrant-1)]">Not Started</option>
                  {MANUFACTURING_STATUSES.map(status => (
                    <option key={status} value={status} className="bg-[var(--bg-vibrant-1)]">{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold block mb-2">Machine / Tool</label>
                <input
                  type="text"
                  value={formData.machineRequired || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, machineRequired: e.target.value || undefined }))}
                  placeholder="Lathe, Mill, CNC..."
                  className={inputClass()}
                  disabled={isLoading}
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold block mb-2">Weight Estimate (lbs)</label>
                <input
                  type="number"
                  value={formData.weightEstimate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weightEstimate: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  placeholder="0.0"
                  step="0.1"
                  className={inputClass()}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {formData.subTeam === 'Electrical' && (
          <div className="glass-input rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-[#3B82F6]"></div>
              <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold">Electrical Fields</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold block mb-2">Wiring Status</label>
                <select
                  value={formData.wiringStatus || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, wiringStatus: (e.target.value || undefined) as WiringStatus }))}
                  className={`${inputClass()} text-sm`}
                  disabled={isLoading}
                >
                  <option value="" className="bg-[var(--bg-vibrant-1)]">Not Started</option>
                  {WIRING_STATUSES.map(status => (
                    <option key={status} value={status} className="bg-[var(--bg-vibrant-1)]">{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.componentReceived || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, componentReceived: e.target.checked }))}
                    className="w-4 h-4 rounded border-[var(--glass-border)] bg-transparent text-[var(--accent)] focus:ring-0"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-[var(--text-secondary)]">Parts Received</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {formData.subTeam === 'Programming' && (
          <div className="glass-input rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-[#8B5CF6]"></div>
              <span className="text-xs text-[var(--accent)] uppercase tracking-wider font-bold">Software Fields</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold block mb-2">Subsystem</label>
                <select
                  value={formData.softwareSubsystem || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, softwareSubsystem: (e.target.value || undefined) as SoftwareSubsystem }))}
                  className={`${inputClass()} text-sm`}
                  disabled={isLoading}
                >
                  <option value="" className="bg-[var(--bg-vibrant-1)]">Select...</option>
                  {SOFTWARE_SUBSYSTEMS.map(sub => (
                    <option key={sub} value={sub} className="bg-[var(--bg-vibrant-1)]">{sub}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.testedOnRobot || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, testedOnRobot: e.target.checked }))}
                    className="w-4 h-4 rounded border-[var(--glass-border)] bg-transparent text-[var(--accent)] focus:ring-0"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-[var(--text-secondary)]">Tested on Robot</span>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="glass-input rounded-xl p-5">
          {section('Blocked', false,
            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={formData.isBlocked || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, isBlocked: e.target.checked }))}
                  className="w-4 h-4 rounded border-[var(--glass-border)] bg-transparent text-[var(--danger)] focus:ring-0"
                  disabled={isLoading}
                />
                <span className="text-xs text-[var(--danger)] font-semibold">This task is currently blocked</span>
              </label>
              {formData.isBlocked && (
                <input
                  type="text"
                  value={formData.blockerReason || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, blockerReason: e.target.value || undefined }))}
                  placeholder="Describe the blocker..."
                  className={inputClass()}
                  disabled={isLoading}
                />
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-input rounded-xl p-5">
            {section('Dependency (Task ID)', false,
              <input
                type="text"
                value={formData.dependency || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, dependency: e.target.value || undefined }))}
                placeholder="ID of task this depends on..."
                className={inputClass()}
                disabled={isLoading}
              />
            )}
          </div>
          <div className="glass-input rounded-xl p-5">
            {section('Due Date', false,
              <input
                type="date"
                value={formData.dueDate}
                onChange={handleChange('dueDate')}
                className={`${inputClass()} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`}
                disabled={isLoading}
              />
            )}
          </div>
        </div>

        <div className="glass-input rounded-xl p-5">
          {section('Assignee', false,
            <input
              type="text"
              value={formData.assignee}
              onChange={handleChange('assignee')}
              placeholder="Who should work on this?"
              className={inputClass()}
              disabled={isLoading}
            />
          )}
        </div>

        <div className="glass-input rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {section('Attachment URL', false,
              <input
                type="url"
                value={formData.attachments}
                onChange={handleChange('attachments')}
                placeholder="Paste link to CAD file, PDF, or image..."
                className={inputClass()}
                disabled={isLoading}
              />
            )}
          </div>
        </div>

        <div className="glass-input rounded-xl p-5">
          {section('Initial Notes', false,
            <textarea
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Add any additional notes, specifications, or context..."
              rows={2}
              className={`${inputClass()} resize-none`}
              disabled={isLoading}
            />
          )}
        </div>
      </div>

      <div className="p-6 border-t border-[var(--glass-border)] bg-gradient-to-r from-[var(--surface-1)] to-[var(--surface-2)]">
        <div className="flex gap-4">
          <a
            href="/"
            className="flex-1 px-5 py-3 glass-button text-[var(--text-secondary)] rounded-xl hover:text-[var(--text-primary)] transition-all text-center font-medium"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={!formData.title.trim() || isLoading}
            className="flex-[2] flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--accent)] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-[var(--accent-glow)] cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Request...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Request</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}