'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

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
        setErrors({ general: data.error || 'Registration failed' });
      }
    } catch {
      setErrors({ general: 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="bg-[#171717] border border-[#2A2A2A] rounded-2xl p-8 shadow-xl animate-scaleIn">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#10B981]/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-float">
              <svg className="w-10 h-10 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-[#FAFAFA] mb-2">Create Account</h1>
            <p className="text-[#737373]">FRC Design Pipeline</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-4 py-3 bg-[#1F1F1F] border border-[#2A2A2A] rounded-xl text-sm text-[#FAFAFA] placeholder-[#737373] focus:outline-none focus:border-[#10B981] transition-colors"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-[#EF4444]">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 bg-[#1F1F1F] border border-[#2A2A2A] rounded-xl text-sm text-[#FAFAFA] placeholder-[#737373] focus:outline-none focus:border-[#10B981] transition-colors"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-[#EF4444]">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 8 characters)"
                className="w-full px-4 py-3 bg-[#1F1F1F] border border-[#2A2A2A] rounded-xl text-sm text-[#FAFAFA] placeholder-[#737373] focus:outline-none focus:border-[#10B981] transition-colors"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-[#EF4444]">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Invite Code"
                required
                className="w-full px-4 py-3 bg-[#1F1F1F] border border-[#2A2A2A] rounded-xl text-sm text-[#FAFAFA] placeholder-[#737373] focus:outline-none focus:border-[#10B981] transition-colors"
                disabled={isLoading}
              />
            </div>

            {errors.general && (
              <div className="px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl">
                <p className="text-[#EF4444] text-sm">{errors.general}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#10B981]/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[#737373]">
            Already have an account?{' '}
            <a href="/login" className="text-[#10B981] hover:text-[#059669] transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}