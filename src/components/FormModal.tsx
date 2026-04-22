'use client';

import { useState } from 'react';

interface FormModalProps {
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export interface FormData {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  attachments: string;
  notes: string;
  dueDate?: string;
}

export function FormModal({ onSubmit, onClose, isLoading }: FormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: '',
    attachments: '',
    notes: '',
    dueDate: '',
  });

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || isLoading) return;
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#1A1A1A] rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <h2 className="text-lg font-semibold">New Design Request</h2>
          <button onClick={onClose} className="text-[#666] hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleChange('title')}
              required
              placeholder="Design request title"
              className="w-full mt-1 bg-[#242424] border border-[#333] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22C55E]"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Description</label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Describe the design request..."
              rows={3}
              className="w-full mt-1 bg-[#242424] border border-[#333] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22C55E] resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#666] uppercase tracking-wider">Priority</label>
              <select
                value={formData.priority}
                onChange={handleChange('priority')}
                className="w-full mt-1 bg-[#242424] border border-[#333] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22C55E]"
                disabled={isLoading}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#666] uppercase tracking-wider">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={handleChange('dueDate')}
                className="w-full mt-1 bg-[#242424] border border-[#333] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22C55E]"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Assignee</label>
            <input
              type="text"
              value={formData.assignee}
              onChange={handleChange('assignee')}
              placeholder="Assignee name"
              className="w-full mt-1 bg-[#242424] border border-[#333] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22C55E]"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">File/Link Attachments</label>
            <textarea
              value={formData.attachments}
              onChange={handleChange('attachments')}
              placeholder="Paste file URLs or links (one per line)..."
              rows={3}
              className="w-full mt-1 bg-[#242424] border border-[#333] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22C55E] resize-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-xs text-[#666] uppercase tracking-wider">Initial Notes</label>
            <textarea
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Add any initial notes..."
              rows={2}
              className="w-full mt-1 bg-[#242424] border border-[#333] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22C55E] resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-[#333] text-[#A0A0A0] rounded-lg hover:text-white hover:border-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || isLoading}
              className="flex-1 px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-white font-medium rounded-lg"
            >
              {isLoading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}