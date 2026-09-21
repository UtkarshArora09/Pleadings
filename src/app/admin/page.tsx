'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { CaseData, CaseStatus } from '@/types';

export default function AdminDashboardPage() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const isFetchingRef = useRef<boolean>(false);

  const fetchCases = useCallback(async (isSilent = false) => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      if (!isSilent) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      // 1. Gather any custom / client cases from localStorage
      let localCases: CaseData[] = [];
      if (typeof window !== 'undefined') {
        try {
          const userListRaw = localStorage.getItem('pleadings_user_cases');
          if (userListRaw) {
            localCases = JSON.parse(userListRaw);
          }
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('pleadings_case_')) {
              const itemRaw = localStorage.getItem(key);
              if (itemRaw) {
                const item = JSON.parse(itemRaw);
                if (item && item.slug && !localCases.some((c) => c.slug === item.slug)) {
                  localCases.push(item);
                }
              }
            }
          }
        } catch {}
      }

      // 2. Fetch fresh server cases with cache-busting timestamp
      let serverCases: CaseData[] = [];
      try {
        const res = await fetch(`/api/admin/cases?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.cases)) {
            serverCases = data.cases;
          }
        }
      } catch (netErr) {
        console.warn('Network error fetching admin cases:', netErr);
      }

      // 3. Merge: Local drafts first, then authoritative server cases
      const map = new Map<string, CaseData>();
      localCases.forEach((c) => map.set(c.slug, c));
      serverCases.forEach((c) => {
        const local = map.get(c.slug);
        const serverViews = typeof c.views === 'number' ? c.views : 0;
        const localViews = local && typeof local.views === 'number' ? local.views : 0;
        map.set(c.slug, {
          ...(local || {}),
          ...c,
          views: Math.max(serverViews, localViews),
        });
      });

      const merged = Array.from(map.values());
      setCases(merged);
      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Failed to load admin cases:', err);
    } finally {
      isFetchingRef.current = false;
      if (!isSilent) setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and real-time listeners (BroadcastChannel, Cross-tab Storage, 3s Polling & Focus Refetch)
  useEffect(() => {
    fetchCases(false);

    // 1. BroadcastChannel real-time listener for instant 0ms cross-tab view updates
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('pleadings_case_events');
        bc.onmessage = (event) => {
          if (event.data?.type === 'CASE_VIEW' && event.data?.slug) {
            const viewedSlug = event.data.slug;
            const updatedViews = typeof event.data.views === 'number' ? event.data.views : null;
            setCases((prevCases) =>
              prevCases.map((c) => {
                if (c.slug === viewedSlug) {
                  return {
                    ...c,
                    views: updatedViews !== null ? Math.max(c.views || 0, updatedViews) : (c.views || 0) + 1,
                  };
                }
                return c;
              })
            );
            // Silent refresh to ensure complete state consistency
            fetchCases(true);
          }
        };
      } catch {}
    }

    // 2. Storage event for cross-tab view updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'pleadings_last_view_event' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.slug) {
            const viewedSlug = parsed.slug;
            const updatedViews = typeof parsed.views === 'number' ? parsed.views : null;
            setCases((prevCases) =>
              prevCases.map((c) => {
                if (c.slug === viewedSlug) {
                  return {
                    ...c,
                    views: updatedViews !== null ? Math.max(c.views || 0, updatedViews) : (c.views || 0) + 1,
                  };
                }
                return c;
              })
            );
            fetchCases(true);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Fast real-time polling (every 3 seconds)
    const pollInterval = setInterval(() => {
      fetchCases(true);
    }, 3000);

    // 4. Instant refetch when admin tab gains focus or visibility
    const handleFocus = () => {
      fetchCases(true);
    };
    window.addEventListener('focus', handleFocus);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchCases(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
      window.removeEventListener('storage', handleStorage);
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchCases]);

  const handleTogglePublish = async (slug: string, currentStatus?: CaseStatus) => {
    try {
      setActionLoading(slug);
      const isPublished = currentStatus === 'PUBLISHED';
      const res = await fetch(`/api/admin/cases/${slug}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: !isPublished }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCases(true);
      }
    } catch (err) {
      console.error('Error toggling publish:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCase = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      setActionLoading(slug);
      const res = await fetch(`/api/admin/cases/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCases(true);
      }
    } catch (err) {
      console.error('Error deleting case:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRank = async (slug: string, newRank: number) => {
    try {
      const res = await fetch(`/api/admin/cases/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rank: newRank }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCases(true);
      }
    } catch (err) {
      console.error('Error updating rank:', err);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (filter === 'PUBLISHED' && c.status !== 'PUBLISHED') return false;
    if (filter === 'REVIEW' && c.status !== 'ADMIN_REVIEW' && c.status !== 'CONTENT_GENERATED') return false;
    if (filter === 'TOP10' && (!c.rank || c.rank > 10)) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        c.title.en.toLowerCase().includes(q) ||
        c.court.toLowerCase().includes(q) ||
        c.categoryTag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const publishedCount = cases.filter((c) => c.status === 'PUBLISHED').length;
  const reviewCount = cases.filter((c) => c.status === 'ADMIN_REVIEW' || c.status === 'CONTENT_GENERATED').length;
  const top10Count = cases.filter((c) => c.rank && c.rank <= 10 && c.status === 'PUBLISHED').length;
  const totalViews = cases.reduce((acc, c) => acc + (typeof c.views === 'number' ? c.views : 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Legal Ingestion & Content System
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold tracking-wider uppercase ml-2">
              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isRefreshing ? 'animate-ping' : 'animate-pulse'}`} />
              <span>Real-Time Sync Active</span>
            </span>
          </div>
          <h1 className="font-anton text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Case Management Studio
          </h1>
          <p className="text-xs text-[#a9a49a] max-w-xl">
            Admin-controlled pipeline. Create cases, review AI-structured stories, manage Trending Top 10 rankings, and monitor live reads in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => fetchCases(false)}
            disabled={loading || isRefreshing}
            className="px-4 py-3 bg-[#121520] hover:bg-white/10 text-[#a9a49a] hover:text-white border border-white/15 text-xs font-mono font-bold uppercase tracking-wider transition-all rounded-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Force refresh all cases and view statistics"
          >
            <span className={isRefreshing || loading ? 'animate-spin inline-block' : ''}>↻</span>
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/new"
            className="px-6 py-3.5 bg-[#D4AF37] hover:bg-white text-[#0E1016] font-bold text-xs uppercase tracking-widest transition-all rounded-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Add New Case</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#121520] border border-white/10 p-5 rounded-xs">
          <span className="text-[10px] font-mono uppercase text-[#a9a49a] block mb-1">Total Cases in Store</span>
          <span className="font-anton text-3xl text-white">{cases.length}</span>
        </div>

        <div className="bg-[#121520] border border-[#D4AF37]/30 p-5 rounded-xs">
          <span className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1">Total Case Views</span>
          <span className="font-anton text-3xl text-[#D4AF37]">
            {totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}
          </span>
        </div>

        <div className="bg-[#121520] border border-emerald-500/30 p-5 rounded-xs">
          <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">Live on Website</span>
          <span className="font-anton text-3xl text-emerald-400">{publishedCount}</span>
        </div>

        <div className="bg-[#121520] border border-amber-500/30 p-5 rounded-xs">
          <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">Pending Admin Review</span>
          <span className="font-anton text-3xl text-amber-400">{reviewCount}</span>
        </div>

        <div className="bg-[#121520] border border-[#E50914]/40 p-5 rounded-xs">
          <span className="text-[10px] font-mono uppercase text-[#E50914] block mb-1">Trending Top 10 Active</span>
          <span className="font-anton text-3xl text-white">{top10Count} / 10</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'PUBLISHED', 'REVIEW', 'TOP10'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-[#D4AF37] text-[#0E1016] font-bold'
                  : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10'
              }`}
            >
              {tab === 'ALL' && `All (${cases.length})`}
              {tab === 'PUBLISHED' && `Live (${publishedCount})`}
              {tab === 'REVIEW' && `Needs Review (${reviewCount})`}
              {tab === 'TOP10' && `Top 10 Trending (${top10Count})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Filter by title, court, section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121520] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3.5 py-2 rounded-xs focus:outline-none placeholder:text-[#a9a49a]/60"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Case Table */}
      {loading ? (
        <div className="p-16 text-center text-xs font-mono text-[#a9a49a]">
          Loading cases from dynamic store...
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="p-16 text-center bg-[#121520] border border-white/10 rounded-xs">
          <p className="text-sm font-semibold text-white mb-2">No cases found matching criteria.</p>
          <p className="text-xs text-[#a9a49a] mb-4">Click "Add New Case" to ingest a new legal precedent.</p>
          <Link
            href="/admin/new"
            className="inline-block px-5 py-2.5 bg-[#D4AF37] text-[#0E1016] font-bold text-xs uppercase tracking-wider rounded-xs"
          >
            Add New Case
          </Link>
        </div>
      ) : (
        <div className="bg-[#121520] border border-white/10 rounded-xs overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-black/50 text-[10px] font-mono uppercase tracking-widest text-[#a9a49a] border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Top 10 Rank</th>
                  <th className="py-3.5 px-4">Case Title & Citation</th>
                  <th className="py-3.5 px-4">Court & Year</th>
                  <th className="py-3.5 px-4">Genre / Tag</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCases.map((caseItem) => {
                  const isPub = caseItem.status === 'PUBLISHED';
                  const isTop10 = caseItem.rank && caseItem.rank <= 10;
                  const viewsCount = typeof caseItem.views === 'number' ? caseItem.views : 0;

                  return (
                    <tr key={caseItem.slug} className="hover:bg-white/[0.02] transition-colors">
                      {/* Top 10 Rank Column */}
                      <td className="py-4 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <select
                            value={caseItem.rank || 10}
                            onChange={(e) => handleUpdateRank(caseItem.slug, parseInt(e.target.value))}
                            className="bg-black/60 border border-white/20 text-[#D4AF37] font-bold text-xs px-2 py-1 rounded-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                            title="Set ranking position for Trending Top 10 Shelf & Hero Bar"
                          >
                            {Array.from({ length: 10 }).map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                #{i + 1}
                              </option>
                            ))}
                            <option value={99}>Off Top 10</option>
                          </select>

                          {isTop10 && (
                            <span className="text-[9px] font-mono bg-[#E50914] text-white px-1.5 py-0.2 uppercase font-bold rounded-xs">
                              TRENDING
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Title & Citation */}
                      <td className="py-4 px-4">
                        <Link
                          href={`/admin/cases/${caseItem.slug}`}
                          className="font-bold text-white hover:text-[#D4AF37] text-sm block transition-colors line-clamp-1"
                        >
                          {caseItem.title.en}
                        </Link>
                        <span className="text-[11px] font-mono text-[#8c887e] block line-clamp-1">
                          {caseItem.citation}
                        </span>
                      </td>

                      {/* Court & Year */}
                      <td className="py-4 px-4 font-mono text-[#c4c0b6]">
                        <div>{caseItem.court}</div>
                        <span className="text-[10px] text-[#8c887e]">{caseItem.year}</span>
                      </td>

                      {/* Genre & Category Tag */}
                      <td className="py-4 px-4 font-mono">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-white/5 border border-white/10 text-[#D4AF37] rounded-xs font-bold">
                          {caseItem.categoryTag}
                        </span>
                        <span className="block text-[10px] text-[#8c887e] uppercase mt-1">
                          {caseItem.genre}
                        </span>
                      </td>

                      {/* Views Column */}
                      <td className="py-4 px-4 font-mono">
                        <div className="flex items-center gap-1.5 text-white">
                          <span className="text-[#D4AF37] text-xs">👁</span>
                          <span className="font-bold text-xs">
                            {viewsCount >= 1000 ? `${(viewsCount / 1000).toFixed(1)}k` : viewsCount}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8c887e] block">
                          {viewsCount.toLocaleString()} reads
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs inline-flex items-center gap-1 ${
                            isPub
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPub ? 'bg-emerald-400' : 'bg-[#D4AF37]'}`} />
                          <span>{caseItem.status || 'DRAFT'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/case/${caseItem.slug}`}
                            target="_blank"
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-mono uppercase rounded-xs transition-colors"
                            title="Preview public 2D Reel view"
                          >
                            Live Preview
                          </Link>

                          <Link
                            href={`/admin/cases/${caseItem.slug}`}
                            className="px-3 py-1 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-mono font-bold uppercase rounded-xs transition-colors"
                          >
                            Review & Edit
                          </Link>

                          <button
                            onClick={() => handleTogglePublish(caseItem.slug, caseItem.status)}
                            disabled={actionLoading === caseItem.slug}
                            className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer ${
                              isPub
                                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-[#0E1016]'
                            }`}
                          >
                            {isPub ? 'Unpublish' : 'Publish'}
                          </button>

                          <button
                            onClick={() => handleDeleteCase(caseItem.slug, caseItem.title.en)}
                            disabled={actionLoading === caseItem.slug}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xs transition-colors cursor-pointer text-xs"
                            title="Delete case"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
