'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CaseData, StoryPanel } from '@/types';

interface ReviewStudioProps {
  params: Promise<{ slug: string }>;
}

export default function ReviewStudioPage({ params }: ReviewStudioProps) {
  const { slug } = use(params);
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'panels' | 'brief' | 'images'>('overview');
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    async function loadCase() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/cases/${slug}`);
        const data = await res.json();
        if (data.success && data.case) {
          setCaseData(data.case);
        }
      } catch (err) {
        console.error('Failed to load case for review:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCase();
  }, [slug]);

  const handleSave = async (updatedCaseData = caseData) => {
    if (!updatedCaseData) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/cases/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCaseData),
      });
      const data = await res.json();
      if (data.success) {
        setCaseData(data.case);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Error saving case:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!caseData) return;
    try {
      setSaving(true);
      const isCurrentlyPublished = caseData.status === 'PUBLISHED';
      const res = await fetch(`/api/admin/cases/${slug}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: !isCurrentlyPublished }),
      });
      const data = await res.json();
      if (data.success) {
        setCaseData(data.case);
      }
    } catch (err) {
      console.error('Error toggling publish:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="p-16 text-center text-xs font-mono text-[#a9a49a]">
        Loading Case Review Studio...
      </div>
    );
  }

  const isPublished = caseData.status === 'PUBLISHED';

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-[#121520] border border-white/10 rounded-xs shadow-2xl">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <Link href="/admin" className="text-xs font-mono text-[#D4AF37] hover:underline">
              ← Catalog
            </Link>
            <span className="text-white/20">|</span>
            <span
              className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs inline-flex items-center gap-1 ${
                isPublished
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-[#D4AF37]'}`} />
              <span>{caseData.status || 'ADMIN_REVIEW'}</span>
            </span>
          </div>

          <h1 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight line-clamp-1">
            {caseData.title[activeLanguage] || caseData.title.en}
          </h1>
          <p className="text-xs text-[#8c887e] font-mono">
            {caseData.court} · {caseData.year} · {caseData.citation}
          </p>
        </div>

        {/* Action Controls & Top 10 Rank */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Trending Rank Selector */}
          <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 px-2.5 py-1.5 rounded-xs">
            <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold">Trending Rank:</span>
            <select
              value={caseData.rank || 10}
              onChange={(e) => {
                const updated = { ...caseData, rank: parseInt(e.target.value) };
                setCaseData(updated);
                handleSave(updated);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i + 1} value={i + 1} className="bg-[#121520] text-white">
                  #{i + 1} Trending
                </option>
              ))}
              <option value={99} className="bg-[#121520] text-white">
                Off Top 10
              </option>
            </select>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-0.5 rounded-xs">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-xs transition-all ${
                activeLanguage === 'en' ? 'bg-[#D4AF37] text-[#0E1016]' : 'text-[#a9a49a] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setActiveLanguage('hi')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-xs transition-all ${
                activeLanguage === 'hi' ? 'bg-[#D4AF37] text-[#0E1016]' : 'text-[#a9a49a] hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Live Preview Button */}
          <Link
            href={`/case/${caseData.slug}`}
            target="_blank"
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all border border-white/10 flex items-center gap-1"
          >
            <span>Live Reel</span>
            <span>↗</span>
          </Link>

          {/* Save Button */}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-4 py-2 bg-white hover:bg-white/90 text-[#0E1016] font-bold text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer shadow-md"
          >
            {saving ? 'Saving...' : saveSuccess ? '✓ Saved!' : 'Save Changes'}
          </button>

          {/* Publish Toggle Button */}
          <button
            onClick={handleTogglePublish}
            disabled={saving}
            className={`px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer shadow-lg ${
              isPublished
                ? 'bg-amber-500 hover:bg-amber-400 text-[#0E1016]'
                : 'bg-emerald-500 hover:bg-emerald-400 text-[#0E1016]'
            }`}
          >
            {isPublished ? 'Unpublish Case' : '🚀 Publish Case Live'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: '1. Overview & Billboard' },
          { id: 'panels', label: `2. Story Episodes (${caseData.panels.length})` },
          { id: 'brief', label: '3. Legal Brief & Certified Ratio' },
          { id: 'images', label: '4. AI Visuals & Prompts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow-md'
                : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METADATA */}
      {activeTab === 'overview' && (
        <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Title ({activeLanguage.toUpperCase()})
              </label>
              <input
                type="text"
                value={caseData.title[activeLanguage] || ''}
                onChange={(e) =>
                  setCaseData({
                    ...caseData,
                    title: { ...caseData.title, [activeLanguage]: e.target.value },
                  })
                }
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-2.5 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Category Tag / Statute
              </label>
              <input
                type="text"
                value={caseData.categoryTag || ''}
                onChange={(e) => setCaseData({ ...caseData, categoryTag: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-[#D4AF37] font-bold p-2.5 rounded-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">Court</label>
              <input
                type="text"
                value={caseData.court}
                onChange={(e) => setCaseData({ ...caseData, court: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-2.5 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">Year</label>
              <input
                type="number"
                value={caseData.year}
                onChange={(e) => setCaseData({ ...caseData, year: parseInt(e.target.value) || 2020 })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-2.5 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">Legal Genre</label>
              <select
                value={caseData.genre}
                onChange={(e) => setCaseData({ ...caseData, genre: e.target.value as any })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-[#D4AF37] font-bold p-2.5 rounded-xs"
              >
                <option value="constitutional">Constitutional</option>
                <option value="crime">Criminal / Crime Noir</option>
                <option value="cyber">Cyber Law</option>
                <option value="consumer">Consumer Protection</option>
                <option value="tort">Corporate & Tort</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
              Catalog Blurb ({activeLanguage.toUpperCase()})
            </label>
            <textarea
              rows={3}
              value={caseData.blurb[activeLanguage] || ''}
              onChange={(e) =>
                setCaseData({
                  ...caseData,
                  blurb: { ...caseData.blurb, [activeLanguage]: e.target.value },
                })
              }
              className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-3 rounded-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Official Law Citation
              </label>
              <input
                type="text"
                value={caseData.citation}
                onChange={(e) => setCaseData({ ...caseData, citation: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-2.5 rounded-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Certified Judgment URL
              </label>
              <input
                type="url"
                value={caseData.judgmentUrl}
                onChange={(e) => setCaseData({ ...caseData, judgmentUrl: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-2.5 rounded-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STORY PANELS */}
      {activeTab === 'panels' && (
        <div className="space-y-6">
          {caseData.panels.map((panel, idx) => (
            <div key={panel.id} className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#D4AF37]">
                    Panel #{idx + 1} ({panel.type})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8c887e]">ID: {panel.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                    Eyebrow / Episode Tag ({activeLanguage.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={panel.eyebrow[activeLanguage] || ''}
                    onChange={(e) => {
                      const updatedPanels = [...caseData.panels];
                      updatedPanels[idx].eyebrow[activeLanguage] = e.target.value;
                      setCaseData({ ...caseData, panels: updatedPanels });
                    }}
                    className="w-full bg-[#0A0C10] border border-white/15 text-xs text-[#D4AF37] font-bold p-2.5 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                    Headline ({activeLanguage.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={panel.headline[activeLanguage] || ''}
                    onChange={(e) => {
                      const updatedPanels = [...caseData.panels];
                      updatedPanels[idx].headline[activeLanguage] = e.target.value;
                      setCaseData({ ...caseData, panels: updatedPanels });
                    }}
                    className="w-full bg-[#0A0C10] border border-white/15 text-sm text-white font-bold p-2.5 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                  Story Content ({activeLanguage.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  value={panel.body[activeLanguage] || ''}
                  onChange={(e) => {
                    const updatedPanels = [...caseData.panels];
                    updatedPanels[idx].body[activeLanguage] = e.target.value;
                    setCaseData({ ...caseData, panels: updatedPanels });
                  }}
                  className="w-full bg-[#0A0C10] border border-white/15 text-xs text-[#c9c5bc] p-3 rounded-xs leading-relaxed"
                />
              </div>

              {/* Arguments if present */}
              {panel.prosecutionArgs && (
                <div className="p-4 bg-black/40 border border-white/10 rounded-xs space-y-3">
                  <span className="text-[10px] font-mono font-bold text-[#E50914] uppercase block">
                    Prosecution / Appellant Claim:
                  </span>
                  <input
                    type="text"
                    value={panel.prosecutionArgs.claim[activeLanguage] || ''}
                    onChange={(e) => {
                      const updatedPanels = [...caseData.panels];
                      if (updatedPanels[idx].prosecutionArgs) {
                        updatedPanels[idx].prosecutionArgs!.claim[activeLanguage] = e.target.value;
                        setCaseData({ ...caseData, panels: updatedPanels });
                      }
                    }}
                    className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2 rounded-xs"
                  />
                </div>
              )}

              {/* Judge Decision if present */}
              {panel.judgeDecision && (
                <div className="p-4 bg-black/40 border border-[#D4AF37]/30 rounded-xs space-y-3">
                  <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase block">
                    Judge Decision Question:
                  </span>
                  <input
                    type="text"
                    value={panel.judgeDecision.question[activeLanguage] || ''}
                    onChange={(e) => {
                      const updatedPanels = [...caseData.panels];
                      if (updatedPanels[idx].judgeDecision) {
                        updatedPanels[idx].judgeDecision!.question[activeLanguage] = e.target.value;
                        setCaseData({ ...caseData, panels: updatedPanels });
                      }
                    }}
                    className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2 rounded-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LEGAL BRIEF */}
      {activeTab === 'brief' && (
        <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-6">
          <div>
            <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
              Statement of Facts ({activeLanguage.toUpperCase()})
            </label>
            <textarea
              rows={5}
              value={caseData.brief.facts[activeLanguage] || ''}
              onChange={(e) =>
                setCaseData({
                  ...caseData,
                  brief: {
                    ...caseData.brief,
                    facts: { ...caseData.brief.facts, [activeLanguage]: e.target.value },
                  },
                })
              }
              className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-3 rounded-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
              Court Holding ({activeLanguage.toUpperCase()})
            </label>
            <textarea
              rows={3}
              value={caseData.brief.held[activeLanguage] || ''}
              onChange={(e) =>
                setCaseData({
                  ...caseData,
                  brief: {
                    ...caseData.brief,
                    held: { ...caseData.brief.held, [activeLanguage]: e.target.value },
                  },
                })
              }
              className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-3 rounded-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
              Ratio Decidendi ({activeLanguage.toUpperCase()})
            </label>
            <textarea
              rows={4}
              value={caseData.brief.reasoning[activeLanguage] || ''}
              onChange={(e) =>
                setCaseData({
                  ...caseData,
                  brief: {
                    ...caseData.brief,
                    reasoning: { ...caseData.brief.reasoning, [activeLanguage]: e.target.value },
                  },
                })
              }
              className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-3 rounded-xs leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* TAB 4: VISUAL ASSETS & AI PROMPTS */}
      {activeTab === 'images' && (
        <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-6">
          <div className="pb-3 border-b border-white/10">
            <h3 className="text-sm font-anton text-white uppercase tracking-wider">
              Visual Asset Management
            </h3>
            <p className="text-xs text-[#a9a49a]">
              Review generated prompts, upload custom photographs/documents, or replace image paths.
            </p>
          </div>

          {/* Banner Image */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-xs space-y-3">
            <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase block">
              1. 16:9 Hero Billboard & Card Cover Image
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                  Image URL / File Path
                </label>
                <input
                  type="text"
                  value={caseData.bannerImage}
                  onChange={(e) => setCaseData({ ...caseData, bannerImage: e.target.value })}
                  className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2.5 rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                  AI Generation Prompt
                </label>
                <textarea
                  rows={2}
                  value={caseData.imagesList?.[0]?.prompt || ''}
                  onChange={(e) => {
                    const list = [...(caseData.imagesList || [])];
                    if (list[0]) list[0].prompt = e.target.value;
                    setCaseData({ ...caseData, imagesList: list });
                  }}
                  className="w-full bg-[#0A0C10] border border-white/15 text-xs text-[#c9c5bc] p-2 rounded-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
