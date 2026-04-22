'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { StatsBar } from './StatsBar';
import { KanbanBoard } from './KanbanBoard';
import { ActivityLog } from './ActivityLog';
import { DetailModal } from './DetailModal';
import { FormModal, FormData } from './FormModal';
import { DesignRequest, SessionUser } from './types';

function LoginForm({ onLogin, isLoading, error }: { onLogin: (email: string, password: string) => void; isLoading: boolean; error: string | null }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <div className="text-center w-full max-w-xs">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-[#22C55E]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            <path d="M12 8l3 4h-6l3-4z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-semibold mb-2">FRC Design Pipeline</h1>
        <p className="text-[#666] mb-6">Sign in to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-sm focus:outline-none focus:border-[#22C55E]"
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-sm focus:outline-none focus:border-[#22C55E]"
            disabled={isLoading}
          />
          
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
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
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch (e) {
      console.error('Failed to fetch requests:', e);
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
    try {
      const res = await fetch(`/api/requests/${id}/advance`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? data.request : r));
        setSelectedRequest(data.request);
      }
    } catch (e) {
      console.error('Failed to advance stage:', e);
    }
  }

  async function handleAddNote(id: string, note: string) {
    try {
      const res = await fetch(`/api/requests/${id}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? data.request : r));
        setSelectedRequest(data.request);
      }
    } catch (e) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#666]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginForm onLogin={handleLogin} isLoading={isSubmitting} error={error} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        user={user}
        view={view}
        onViewChange={setView}
        onNewRequest={() => setShowForm(true)}
        onLogout={handleLogout}
        isLoading={isSubmitting}
      />
      <StatsBar requests={requests} />

      {view === 'board' && (
        <div className="flex items-center gap-4 px-6 py-3 bg-[#1A1A1A] border-b border-[#333]">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-[#242424] border border-[#333] rounded-lg text-sm focus:outline-none focus:border-[#22C55E] w-48"
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#242424] border border-[#333] rounded-lg text-sm focus:outline-none focus:border-[#22C55E]"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#242424] border border-[#333] rounded-lg text-sm focus:outline-none focus:border-[#22C55E]"
          >
            <option value="All">All Assignees</option>
            {[...new Set(requests.map(r => r.assignee).filter(Boolean))].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          {(searchQuery || priorityFilter !== 'All' || assigneeFilter !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); setPriorityFilter('All'); setAssigneeFilter('All'); }}
              className="text-xs text-[#666] hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {view === 'board' ? (
        <KanbanBoard
          requests={requests}
          onCardClick={setSelectedRequest}
          searchQuery={searchQuery}
          priorityFilter={priorityFilter}
          assigneeFilter={assigneeFilter}
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