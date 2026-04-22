'use client';

import { SessionUser } from './types';

interface HeaderProps {
  user: SessionUser | null;
  view: 'board' | 'activity';
  onViewChange: (view: 'board' | 'activity') => void;
  onNewRequest: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

export function Header({ user, view, onViewChange, onNewRequest, onLogout, isLoading }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-[#2A2A2A] h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10B981]/20">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.5 12c0-.23-.02-.45-.06-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23c-.25-.44-.79-.62-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-1-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41c-.04.23-.06.45-.06.68s.02.45.06.68l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88 1 .88h3.73c.51 0 .94-.38 1-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.04-.23.06-.45.06-.68z"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight text-white">FRC Design</h1>
          <p className="text-[10px] text-[#555] -mt-0.5 tracking-[0.2em] font-medium">PIPELINE</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-[#1F1F1F] rounded-xl p-1 border border-[#2A2A2A]">
          <button
            onClick={() => onViewChange('board')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === 'board'
                ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20'
                : 'text-[#737373] hover:text-white hover:bg-[#262626]'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => onViewChange('activity')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === 'activity'
                ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20'
                : 'text-[#737373] hover:text-white hover:bg-[#262626]'
            }`}
          >
            Activity
          </button>
        </div>

        <button
          onClick={onNewRequest}
          disabled={!user || isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#10B981]/25"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </button>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-xs font-semibold text-white shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#FAFAFA]">{user.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium w-fit ${
                    user.role === 'Lead' 
                      ? 'bg-[#8B5CF6]/20 text-[#A78BFA]' 
                      : 'bg-[#262626] text-[#A1A1A1]'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-[#555] hover:text-[#A1A1A1] transition-colors p-2 hover:bg-[#262626] rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}