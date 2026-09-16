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

  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [generatingTarget, setGeneratingTarget] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

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

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

async function compressImageForUpload(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string; fileName: string }> {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = (reader.result as string) || '';
        resolve({ blob: file, dataUrl, fileName: file.name });
      };
      reader.onerror = () => resolve({ blob: file, dataUrl: '', fileName: file.name });
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const dataUrl = (readerEvent.target?.result as string) || '';
          resolve({ blob: file, dataUrl, fileName: file.name });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const outputType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'photo';
              resolve({ blob, dataUrl, fileName: `${baseName}.jpg` });
            } else {
              resolve({ blob: file, dataUrl, fileName: file.name });
            }
          },
          outputType,
          quality
        );
      };
      img.onerror = () => {
        const dataUrl = (readerEvent.target?.result as string) || '';
        resolve({ blob: file, dataUrl, fileName: file.name });
      };
      img.src = (readerEvent.target?.result as string) || '';
    };
    reader.onerror = () => resolve({ blob: file, dataUrl: '', fileName: file.name });
    reader.readAsDataURL(file);
  });
}

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'poster' | 'exhibit' | 'verdict') => {
    const file = e.target.files?.[0];
    if (!file || !caseData) return;

    try {
      setUploadingTarget(target);
      setImageError(null);

      // Fast in-browser compression to ensure payloads stay under Vercel's limits
      const { blob, dataUrl, fileName } = await compressImageForUpload(file);
      let finalUrl = dataUrl;

      try {
        const formData = new FormData();
        formData.append('file', blob, fileName);
        formData.append('slug', slug);
        formData.append('type', target);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data.success && data.url) {
              finalUrl = data.url;
            }
          } catch {
            // keep compressed dataUrl
          }
        }
      } catch (uploadErr) {
        console.warn('Upload network error, using compressed Data URI fallback:', uploadErr);
      }

      if (!finalUrl) {
        throw new Error('Image could not be read. Please try another image.');
      }

      const syncImageUpdate = (prev: any, url: string, tgt: 'poster' | 'exhibit' | 'verdict') => {
        let updated = { ...prev };
        const titleStr = typeof updated.title === 'string' ? updated.title : (updated.title?.en || updated.slug);

        if (tgt === 'poster') {
          updated.bannerImage = url;
          updated.poster = { src: url, alt: `${titleStr} cover poster`, provenance: 'illustration' as const };
          if (updated.episodes?.[0]) {
            const epList = [...updated.episodes];
            epList[0] = { ...epList[0], image: { src: url, alt: `${titleStr} cover`, provenance: 'illustration' } };
            updated.episodes = epList;
          }
          if (updated.hi?.episodes?.[0]) {
            const hiEpList = [...updated.hi.episodes];
            hiEpList[0] = { ...hiEpList[0], image: { src: url, alt: `${titleStr} cover`, provenance: 'illustration' } };
            updated.hi = { ...updated.hi, episodes: hiEpList };
          }
        } else if (tgt === 'exhibit') {
          if (updated.panels?.[1]) {
            const panels = [...updated.panels];
            panels[1] = {
              ...panels[1],
              photoExhibitSrc: url,
              image: url,
              evidence: panels[1].evidence ? { ...panels[1].evidence, imageSrc: url } : undefined,
            };
            updated.panels = panels;
          }
          if (updated.episodes?.[1]) {
            const epList = [...updated.episodes];
            epList[1] = {
              ...epList[1],
              image: { src: url, alt: `Archival Exhibit for ${titleStr}`, provenance: 'archival' },
              exhibit: epList[1].exhibit ? { ...epList[1].exhibit, image: { src: url, alt: `Archival Exhibit for ${titleStr}`, provenance: 'archival' } } : undefined,
            };
            updated.episodes = epList;
          }
          if (updated.hi?.episodes?.[1]) {
            const hiEpList = [...updated.hi.episodes];
            hiEpList[1] = {
              ...hiEpList[1],
              image: { src: url, alt: `Archival Exhibit for ${titleStr}`, provenance: 'archival' },
              exhibit: hiEpList[1].exhibit ? { ...hiEpList[1].exhibit, image: { src: url, alt: `Archival Exhibit for ${titleStr}`, provenance: 'archival' } } : undefined,
            };
            updated.hi = { ...updated.hi, episodes: hiEpList };
          }
        } else if (tgt === 'verdict') {
          if (updated.panels?.[6]) {
            const panels = [...updated.panels];
            panels[6] = {
              ...panels[6],
              photoExhibitSrc: url,
              image: url,
            };
            updated.panels = panels;
          }
          if (updated.episodes?.[6]) {
            const epList = [...updated.episodes];
            epList[6] = {
              ...epList[6],
              image: { src: url, alt: `Courtroom Verdict for ${titleStr}`, provenance: 'illustration' },
              exhibit: epList[6].exhibit ? { ...epList[6].exhibit, image: { src: url, alt: `Courtroom Verdict for ${titleStr}`, provenance: 'illustration' } } : undefined,
            };
            updated.episodes = epList;
          }
          if (updated.hi?.episodes?.[6]) {
            const hiEpList = [...updated.hi.episodes];
            hiEpList[6] = {
              ...hiEpList[6],
              image: { src: url, alt: `Courtroom Verdict for ${titleStr}`, provenance: 'illustration' },
              exhibit: hiEpList[6].exhibit ? { ...hiEpList[6].exhibit, image: { src: url, alt: `Courtroom Verdict for ${titleStr}`, provenance: 'illustration' } } : undefined,
            };
            updated.hi = { ...updated.hi, episodes: hiEpList };
          }
        }
        return updated;
      };

      const updated = syncImageUpdate(caseData, finalUrl, target);
      setCaseData(updated);
      await handleSave(updated);
    } catch (err: unknown) {
      console.error('File upload error:', err);
      setImageError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleGeminiGenerate = async (prompt: string, target: 'poster' | 'exhibit' | 'verdict') => {
    if (!caseData || !prompt) return;

    try {
      setGeneratingTarget(target);
      setImageError(null);

      const res = await fetch('/api/admin/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          slug,
          type: target,
          aspectRatio: '16:9',
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`AI generation error (${res.status}): ${text.slice(0, 100)}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'AI Generation failed');
      }

      const syncImageUpdate = (prev: any, url: string, tgt: 'poster' | 'exhibit' | 'verdict') => {
        let updated = { ...prev };
        const titleStr = typeof updated.title === 'string' ? updated.title : (updated.title?.en || updated.slug);

        if (tgt === 'poster') {
          updated.bannerImage = url;
          updated.poster = { src: url, alt: `${titleStr} cover poster`, provenance: 'illustration' as const };
          if (updated.episodes?.[0]) {
            const epList = [...updated.episodes];
            epList[0] = { ...epList[0], image: { src: url, alt: `${titleStr} cover`, provenance: 'illustration' } };
            updated.episodes = epList;
          }
          if (updated.hi?.episodes?.[0]) {
            const hiEpList = [...updated.hi.episodes];
            hiEpList[0] = { ...hiEpList[0], image: { src: url, alt: `${titleStr} cover`, provenance: 'illustration' } };
            updated.hi = { ...updated.hi, episodes: hiEpList };
          }
        } else if (tgt === 'exhibit') {
          if (updated.panels?.[1]) {
            const panels = [...updated.panels];
            panels[1] = {
              ...panels[1],
              photoExhibitSrc: url,
              image: url,
              evidence: panels[1].evidence ? { ...panels[1].evidence, imageSrc: url } : undefined,
            };
            updated.panels = panels;
          }
          if (updated.episodes?.[1]) {
            const epList = [...updated.episodes];
            epList[1] = {
              ...epList[1],
              image: { src: url, alt: `Archival Exhibit for ${titleStr}`, provenance: 'archival' },
              exhibit: epList[1].exhibit ? { ...epList[1].exhibit, image: { src: url, alt: `Archival Exhibit for ${titleStr}`, provenance: 'archival' } } : undefined,
            };
            updated.episodes = epList;
          }
          if (updated.hi?.episodes?.[1]) {
            const hiEpList = [...updated.hi.episodes];
            hiEpList[1] = {
              ...hiEpList[1],
              image: { src: url, alt: `Archival Exhibit for ${titleStr}`, provenance: 'archival' },
              exhibit: hiEpList[1].exhibit ? { ...hiEpList[1].exhibit, image: { src: url, alt: `Archival Exhibit for ${titleStr}`, provenance: 'archival' } } : undefined,
            };
            updated.hi = { ...updated.hi, episodes: hiEpList };
          }
        } else if (tgt === 'verdict') {
          if (updated.panels?.[6]) {
            const panels = [...updated.panels];
            panels[6] = {
              ...panels[6],
              photoExhibitSrc: url,
              image: url,
            };
            updated.panels = panels;
          }
          if (updated.episodes?.[6]) {
            const epList = [...updated.episodes];
            epList[6] = {
              ...epList[6],
              image: { src: url, alt: `Courtroom Verdict for ${titleStr}`, provenance: 'illustration' },
              exhibit: epList[6].exhibit ? { ...epList[6].exhibit, image: { src: url, alt: `Courtroom Verdict for ${titleStr}`, provenance: 'illustration' } } : undefined,
            };
            updated.episodes = epList;
          }
          if (updated.hi?.episodes?.[6]) {
            const hiEpList = [...updated.hi.episodes];
            hiEpList[6] = {
              ...hiEpList[6],
              image: { src: url, alt: `Courtroom Verdict for ${titleStr}`, provenance: 'illustration' },
              exhibit: hiEpList[6].exhibit ? { ...hiEpList[6].exhibit, image: { src: url, alt: `Courtroom Verdict for ${titleStr}`, provenance: 'illustration' } } : undefined,
            };
            updated.hi = { ...updated.hi, episodes: hiEpList };
          }
        }
        return updated;
      };

      const updated = syncImageUpdate(caseData, data.url, target);
      setCaseData(updated);
      await handleSave(updated);
    } catch (err: unknown) {
      console.error('Gemini image generation error:', err);
      setImageError(err instanceof Error ? err.message : 'Gemini image generation failed');
    } finally {
      setGeneratingTarget(null);
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
  const caseTitleEn = typeof caseData.title === 'string' ? caseData.title : (caseData.title?.en || caseData.slug);
  const caseTitleDisplay = typeof caseData.title === 'string' ? caseData.title : (caseData.title?.[activeLanguage] || caseData.title?.en || caseData.slug);

  // Pre-craft prompts based on case metadata
  const posterPrompt = `Dramatic 16:9 cinematic archival billboard for Indian court case "${caseTitleEn}", dealing with ${caseData.categoryTag || 'constitutional law'}, warm amber tungsten lighting, rich dark shadows, retro legal documentary aesthetic, 8k resolution.`;
  const exhibitPrompt = `Archival documentary photograph of 1970s legal case file and investigative records for ${caseTitleEn}, stamped official memo, retro 35mm film grain, sepia tones.`;
  const verdictPrompt = `Indian Supreme Court Constitution Bench delivering landmark ruling in ${caseTitleEn}, courtroom bench with wooden gavel, advocates in black robes listening intently, cinematic wide shot 16:9.`;

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
            {caseTitleDisplay}
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
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-xs transition-all cursor-pointer ${
                activeLanguage === 'en' ? 'bg-[#D4AF37] text-[#0E1016]' : 'text-[#a9a49a] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setActiveLanguage('hi')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-xs transition-all cursor-pointer ${
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

      {imageError && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-300 rounded-xs text-xs font-mono flex items-center justify-between">
          <span>✕ {imageError}</span>
          <button onClick={() => setImageError(null)} className="text-white hover:underline cursor-pointer ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: '1. Overview & Metadata' },
          { id: 'panels', label: `2. Story Episodes (${caseData.panels?.length || 8})` },
          { id: 'brief', label: '3. Legal Brief & Certified Ratio' },
          { id: 'images', label: '4. AI Visuals & Dual Generator' },
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
                value={(typeof caseData.title === 'string' ? caseData.title : caseData.title?.[activeLanguage]) || ''}
                onChange={(e) =>
                  setCaseData({
                    ...caseData,
                    title: { ...(typeof caseData.title === 'object' ? caseData.title : { en: String(caseData.title || ''), hi: String(caseData.title || '') }), [activeLanguage]: e.target.value },
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
                value={caseData.court || ''}
                onChange={(e) => setCaseData({ ...caseData, court: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-2.5 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">Year</label>
              <input
                type="number"
                value={caseData.year || 2020}
                onChange={(e) => setCaseData({ ...caseData, year: parseInt(e.target.value) || 2020 })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-2.5 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">Legal Genre</label>
              <select
                value={caseData.genre || 'constitutional'}
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
              value={(typeof caseData.blurb === 'string' ? caseData.blurb : caseData.blurb?.[activeLanguage]) || (caseData as any).hook || ''}
              onChange={(e) =>
                setCaseData({
                  ...caseData,
                  blurb: { ...(typeof caseData.blurb === 'object' ? caseData.blurb : { en: String(caseData.blurb || (caseData as any).hook || ''), hi: String(caseData.blurb || (caseData as any).hook || '') }), [activeLanguage]: e.target.value },
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
                value={caseData.citation || ''}
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
                value={caseData.judgmentUrl || ''}
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
          {caseData.panels?.map((panel, idx) => (
            <div key={panel.id || idx} className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#D4AF37]">
                    Episode #{idx + 1} ({panel.type})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8c887e]">ID: {panel.id || `panel-${idx + 1}`}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                    Eyebrow / Episode Tag ({activeLanguage.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={(typeof panel.eyebrow === 'string' ? panel.eyebrow : panel.eyebrow?.[activeLanguage]) || ''}
                    onChange={(e) => {
                      const updatedPanels = [...caseData.panels];
                      const currentEyebrow = typeof updatedPanels[idx].eyebrow === 'object' ? updatedPanels[idx].eyebrow : { en: String(updatedPanels[idx].eyebrow || ''), hi: String(updatedPanels[idx].eyebrow || '') };
                      updatedPanels[idx].eyebrow = { ...currentEyebrow, [activeLanguage]: e.target.value };
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
                    value={(typeof panel.headline === 'string' ? panel.headline : panel.headline?.[activeLanguage]) || ''}
                    onChange={(e) => {
                      const updatedPanels = [...caseData.panels];
                      const currentHeadline = typeof updatedPanels[idx].headline === 'object' ? updatedPanels[idx].headline : { en: String(updatedPanels[idx].headline || ''), hi: String(updatedPanels[idx].headline || '') };
                      updatedPanels[idx].headline = { ...currentHeadline, [activeLanguage]: e.target.value };
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
                  value={(typeof panel.body === 'string' ? panel.body : panel.body?.[activeLanguage]) || ''}
                  onChange={(e) => {
                    const updatedPanels = [...caseData.panels];
                    const currentBody = typeof updatedPanels[idx].body === 'object' ? updatedPanels[idx].body : { en: String(updatedPanels[idx].body || ''), hi: String(updatedPanels[idx].body || '') };
                    updatedPanels[idx].body = { ...currentBody, [activeLanguage]: e.target.value };
                    setCaseData({ ...caseData, panels: updatedPanels });
                  }}
                  className="w-full bg-[#0A0C10] border border-white/15 text-xs text-[#c9c5bc] p-3 rounded-xs leading-relaxed"
                />
              </div>
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
              value={caseData.brief?.facts?.[activeLanguage] || ''}
              onChange={(e) =>
                setCaseData({
                  ...caseData,
                  brief: {
                    ...caseData.brief,
                    facts: { ...caseData.brief?.facts, [activeLanguage]: e.target.value },
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
              value={caseData.brief?.held?.[activeLanguage] || ''}
              onChange={(e) =>
                setCaseData({
                  ...caseData,
                  brief: {
                    ...caseData.brief,
                    held: { ...caseData.brief?.held, [activeLanguage]: e.target.value },
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
              value={caseData.brief?.reasoning?.[activeLanguage] || ''}
              onChange={(e) =>
                setCaseData({
                  ...caseData,
                  brief: {
                    ...caseData.brief,
                    reasoning: { ...caseData.brief?.reasoning, [activeLanguage]: e.target.value },
                  },
                })
              }
              className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-3 rounded-xs leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* TAB 4: VISUAL ASSETS & AI DUAL GENERATOR */}
      {activeTab === 'images' && (
        <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-8">
          <div className="pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-anton text-white uppercase tracking-wider">
                Visual Asset Studio & AI Dual Generator
              </h3>
              <p className="text-xs text-[#a9a49a]">
                Generate new AI visuals with Gemini, or copy prompts for Midjourney / ChatGPT and upload files directly.
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-xs border border-[#D4AF37]/20">
              Dual System Active
            </div>
          </div>

          {/* 1. Hero Billboard Poster (21:9 / 16:9) */}
          <div className="p-5 bg-black/50 border border-white/10 rounded-xs space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase">
                1. Hero Billboard Cover Poster (21:9 / 16:9)
              </span>
              <span className="text-[10px] font-mono text-white/50">{caseData.bannerImage || caseData.poster?.src}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {/* Image Preview */}
              <div className="space-y-2">
                <div className="aspect-[16/9] bg-[#0E1016] border border-white/15 rounded-xs overflow-hidden relative flex items-center justify-center">
                  <img
                    src={caseData.bannerImage || caseData.poster?.src || '/images/cases/ghost-case.jpg'}
                    alt="Hero Poster Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cases/ghost-case.jpg';
                    }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#8c887e] text-center">Active Billboard Asset</p>
              </div>

              {/* Prompt & Dual Actions */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-[#a9a49a] uppercase">AI Visual Prompt</label>
                    <button
                      type="button"
                      onClick={() => copyPrompt('poster', posterPrompt)}
                      className="text-[10px] font-mono text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{copiedPromptId === 'poster' ? '✓ Copied!' : '📋 Copy Prompt'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    defaultValue={posterPrompt}
                    id="prompt-poster"
                    className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2.5 rounded-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Dual Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A: Gemini AI */}
                  <button
                    type="button"
                    disabled={generatingTarget === 'poster'}
                    onClick={() => {
                      const p = (document.getElementById('prompt-poster') as HTMLTextAreaElement)?.value || posterPrompt;
                      handleGeminiGenerate(p, 'poster');
                    }}
                    className="px-4 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {generatingTarget === 'poster' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Generating Gemini...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡</span>
                        <span>Generate with Gemini AI</span>
                      </>
                    )}
                  </button>

                  {/* Option B: Direct File Upload */}
                  <label className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingTarget === 'poster'}
                      onChange={(e) => handleFileUpload(e, 'poster')}
                    />
                    {uploadingTarget === 'poster' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span>📂</span>
                        <span>Upload Custom Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Archival Press / Record Exhibit (Episode 2) */}
          <div className="p-5 bg-black/50 border border-white/10 rounded-xs space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase">
                2. Archival Press Clipping / Case Docket (Episode 2)
              </span>
              <span className="text-[10px] font-mono text-white/50">
                {caseData.panels?.[1]?.photoExhibitSrc || caseData.panels?.[1]?.image || '/images/cases/nanavati_portrait.jpg'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {/* Image Preview */}
              <div className="space-y-2">
                <div className="aspect-[16/9] bg-[#0E1016] border border-white/15 rounded-xs overflow-hidden relative flex items-center justify-center">
                  <img
                    src={caseData.panels?.[1]?.photoExhibitSrc || caseData.panels?.[1]?.image || '/images/cases/nanavati_portrait.jpg'}
                    alt="Exhibit Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cases/nanavati_portrait.jpg';
                    }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#8c887e] text-center">Active Exhibit Asset</p>
              </div>

              {/* Prompt & Dual Actions */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-[#a9a49a] uppercase">AI Visual Prompt</label>
                    <button
                      type="button"
                      onClick={() => copyPrompt('exhibit', exhibitPrompt)}
                      className="text-[10px] font-mono text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{copiedPromptId === 'exhibit' ? '✓ Copied!' : '📋 Copy Prompt'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    defaultValue={exhibitPrompt}
                    id="prompt-exhibit"
                    className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2.5 rounded-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Dual Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A: Gemini AI */}
                  <button
                    type="button"
                    disabled={generatingTarget === 'exhibit'}
                    onClick={() => {
                      const p = (document.getElementById('prompt-exhibit') as HTMLTextAreaElement)?.value || exhibitPrompt;
                      handleGeminiGenerate(p, 'exhibit');
                    }}
                    className="px-4 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {generatingTarget === 'exhibit' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Generating Gemini...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡</span>
                        <span>Generate with Gemini AI</span>
                      </>
                    )}
                  </button>

                  {/* Option B: Direct File Upload */}
                  <label className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingTarget === 'exhibit'}
                      onChange={(e) => handleFileUpload(e, 'exhibit')}
                    />
                    {uploadingTarget === 'exhibit' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span>📂</span>
                        <span>Upload Custom Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Courtroom Verdict & Bench Scene (Episode 7) */}
          <div className="p-5 bg-black/50 border border-white/10 rounded-xs space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase">
                3. Courtroom Verdict & Bench Scene (Episode 7)
              </span>
              <span className="text-[10px] font-mono text-white/50">
                {caseData.panels?.[6]?.photoExhibitSrc || caseData.panels?.[6]?.image || '/images/cases/ghost_court_verdict.jpg'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {/* Image Preview */}
              <div className="space-y-2">
                <div className="aspect-[16/9] bg-[#0E1016] border border-white/15 rounded-xs overflow-hidden relative flex items-center justify-center">
                  <img
                    src={caseData.panels?.[6]?.photoExhibitSrc || caseData.panels?.[6]?.image || '/images/cases/ghost_court_verdict.jpg'}
                    alt="Verdict Scene Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cases/ghost_court_verdict.jpg';
                    }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#8c887e] text-center">Active Verdict Asset</p>
              </div>

              {/* Prompt & Dual Actions */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-[#a9a49a] uppercase">AI Visual Prompt</label>
                    <button
                      type="button"
                      onClick={() => copyPrompt('verdict', verdictPrompt)}
                      className="text-[10px] font-mono text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{copiedPromptId === 'verdict' ? '✓ Copied!' : '📋 Copy Prompt'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    defaultValue={verdictPrompt}
                    id="prompt-verdict"
                    className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2.5 rounded-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Dual Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A: Gemini AI */}
                  <button
                    type="button"
                    disabled={generatingTarget === 'verdict'}
                    onClick={() => {
                      const p = (document.getElementById('prompt-verdict') as HTMLTextAreaElement)?.value || verdictPrompt;
                      handleGeminiGenerate(p, 'verdict');
                    }}
                    className="px-4 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {generatingTarget === 'verdict' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Generating Gemini...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡</span>
                        <span>Generate with Gemini AI</span>
                      </>
                    )}
                  </button>

                  {/* Option B: Direct File Upload */}
                  <label className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingTarget === 'verdict'}
                      onChange={(e) => handleFileUpload(e, 'verdict')}
                    />
                    {uploadingTarget === 'verdict' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span>📂</span>
                        <span>Upload Custom Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

