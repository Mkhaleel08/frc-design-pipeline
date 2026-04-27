'use client';

import { SessionUser, DesignRequest, SubTeam, SUBTEAMS, SUBTEAM_COLORS } from './types';

interface HeaderProps {
  user: SessionUser | null;
  view: 'board' | 'calendar' | 'workload' | 'activity' | 'timeline' | 'blockers';
  onViewChange: (view: 'board' | 'calendar' | 'workload' | 'activity' | 'timeline' | 'blockers') => void;
  subTeam?: SubTeam | 'All';
  onSubTeamChange?: (subTeam: SubTeam | 'All') => void;
  onNewRequest: () => void;
  onLogout: () => void;
  requests: DesignRequest[];
  isLoading: boolean;
}

export function Header({ user, view, onViewChange, subTeam, onSubTeamChange, onNewRequest, onLogout, requests, isLoading }: HeaderProps) {
  return (
    <header className="sticky top-4 z-50 mx-4 md:mx-6 mb-6 rounded-2xl glass shadow-lg border border-[var(--glass-border)] transition-all">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg accent-glow">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.5 12c0-.23-.02-.45-.06-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23c-.25-.44-.79-.62-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-1-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41c-.04.23-.06.45-.06.68s.02.45.06.68l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88 1 .88h3.73c.51 0 .94-.38 1-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.04-.23.06-.45.06-.68z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)] font-tech uppercase">FRC</h1>
            <p className="text-[10px] text-[var(--accent)] -mt-0.5 tracking-widest font-semibold font-tech uppercase">Design Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1 py-1 glass rounded-xl">
          <button
            onClick={() => onViewChange('board')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              view === 'board'
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => onViewChange('timeline')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              view === 'timeline'
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => onViewChange('blockers')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              view === 'blockers'
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
            }`}
          >
            Blockers
          </button>
          <div className="w-px h-5 bg-[var(--glass-border)] mx-1"></div>
          <button
            onClick={() => onViewChange('calendar')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              view === 'calendar'
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => onViewChange('workload')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              view === 'workload'
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
            }`}
          >
            Workload
          </button>
          <button
            onClick={() => onViewChange('activity')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              view === 'activity'
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
            }`}
          >
            Activity
          </button>
        </div>

        {view === 'board' && onSubTeamChange && (
          <div className="flex items-center gap-2 px-6 py-2 glass border-b border-[var(--glass-border)]">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">Filter by Sub-Team:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSubTeamChange('All')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  subTeam === 'All'
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
                }`}
              >
                All
              </button>
              {SUBTEAMS.filter(t => t !== 'Strategy').map(team => (
                <button
                  key={team}
                  onClick={() => onSubTeamChange(team)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    subTeam === team
                      ? 'text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
                  }`}
                  style={subTeam !== team ? { backgroundColor: `${SUBTEAM_COLORS[team]}20`, color: SUBTEAM_COLORS[team] } : undefined}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={onNewRequest}
            disabled={!user || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg hover:shadow-[var(--accent-glow)] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </button>

          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-[var(--glass-border)]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl glass border border-[var(--glass-border)] flex items-center justify-center text-sm font-semibold text-[var(--accent)]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{user.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-lg w-fit font-medium ${
                      user.role === 'Lead' 
                        ? 'bg-[var(--purple-glow)] text-[var(--purple)]' 
                        : 'bg-[var(--surface-3)] text-[var(--text-muted)]'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2 hover:bg-[var(--surface-3)] rounded-lg cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}