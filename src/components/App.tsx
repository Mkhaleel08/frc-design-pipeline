'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { StatsBar } from './StatsBar';
import { KanbanBoard } from './KanbanBoard';
import { ActivityLog } from './ActivityLog';
import { DetailModal } from './DetailModal';
import { FormModal, FormData } from './FormModal';
import { CalendarView } from './CalendarView';
import { WorkloadView } from './WorkloadView';
import { FRCTaskBoard } from './FRCTaskBoard';
import { DashboardView } from './DashboardView';
import { SprintBurndown } from './SprintBurndown';
import { useToast } from './Toast';
import { DesignRequest, SessionUser, STAGES, SUBTEAMS, SubTeam, LABELS, Label, PHASE_COLORS, BUILD_PHASES, BuildPhase, PHASE_CONFIG, SUBTEAM_COLORS } from './types';

type ViewType = 'dashboard' | 'board' | 'burndown' | 'timeline' | 'blockers' | 'calendar' | 'workload' | 'activity';

function RegisterForm({ onRegister, isLoading, error }: { onRegister: (name: string, email: string, password: string, inviteCode: string) => void; isLoading: boolean; error: string | null }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onRegister(name, email, password, inviteCode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
      <div className="glass-card rounded-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-2xl accent-glow">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.5 12c0-.23-.02-.45-.06-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23c-.25-.44-.79-.62-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-1-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41c-.04.23-.06.45-.06.68s.02.45.06.68l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88 1 .88h3.73c.51 0 .94-.38 1-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.04-.23.06-.45.06-.68z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-semibold mb-2 text-center text-[var(--text-primary)]">FRC Design Pipeline</h1>
        <p className="text-[var(--text-muted)] mb-6 text-center">Create your account to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3.5 glass-input rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-all"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-2 text-left text-xs text-[var(--danger)] flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-3.5 glass-input rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-all"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-2 text-left text-xs text-[var(--danger)] flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)"
              className="w-full px-4 py-3.5 glass-input rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-all"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-2 text-left text-xs text-[var(--danger)] flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Invite Code (optional)"
              className="w-full px-4 py-3.5 glass-input rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-all"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-[var(--danger-glow)] rounded-xl border border-[var(--danger)]/30">
              <p className="text-[var(--danger)] text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[var(--accent-glow)] accent-glow"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[var(--text-muted)]">
          Already have an account?{' '}
          <a href="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

function SkeletonStatsBar() {
  return (
    <div className="bg-[#171717] border-b border-[#2A2A2A] h-14 flex items-center px-6 gap-3">
      {['Submitted', 'Assigned', 'In Progress', 'Review', 'Fabrication', 'Complete'].map((stage) => (
        <div key={stage} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F1F1F] border border-[#2A2A2A] animate-pulse">
          <div className="w-2 h-2 rounded-full bg-[#404040]"></div>
          <span className="text-xs text-[#404040] font-medium w-12 h-4 bg-[#2A2A2A] rounded"></span>
        </div>
      ))}
    </div>
  );
}

function SkeletonFilters() {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-[#171717] border-b border-[#2A2A2A]">
      <div className="w-48 h-9 bg-[#1F1F1F] rounded-lg animate-pulse"></div>
      <div className="w-32 h-9 bg-[#1F1F1F] rounded-lg animate-pulse"></div>
      <div className="w-32 h-9 bg-[#1F1F1F] rounded-lg animate-pulse"></div>
    </div>
  );
}

function SkeletonKanbanBoard() {
  return (
    <div className="flex-1 flex gap-4 p-6 overflow-x-auto">
      {['Submitted', 'Assigned', 'In Progress', 'Review', 'Fabrication', 'Complete'].map((stage) => (
        <div key={stage} className="flex-shrink-0 w-80 flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 rounded-t-xl border-b-2 border-[#2A2A2A] bg-[#171717]">
            <div className="w-2 h-2 rounded-full bg-[#404040] animate-pulse"></div>
            <div className="h-3 w-20 bg-[#2A2A2A] rounded animate-pulse"></div>
            <div className="ml-auto h-5 w-8 bg-[#2A2A2A] rounded animate-pulse"></div>
          </div>
          <div className="flex-1 bg-[#171717] rounded-b-xl p-3 flex flex-col gap-3 min-h-[300px] border-x border-b border-[#2A2A2A]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A] animate-pulse">
                <div className="h-4 w-3/4 bg-[#2A2A2A] rounded mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-5 w-14 bg-[#2A2A2A] rounded"></div>
                  <div className="h-7 w-7 bg-[#2A2A2A] rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [view, setView] = useState<ViewType>('dashboard');
  const [subTeamFilter, setSubTeamFilter] = useState<SubTeam | 'All'>('All');
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [labelFilter, setLabelFilter] = useState('All');
  const [sprintFilter, setSprintFilter] = useState('All');
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [competitionDate, setCompetitionDate] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('frc-comp-date') || '';
    return '';
  });
  const { toast } = useToast();

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist competition date
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('frc-comp-date', competitionDate);
  }, [competitionDate]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setShowForm(true); }
      if (e.key === 'Escape') { setShowForm(false); setSelectedRequest(null); }
      if (e.key === '1') setView('dashboard');
      if (e.key === '2') setView('board');
      if (e.key === '3') setView('burndown');
      if (e.key === '4') setView('timeline');
      if (e.key === '/') { e.preventDefault(); document.querySelector<HTMLInputElement>('#search-input')?.focus(); }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          fetchRequests();
        }
      }
    } catch (e) {
      console.error('Auth check failed:', e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRequests() {
    setRequestsLoading(true);
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch (e) {
      console.error('Failed to fetch requests:', e);
    } finally {
      setRequestsLoading(false);
    }
  }

  async function handleRegister(name: string, email: string, password: string, inviteCode: string) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, inviteCode }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser({
          id: email,
          name: name,
          email: email,
          role: 'Designer',
        });
        fetchRequests();
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (e) {
      setError('Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setRequests([]);
    setSelectedRequest(null);
    setShowForm(false);
    setView('dashboard');
    setSubTeamFilter('All');
    setSearchQuery('');
    setPriorityFilter('All');
    setAssigneeFilter('All');
    setLabelFilter('All');
    setError(null);
  }

  async function handleCreateRequest(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setRequests(prev => [...prev, data.request]);
        setShowForm(false);
        toast('Request created successfully', 'success');
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to create request');
      }
    } catch (e) {
      setError('Failed to create request');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAdvanceStage(id: string) {
    const currentRequest = requests.find(r => r.id === id);
    if (!currentRequest || !user) return;

    const currentStageIndex = STAGES.indexOf(currentRequest.stage);
    const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;
    if (!nextStage) return;

    const tempId = 'temp-' + Date.now();
    const optimisticActivity = {
      id: tempId,
      type: 'stage_change' as const,
      message: `Moved to ${nextStage}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name
    };

    setRequests(prev => prev.map(r => r.id === id ? { ...r, stage: nextStage, activity: [...r.activity, optimisticActivity] } : r));
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, stage: nextStage, activity: [...prev.activity, optimisticActivity] } : null);
    }

    try {
      const res = await fetch(`/api/requests/${id}/advance`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? data.request : r));
        setSelectedRequest(prev => prev?.id === id ? data.request : prev);
      } else {
        throw new Error('Failed to advance');
      }
    } catch (e) {
      setRequests(prev => prev.map(r => r.id === id ? currentRequest : r));
      if (selectedRequest?.id === id) {
        setSelectedRequest(currentRequest);
      }
      console.error('Failed to advance stage:', e);
    }
  }

  async function handleAddNote(id: string, note: string) {
    const currentRequest = requests.find(r => r.id === id);
    if (!currentRequest || !user) return;

    const tempId = 'temp-' + Date.now();
    const optimisticNote = {
      id: tempId,
      type: 'note_added' as const,
      message: note,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name
    };

    setRequests(prev => prev.map(r => r.id === id ? { ...r, activity: [...r.activity, optimisticNote] } : r));
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, activity: [...prev.activity, optimisticNote] } : null);
    }

    try {
      const res = await fetch(`/api/requests/${id}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? data.request : r));
        setSelectedRequest(prev => prev?.id === id ? data.request : prev);
      } else {
        throw new Error('Failed to add note');
      }
    } catch (e) {
      setRequests(prev => prev.map(r => r.id === id ? currentRequest : r));
      if (selectedRequest?.id === id) {
        setSelectedRequest(currentRequest);
      }
      console.error('Failed to add note:', e);
    }
  }

  async function handleDeleteRequest(id: string) {
    try {
      const res = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
        setSelectedRequest(null);
        toast('Request deleted', 'info');
      }
    } catch (e) {
      console.error('Failed to delete request:', e);
    }
  }

  async function handleUpdateRequest(id: string, data: Partial<DesignRequest>) {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? updated.request : r));
        setSelectedRequest(updated.request);
      }
    } catch (e) {
      console.error('Failed to update request:', e);
    }
  }

  const handleDragUpdate = async (id: string, newStage: string) => {
    // Optimistic update
    const previousRequests = [...requests];
    setRequests(prev => prev.map(r => r.id === id ? { ...r, stage: newStage as any, taskStatus: newStage === 'Done' ? 'Done' : 'In Progress' } : r));

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage, taskStatus: newStage === 'Done' ? 'Done' : 'In Progress' }),
      });
      if (!res.ok) {
        throw new Error('Failed to update stage');
      }
      toast('Stage updated', 'success');
    } catch (e) {
      setRequests(previousRequests);
      toast('Failed to update stage', 'error');
    }
  };

  const handleBulkUpdate = async (updates: Partial<DesignRequest>) => {
    if (selectedRequestIds.length === 0) return;
    
    // Optimistic update
    const previousRequests = [...requests];
    setRequests(prev => prev.map(r => selectedRequestIds.includes(r.id) ? { ...r, ...updates } : r));

    try {
      const res = await fetch(`/api/requests/bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRequestIds, updates }),
      });
      if (!res.ok) {
        throw new Error('Failed to perform bulk update');
      }
      toast(`Updated ${selectedRequestIds.length} requests`, 'success');
      setSelectedRequestIds([]);
    } catch (e) {
      setRequests(previousRequests);
      toast('Bulk update failed', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRequestIds.length === 0 || !confirm(`Are you sure you want to delete ${selectedRequestIds.length} requests?`)) return;

    // We don't have a bulk delete endpoint yet, so we'll run sequentially for now.
    try {
      await Promise.all(selectedRequestIds.map(id => fetch(`/api/requests/${id}`, { method: 'DELETE' })));
      setRequests(prev => prev.filter(r => !selectedRequestIds.includes(r.id)));
      toast(`Deleted ${selectedRequestIds.length} requests`, 'info');
      setSelectedRequestIds([]);
    } catch (e) {
      toast('Failed to delete some requests', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-[var(--text-muted)] text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <RegisterForm onRegister={handleRegister} isLoading={isSubmitting} error={error} />
    );
  }

  const hasFilters = searchQuery || priorityFilter !== 'All' || assigneeFilter !== 'All' || labelFilter !== 'All' || sprintFilter !== 'All';

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'All' || r.assignee === assigneeFilter;
    const matchesLabel = labelFilter === 'All' || (r.labels && r.labels.includes(labelFilter as Label));
    const matchesSprint = sprintFilter === 'All' || r.buildPhase === sprintFilter;
    return matchesSearch && matchesPriority && matchesAssignee && matchesLabel && matchesSprint;
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-orb-container">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          user={user}
          view={view}
          onViewChange={setView}
          subTeam={subTeamFilter}
          onSubTeamChange={setSubTeamFilter}
          onNewRequest={() => setShowForm(true)}
          onLogout={handleLogout}
          requests={requests}
          isLoading={isSubmitting}
          theme={theme}
          onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          competitionDate={competitionDate}
          onCompetitionDateChange={setCompetitionDate}
        />
        <StatsBar requests={requests} />

        {view === 'board' && (
          <div className="flex items-center gap-3 px-6 py-3 glass border-y border-[var(--glass-border)]">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="search-input"
                type="text"
                placeholder="Search... (press /)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 glass-input rounded-lg text-sm focus:outline-none w-48 transition-all text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm focus:outline-none transition-all text-[var(--text-primary)]"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm focus:outline-none transition-all text-[var(--text-primary)]"
            >
              <option value="All">All Assignees</option>
              {[...new Set(requests.map(r => r.assignee).filter(Boolean))].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select
              value={subTeamFilter}
              onChange={(e) => setSubTeamFilter(e.target.value as SubTeam | 'All')}
              className="px-3 py-2 glass-input rounded-lg text-sm focus:outline-none transition-all text-[var(--text-primary)]"
            >
              <option value="All">All Teams</option>
              {SUBTEAMS.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            <select
              value={labelFilter}
              onChange={(e) => setLabelFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm focus:outline-none transition-all text-[var(--text-primary)]"
            >
              <option value="All">All Labels</option>
              {LABELS.map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
            <select
              value={sprintFilter}
              onChange={(e) => setSprintFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm focus:outline-none transition-all text-[var(--text-primary)]"
            >
              <option value="All">All Sprints</option>
              {BUILD_PHASES.map(phase => (
                <option key={phase} value={phase}>{PHASE_CONFIG[phase].name}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={() => { setSearchQuery(''); setPriorityFilter('All'); setAssigneeFilter('All'); setSubTeamFilter('All'); setLabelFilter('All'); setSprintFilter('All'); }}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 hover:bg-[var(--surface-3)] rounded-lg transition-all cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 px-4 py-3 bg-[var(--danger-glow)] border border-[var(--danger)]/30 rounded-xl text-[var(--danger)] text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {view === 'dashboard' ? (
          <DashboardView
            requests={requests}
            onRequestClick={setSelectedRequest}
            currentUserName={user.name}
            competitionDate={competitionDate || undefined}
          />
        ) : view === 'board' ? (
          <div className="flex-1 flex flex-col relative h-full">
            {requestsLoading ? (
              <SkeletonKanbanBoard />
            ) : subTeamFilter === 'All' ? (
              <KanbanBoard
                requests={filteredRequests}
                onCardClick={setSelectedRequest}
                onRequestUpdate={handleDragUpdate}
                selectedIds={selectedRequestIds}
                onToggleSelect={(id) => setSelectedRequestIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
              />
            ) : (
              <FRCTaskBoard
                requests={filteredRequests.filter(r => r.subTeam === subTeamFilter)}
                subTeam={subTeamFilter}
                onTaskClick={setSelectedRequest}
                onRequestUpdate={handleDragUpdate}
              />
            )}

            {/* Bulk Action Bar */}
            {selectedRequestIds.length > 0 && view === 'board' && subTeamFilter === 'All' && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-card rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-4 animate-slideUp z-40 border border-[var(--accent)]/30">
                <div className="flex items-center gap-2 pr-4 border-r border-[var(--glass-border)]">
                  <span className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                    {selectedRequestIds.length}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">Selected</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    className="px-3 py-1.5 glass-input rounded-lg text-sm text-[var(--text-primary)] focus:outline-none"
                    onChange={(e) => {
                      if (e.target.value) handleBulkUpdate({ buildPhase: e.target.value as BuildPhase });
                      e.target.value = '';
                    }}
                  >
                    <option value="">Move to Sprint...</option>
                    {BUILD_PHASES.map(p => <option key={p} value={p}>{PHASE_CONFIG[p].name}</option>)}
                  </select>

                  <select
                    className="px-3 py-1.5 glass-input rounded-lg text-sm text-[var(--text-primary)] focus:outline-none"
                    onChange={(e) => {
                      if (e.target.value) handleBulkUpdate({ priority: e.target.value as any });
                      e.target.value = '';
                    }}
                  >
                    <option value="">Set Priority...</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  <button
                    onClick={handleBulkDelete}
                    className="ml-2 p-2 text-[var(--danger)] hover:bg-[var(--danger-glow)] rounded-lg transition-colors cursor-pointer"
                    title="Delete Selected"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setSelectedRequestIds([])}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
                    title="Clear Selection"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : view === 'burndown' ? (
          <SprintBurndown requests={requests} />
        ) : view === 'timeline' ? (
          <div className="flex-1 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BUILD_PHASES.map(phase => {
                const phaseRequests = requests.filter(r => r.buildPhase === phase);
                return (
                  <div key={phase} className="glass rounded-xl p-4">
                    <div
                      className="flex items-center gap-2 mb-4 pb-3 border-b"
                      style={{ borderBottomColor: PHASE_COLORS[phase] }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PHASE_COLORS[phase] }}
                      />
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{PHASE_CONFIG[phase].name}</h3>
                      <span className="ml-auto text-xs text-[var(--text-muted)]">
                        Week {PHASE_CONFIG[phase].startWeek}
                      </span>
                    </div>
                    {phaseRequests.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-xs text-[var(--text-muted)]">No tasks yet</p>
                        <button
                          onClick={() => setShowForm(true)}
                          className="text-[10px] text-[var(--accent)] hover:underline mt-1 cursor-pointer"
                        >
                          + Add task
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-[var(--text-muted)]">
                          <span>Total: {phaseRequests.length}</span>
                          <span>Done: {phaseRequests.filter(r => r.taskStatus === 'Done').length}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${phaseRequests.length ? (phaseRequests.filter(r => r.taskStatus === 'Done').length / phaseRequests.length) * 100 : 0}%`,
                              backgroundColor: PHASE_COLORS[phase]
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        ) : view === 'blockers' ? (
          <div className="flex-1 p-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Blocked Tasks</h3>
              {requests.filter(r => r.isBlocked || r.taskStatus === 'Blocked').length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto mb-3 text-emerald-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-[var(--text-muted)]">No blocked tasks — great job! 🎉</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.filter(r => r.isBlocked || r.taskStatus === 'Blocked').map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedRequest(task)}
                      className="flex items-center justify-between p-3 bg-[var(--surface-2)] rounded-lg cursor-pointer hover:bg-[var(--surface-3)] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[var(--danger)]">⚠</span>
                        <span className="text-sm text-[var(--text-primary)]">{task.title}</span>
                        {task.subTeam && (
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${SUBTEAM_COLORS[task.subTeam]}20`, color: SUBTEAM_COLORS[task.subTeam] }}>
                            {task.subTeam}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{task.blockerReason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : view === 'calendar' ? (
          <CalendarView
            requests={filteredRequests}
            onRequestClick={setSelectedRequest}
          />
        ) : view === 'workload' ? (
          <WorkloadView
            requests={requests}
            onRequestClick={setSelectedRequest}
          />
        ) : (
          <ActivityLog requests={requests} />
        )}

        {selectedRequest && (
          <DetailModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onAdvance={handleAdvanceStage}
            onAddNote={handleAddNote}
            onDelete={handleDeleteRequest}
            onUpdate={handleUpdateRequest}
            currentUser={user}
            refreshRequests={fetchRequests}
          />
        )}

        {showForm && (
          <FormModal
            onSubmit={handleCreateRequest}
            onClose={() => setShowForm(false)}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}