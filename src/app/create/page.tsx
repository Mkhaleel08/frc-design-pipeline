'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePageGuide } from '@/components/CreatePageGuide';
import { CreatePageForm } from '@/components/CreatePageForm';
import { FormData } from '@/components/FormModal';

export default function CreatePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const stored = localStorage.getItem('frc_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(stored));
    setIsLoading(false);
  }, [router]);

  const handleSubmit = async (data: FormData) => {
    setSubmitState('loading');
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          createdBy: user?.name || 'Unknown',
          taskOwner: user?.name || 'Unknown',
          stage: 'Submitted',
        }),
      });
      if (!res.ok) throw new Error('Failed to create request');
      setSubmitState('success');
      setTimeout(() => router.push('/'), 1000);
    } catch {
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <a href="/" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Create Design Request</h1>
              <p className="text-sm text-[var(--text-muted)]">Submit a new task to the FRC design pipeline</p>
            </div>
          </div>
        </div>

        {submitState === 'success' && (
          <div className="mb-6 glass-card rounded-xl p-4 border border-[var(--accent)] flex items-center gap-3 animate-slideDown">
            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[var(--accent)] font-medium">Request created successfully! Redirecting to board...</span>
          </div>
        )}

        {submitState === 'error' && (
          <div className="mb-6 glass-card rounded-xl p-4 border border-[var(--danger)] flex items-center gap-3 animate-slideDown">
            <svg className="w-5 h-5 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-[var(--danger)] font-medium">Failed to create request. Please try again.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <CreatePageGuide />
          </div>
          <div className="lg:col-span-3">
            <CreatePageForm onSubmit={handleSubmit} isLoading={submitState === 'loading'} />
          </div>
        </div>
      </div>
    </div>
  );
}