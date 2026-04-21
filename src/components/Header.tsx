'use client';

import { SlackUser } from './types';

interface HeaderProps {
  user: SlackUser | null;
  view: 'board' | 'activity';
  onViewChange: (view: 'board' | 'activity') => void;
  onNewRequest: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

export function Header({ user, view, onViewChange, onNewRequest, onLogout, isLoading }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#333] h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6 text-[#22C55E]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          <path d="M12 8l3 4h-6l3-4z"/>
        </svg>
        <h1 className="text-xl font-semibold tracking-tight">FRC Design Pipeline</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-[#1A1A1A] rounded-lg p-1">
          <button
            onClick={() => onViewChange('board')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === 'board'
                ? 'bg-[#242424] text-white'
                : 'text-[#666] hover:text-white'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => onViewChange('activity')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === 'activity'
                ? 'bg-[#242424] text-white'
                : 'text-[#666] hover:text-white'
            }`}
          >
            Activity Log
          </button>
        </div>

        <button
          onClick={onNewRequest}
          disabled={!user || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </button>

        {user && (
          <div className="flex items-center gap-2">
            {user.image_72 ? (
              <img src={user.image_72} alt={user.real_name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-sm">
                {user.real_name.charAt(0)}
              </div>
            )}
            <button
              onClick={onLogout}
              className="text-xs text-[#666] hover:text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}