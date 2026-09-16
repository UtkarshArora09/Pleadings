'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          if (!isLoginPage) {
            router.push(`/admin/login?returnUrl=${encodeURIComponent(pathname)}`);
          }
        }
      } catch {
        setIsAuthenticated(false);
        if (!isLoginPage) {
          router.push(`/admin/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    router.push('/admin/login');
  }

  // If on login page, render children directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If still checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0C10] flex flex-col items-center justify-center text-[#F3EFE6] select-none p-4">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-[#D4AF37] uppercase tracking-widest">
          Verifying Security Credentials...
        </p>
      </div>
    );
  }

  // If not authenticated (while redirect is in progress)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0C10] flex flex-col items-center justify-center text-[#F3EFE6] select-none p-4">
        <p className="font-mono text-xs text-red-400 uppercase tracking-widest">
          Access Restricted. Redirecting to Security Gate...
        </p>
      </div>
    );
  }

  // Authenticated Admin Shell
  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#F3EFE6] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#0E1016]">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0E1118]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/admin" className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors">
            <span className="bg-[#E50914] text-white text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-xs">
              PLEADINGS
            </span>
            <span className="font-anton text-lg tracking-wider text-white">CMS STUDIO</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-4 text-xs font-mono font-semibold uppercase tracking-wider text-[#a9a49a]">
            <Link
              href="/admin"
              className={`hover:text-[#D4AF37] transition-colors ${
                pathname === '/admin' ? 'text-[#D4AF37] font-bold' : ''
              }`}
            >
              Case Catalog
            </Link>
            <Link
              href="/admin/new"
              className={`hover:text-[#D4AF37] transition-colors flex items-center gap-1 ${
                pathname === '/admin/new' ? 'text-[#D4AF37] font-bold' : 'text-[#D4AF37]/80'
              }`}
            >
              <span>+</span>
              <span>Add New Case</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[#a9a49a] hover:text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1"
          >
            <span>Live Site</span>
            <span>↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            title="Log Out of Admin Studio"
          >
            <span>🔒</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
