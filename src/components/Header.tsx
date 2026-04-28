'use client';

import { useState } from 'react';
import { SessionUser, DesignRequest, SubTeam, SUBTEAMS, SUBTEAM_COLORS } from './types';

type ViewType = 'dashboard' | 'board' | 'burndown' | 'timeline' | 'blockers' | 'calendar' | 'workload' | 'activity';

interface HeaderProps {
  user: SessionUser | null;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  subTeam?: SubTeam | 'All';
  onSubTeamChange?: (subTeam: SubTeam | 'All') => void;
  onNewRequest: () => void;
  onLogout: () => void;
  requests: DesignRequest[];
  isLoading: boolean;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  competitionDate: string;
  onCompetitionDateChange: (date: string) => void;
}

export function Header({
  user, view, onViewChange, subTeam, onSubTeamChange,
  onNewRequest, onLogout, requests, isLoading,
  theme, onThemeToggle, competitionDate, onCompetitionDateChange,
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const daysUntilComp = competitionDate
    ? Math.max(0, Math.ceil((new Date(competitionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const views: { key: ViewType; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'board', label: 'Board' },
    { key: 'burndown', label: 'Burndown' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'blockers', label: 'Blockers' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'workload', label: 'Workload' },
    { key: 'activity', label: 'Activity' },
  ];

  return (
    <header className="sticky top-4 z-50 mx-4 md:mx-6 mb-6 rounded-2xl glass shadow-lg border border-[var(--glass-border)] transition-all">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
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
          {/* Competition countdown badge */}
          {daysUntilComp !== null && (
            <div className="hidden md:flex items-center gap-1.5 ml-2 px-3 py-1 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent)]/20">
              <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-semibold text-[var(--accent)] tabular-nums">{daysUntilComp}d</span>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 px-1 py-1 glass rounded-xl">
          {views.map(v => (
            <button
              key={v.key}
              onClick={() => onViewChange(v.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                view === v.key
                  ? 'bg-[var(--accent)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] rounded-lg cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] rounded-lg transition-all cursor-pointer"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] rounded-lg transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-72 glass-card rounded-xl p-4 shadow-2xl z-50 animate-scaleIn">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">Competition Date</label>
                    <input
                      type="date"
                      value={competitionDate}
                      onChange={(e) => onCompetitionDateChange(e.target.value)}
                      className="w-full px-3 py-2 glass-input rounded-lg text-sm text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onNewRequest}
            disabled={!user || isLoading}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg hover:shadow-[var(--accent-glow)] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </button>

          {/* Mobile new button */}
          <button
            onClick={onNewRequest}
            disabled={!user || isLoading}
            className="md:hidden p-2 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {user && (
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-[var(--glass-border)]">
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

      {/* Mobile nav menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4 pt-2 border-t border-[var(--glass-border)] animate-slideDown">
          <div className="grid grid-cols-4 gap-2">
            {views.map(v => (
              <button
                key={v.key}
                onClick={() => { onViewChange(v.key); setMobileMenuOpen(false); }}
                className={`px-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  view === v.key
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-3)]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          {user && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--glass-border)]">
              <span className="text-sm text-[var(--text-secondary)]">{user.name}</span>
              <button onClick={onLogout} className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer">Logout</button>
            </div>
          )}
        </div>
      )}

      {/* Sub-team filter bar */}
      {view === 'board' && onSubTeamChange && (
        <div className="flex items-center gap-2 px-6 py-2 border-t border-[var(--glass-border)] overflow-x-auto scroll-hide">
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium shrink-0">Team:</span>
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
    </header>
  );
}