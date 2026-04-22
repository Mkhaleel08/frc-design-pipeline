'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, inviteCode }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (e) {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <div className="w-full max-w-xs">
        <div className="text-center mb-6">
          <svg className="w-16 h-16 mx-auto text-[#22C55E]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            <path d="M12 8l3 4h-6l3-4z"/>
          </svg>
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-2">Create Account</h1>
        <p className="text-[#666] text-center mb-6">FRC Design Pipeline</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-sm focus:outline-none focus:border-[#22C55E]"
            disabled={isLoading}
          />
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
            minLength={6}
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-sm focus:outline-none focus:border-[#22C55E]"
            disabled={isLoading}
          />
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Invite Code"
            required
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-sm focus:outline-none focus:border-[#22C55E]"
            disabled={isLoading}
          />
          
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-[#666]">
          Already have an account?{' '}
          <a href="/login" className="text-[#22C55E] hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}