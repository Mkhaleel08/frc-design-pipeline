'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { StatsBar } from './StatsBar';
import { KanbanBoard } from './KanbanBoard';
import { ActivityLog } from './ActivityLog';
import { DetailModal } from './DetailModal';
import { FormModal, FormData } from './FormModal';
import { DesignRequest, SlackUser } from './types';

export function App() {
  const [user, setUser] = useState<SlackUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'board' | 'activity'>('board');
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleLogin() {
    window.location.href = '/api/auth/login';
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
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-[#22C55E]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              <path d="M12 8l3 4h-6l3-4z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-2">FRC Design Pipeline</h1>
          <p className="text-[#666] mb-6">Sign in with Slack to continue</p>
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-6 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-medium rounded-lg mx-auto transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
            </svg>
            Sign in with Slack
          </button>
        </div>
      </div>
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

      {error && (
        <div className="mx-6 mt-4 px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {view === 'board' ? (
        <KanbanBoard
          requests={requests}
          onCardClick={setSelectedRequest}
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