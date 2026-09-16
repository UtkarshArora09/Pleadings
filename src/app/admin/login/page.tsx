'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the Admin Master Key');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Successful login
        router.push(returnUrl);
        router.refresh();
      } else {
        setError(data.error || 'Access Denied: Invalid Administrative Key.');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-[#12151E] border border-white/10 rounded-sm shadow-2xl p-8 relative overflow-hidden backdrop-blur-xl">
      {/* Top Gold Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#D4AF37] to-[#E50914]" />

      {/* Header / Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1 bg-[#E50914] text-white text-[10px] font-black uppercase tracking-[0.25em] px-2.5 py-0.5 rounded-xs mb-3 shadow-md">
          <span>PLEADINGS</span>
          <span className="font-sans font-normal opacity-80">SECURITY GATE</span>
        </div>

        <h1 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-wider mb-2">
          Editorial Studio Access
        </h1>
        <p className="text-xs text-[#a9a49a] leading-relaxed max-w-xs mx-auto">
          Restricted to authorized legal editors. Enter your Master Passkey to manage court cases.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-3 bg-red-950/60 border border-red-500/50 rounded-xs text-xs text-red-200 flex items-center gap-2 animate-fadeIn">
          <span className="text-red-400 font-bold text-sm">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#D4AF37] mb-2">
            Master Passkey / PIN
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Key..."
              autoFocus
              className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-[#F3EFE6] px-4 py-3 rounded-xs focus:outline-none transition-all placeholder:text-[#a9a49a]/40 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a9a49a] hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#D4AF37] hover:bg-[#bfa035] text-[#0A0C10] font-bold text-xs uppercase tracking-widest rounded-xs transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0A0C10] border-t-transparent rounded-full animate-spin" />
              <span>Verifying Authority...</span>
            </>
          ) : (
            <>
              <span>⚖</span>
              <span>Authenticate & Enter</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Security Notice */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center text-[10px] text-[#8c887e] font-mono space-y-2">
        <p className="flex items-center justify-center gap-1 text-[#a9a49a]/70">
          <span>🔒 Certified 256-bit Encrypted Session</span>
        </p>
        <div>
          <Link href="/" className="hover:text-[#D4AF37] transition-colors underline">
            ← Return to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4 relative select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(229,9,20,0.04),transparent_50%)] pointer-events-none" />

      <Suspense fallback={<div className="text-xs font-mono text-[#D4AF37]">Loading Authentication Gate...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
