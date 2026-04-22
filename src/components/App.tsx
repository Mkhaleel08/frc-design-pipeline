'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { StatsBar } from './StatsBar';
import { KanbanBoard } from './KanbanBoard';
import { ActivityLog } from './ActivityLog';
import { DetailModal } from './DetailModal';
import { FormModal, FormData } from './FormModal';
import { DesignRequest, SessionUser, STAGES } from './types';

function LoginForm({ onLogin, isLoading, error }: { onLogin: (email: string, password: string) => void; isLoading: boolean; error: string | null }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C]">
      <div className="text-center w-full max-w-sm px-6">
        <div className="mb-10 animate-float">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-2xl shadow-[#10B981]/30">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.5 12c0-.23-.02-.45-.06-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23c-.25-.44-.79-.62-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-1-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41c-.04.23-.06.45-.06.68s.02.45.06.68l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88 1 .88h3.73c.51 0 .94-.38 1-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.04-.23.06-.45.06-.68z"/>
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-semibold mb-2 text-white">FRC Design Pipeline</h1>
        <p className="text-[#737373] mb-8">Sign in to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 bg-[#171717] border border-[#2A2A2A] rounded-xl text-sm focus:outline-none focus:border-[#10B981] focus:bg-[#1F1F1F] transition-all"
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 bg-[#171717] border border-[#2A2A2A] rounded-xl text-sm focus:outline-none focus:border-[#10B981] focus:bg-[#1F1F1F] transition-all"
            disabled={isLoading}
          />
          
          {error && (
            <div className="p-3 bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/20">
              <p className="text-[#EF4444] text-sm">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 text-white font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#10B981]/20"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
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
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [view, setView] = useState<'board' | 'activity'>('board');
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');

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

  async function handleLogin(email: string, password: string) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser({
          id: email,
          name: email.split('@')[0],
          email: email,
          role: 'Designer',
        });
        fetchRequests();
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (e) {
      setError('Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setRequests([]);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-[#737373] text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginForm onLogin={handleLogin} isLoading={isSubmitting} error={error} />
    );
  }

  const hasFilters = searchQuery || priorityFilter !== 'All' || assigneeFilter !== 'All';

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'All' || r.assignee === assigneeFilter;
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        user={user}
        view={view}
        onViewChange={setView}
        onNewRequest={() => setShowForm(true)}
        onLogout={handleLogout}
        requests={requests}
        isLoading={isSubmitting}
      />
      <StatsBar requests={requests} />

      {view === 'board' && (
        <div className="flex items-center gap-3 px-6 py-3 bg-[#171717] border-b border-[#2A2A2A]">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg text-sm focus:outline-none focus:border-[#10B981] w-48 transition-all"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg text-sm focus:outline-none focus:border-[#10B981] transition-all"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg text-sm focus:outline-none focus:border-[#10B981] transition-all"
          >
            <option value="All">All Assignees</option>
            {[...new Set(requests.map(r => r.assignee).filter(Boolean))].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearchQuery(''); setPriorityFilter('All'); setAssigneeFilter('All'); }}
              className="text-xs text-[#737373] hover:text-white px-2 py-1 hover:bg-[#262626] rounded-lg transition-all"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-[#EF4444] text-sm animate-slideDown">
          {error}
        </div>
      )}

      {view === 'board' ? (
        requestsLoading ? (
          <SkeletonKanbanBoard />
        ) : (
          <KanbanBoard
            requests={filteredRequests}
            onCardClick={setSelectedRequest}
          />
        )
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
  );
}