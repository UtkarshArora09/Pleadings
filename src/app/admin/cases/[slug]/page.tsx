'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CaseData, StoryPanel, Episode } from '@/types';
import {
  getCaseVisualPrompts,
  getArchetypePrompt,
  LEGAL_PROMPT_ARCHETYPES,
} from '@/lib/ai/visualPrompts';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'panels' | 'flashcards' | 'history' | 'brief' | 'images'>('overview');
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'hi'>('en');
  const [episodeLayersTab, setEpisodeLayersTab] = useState<Record<number, 'story' | 'student' | 'advocate'>>({});

  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [generatingTarget, setGeneratingTarget] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [prompts, setPrompts] = useState<{
    poster: string;
    exhibit: string;
    verdict: string;
    posterArchetype: string;
    exhibitArchetype: string;
    verdictArchetype: string;
  }>({
    poster: '',
    exhibit: '',
    verdict: '',
    posterArchetype: 'senior-advocate-bar',
    exhibitArchetype: 'vintage-newspaper-headline',
    verdictArchetype: 'constitution-bench-rostrum',
  });

  const [batchGenerating, setBatchGenerating] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<string>('');

  // Smart LLM Prompt Director State (Groq / Gemini)
  const [generatingSmartPrompts, setGeneratingSmartPrompts] = useState<boolean>(false);
  const [smartPromptProvider, setSmartPromptProvider] = useState<string | null>(null);
  const [selectedArtStyle, setSelectedArtStyle] = useState<string>('Cinematic 35mm Period Film, dramatic lighting');
  const [activeRefineSlot, setActiveRefineSlot] = useState<'poster' | 'exhibit' | 'verdict' | null>(null);
  const [customRefineText, setCustomRefineText] = useState<string>('');

  useEffect(() => {
    async function loadCase() {
      try {
        setLoading(true);

        const res = await fetch(`/api/admin/cases/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.case) {
            setCaseData(data.case);
          }
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
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.case) {
          setCaseData(data.case);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2500);
        }
      } else {
        setCaseData(updatedCaseData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Error saving case:', err);
      setCaseData(updatedCaseData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  useEffect(() => {
    if (caseData) {
      const caseTitleEn = typeof caseData.title === 'string' ? caseData.title : (caseData.title?.en || caseData.slug);
      const generated = getCaseVisualPrompts({
        title: caseTitleEn,
        court: caseData.court,
        year: caseData.year,
        genre: caseData.categoryTag,
        categoryTag: caseData.categoryTag,
        slug: caseData.slug || slug,
      });

      setPrompts((prev) => ({
        poster: prev.poster || generated.poster.prompt,
        exhibit: prev.exhibit || generated.exhibit.prompt,
        verdict: prev.verdict || generated.verdict.prompt,
        posterArchetype: prev.posterArchetype || generated.poster.archetypeId,
        exhibitArchetype: prev.exhibitArchetype || generated.exhibit.archetypeId,
        verdictArchetype: prev.verdictArchetype || generated.verdict.archetypeId,
      }));
    }
  }, [caseData?.slug, caseData?.title, slug]);

  const handleResetBaselinePrompts = () => {
    if (!caseData) return;
    const caseTitleEn = typeof caseData.title === 'string' ? caseData.title : (caseData.title?.en || caseData.slug);
    const baseline = getCaseVisualPrompts(
      {
        title: caseTitleEn,
        court: caseData.court,
        year: caseData.year,
        genre: caseData.categoryTag,
        categoryTag: caseData.categoryTag,
        slug: caseData.slug || slug,
      },
      { forceRandom: false }
    );

    setPrompts({
      poster: baseline.poster.prompt,
      exhibit: baseline.exhibit.prompt,
      verdict: baseline.verdict.prompt,
      posterArchetype: baseline.poster.archetypeId,
      exhibitArchetype: baseline.exhibit.archetypeId,
      verdictArchetype: baseline.verdict.archetypeId,
    });
    setSmartPromptProvider('↺ Restored default baseline prompts for this case');
    setTimeout(() => setSmartPromptProvider(null), 4000);
  };

  const handleArchetypeChange = (slot: 'poster' | 'exhibit' | 'verdict', archetypeId: string) => {
    if (!caseData) return;
    const caseTitleEn = typeof caseData.title === 'string' ? caseData.title : (caseData.title?.en || caseData.slug);
    const newPrompt = getArchetypePrompt(archetypeId, {
      title: caseTitleEn,
      court: caseData.court,
      year: caseData.year,
      genre: caseData.categoryTag,
      categoryTag: caseData.categoryTag,
      slug: caseData.slug || slug,
    });

    setPrompts((prev) => ({
      ...prev,
      [slot]: newPrompt,
      [`${slot}Archetype`]: archetypeId,
    }));
  };

  const handlePromptTextChange = (slot: 'poster' | 'exhibit' | 'verdict', text: string) => {
    setPrompts((prev) => ({
      ...prev,
      [slot]: text,
    }));
  };

  const handleGenerateSmartPrompts = async (
    customInstruction?: string,
    targetSlot?: 'all' | 'poster' | 'exhibit' | 'verdict'
  ) => {
    if (!caseData || generatingSmartPrompts) return;
    try {
      setGeneratingSmartPrompts(true);
      setImageError(null);

      const res = await fetch('/api/admin/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData: {
            title: caseData.title,
            court: caseData.court,
            year: caseData.year,
            genre: caseData.categoryTag || caseData.genre,
            statuteSections: caseData.brief?.chargesApplied?.join(', ') || '',
            facts: caseData.brief?.facts || caseData.blurb,
            held: caseData.brief?.held,
            slug: caseData.slug || slug,
          },
          artStyle: selectedArtStyle,
          customInstruction: customInstruction || undefined,
          targetSlot: targetSlot || 'all',
        }),
      });

      const data = await res.json();
      if (data.success && data.prompts) {
        setPrompts((prev) => ({
          ...prev,
          ...(targetSlot === 'poster' ? { poster: data.prompts.poster } : {}),
          ...(targetSlot === 'exhibit' ? { exhibit: data.prompts.exhibit } : {}),
          ...(targetSlot === 'verdict' ? { verdict: data.prompts.verdict } : {}),
          ...(!targetSlot || targetSlot === 'all'
            ? {
                poster: data.prompts.poster,
                exhibit: data.prompts.exhibit,
                verdict: data.prompts.verdict,
              }
            : {}),
        }));
        setSmartPromptProvider(`⚡ Prompts crafted via ${data.provider}`);
        setTimeout(() => setSmartPromptProvider(null), 6000);
        setActiveRefineSlot(null);
        setCustomRefineText('');
      } else {
        throw new Error(data.error || 'Failed to generate prompts');
      }
    } catch (err: unknown) {
      console.error('Smart prompt generation error:', err);
      setImageError(err instanceof Error ? err.message : 'Smart prompt generation failed');
    } finally {
      setGeneratingSmartPrompts(false);
    }
  };

  const handleGenerateAllThree = async () => {
    if (!caseData || batchGenerating) return;
    try {
      setBatchGenerating(true);
      setImageError(null);

      // 1. Poster
      setBatchProgress('1/3 Generating Hero Billboard Poster...');
      await handleGeminiGenerate(prompts.poster || posterPrompt, 'poster');

      // 2. Exhibit
      setBatchProgress('2/3 Generating Archival Exhibit Photo...');
      await handleGeminiGenerate(prompts.exhibit || exhibitPrompt, 'exhibit');

      // 3. Verdict
      setBatchProgress('3/3 Generating Courtroom Verdict Scene...');
      await handleGeminiGenerate(prompts.verdict || verdictPrompt, 'verdict');

      setBatchProgress('✓ All 3 case visuals generated successfully!');
      setTimeout(() => setBatchProgress(''), 4000);
    } catch (err: unknown) {
      console.error('Batch generation error:', err);
      setImageError(err instanceof Error ? err.message : 'Batch generation error');
    } finally {
      setBatchGenerating(false);
    }
  };

async function compressImageForUpload(
  file: File,
  maxWidth = 1024,
  maxHeight = 576,
  quality = 0.65
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
        const updated = { ...prev };
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
        const updated = { ...prev };
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
      const newStatus = isCurrentlyPublished ? 'ADMIN_REVIEW' : 'PUBLISHED';
      const locallyUpdated = { ...caseData, status: newStatus as any };
      setCaseData(locallyUpdated);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`pleadings_case_${slug}`, JSON.stringify(locallyUpdated));
        } catch {}
      }

      const res = await fetch(`/api/admin/cases/${slug}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: !isCurrentlyPublished }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.case) {
          setCaseData(data.case);
        }
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
          { id: 'panels', label: `2. Episodes & Layers (${caseData.episodes?.length || 8})` },
          { id: 'flashcards', label: `3. Student Flashcards (${caseData.flashcards?.length || 0})` },
          { id: 'history', label: `4. Advocate Reference & Citations` },
          { id: 'brief', label: '5. Legal Brief & Certified Ratio' },
          { id: 'images', label: '6. AI Visuals & Dual Generator' },
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

      {/* TAB 2: STORY & DEPTH LAYERS (CUSTOMIZABLE EPISODES) */}
      {activeTab === 'panels' && (() => {
        const ensureEpisodes = (): Episode[] => {
          if (caseData.episodes && caseData.episodes.length > 0) return [...caseData.episodes];
          return Array.from({ length: 8 }).map((_, i) => ({
            n: i + 1,
            kicker: (typeof caseData.panels?.[i]?.eyebrow === 'object' ? caseData.panels?.[i]?.eyebrow?.[activeLanguage] : caseData.panels?.[i]?.eyebrow) || `EPISODE 0${i + 1}`,
            title: (typeof caseData.panels?.[i]?.headline === 'object' ? caseData.panels?.[i]?.headline?.[activeLanguage] : caseData.panels?.[i]?.headline) || `Episode ${i + 1}`,
            layers: {
              story: { blocks: [{ type: 'para' as const, text: (typeof caseData.panels?.[i]?.body === 'object' ? caseData.panels?.[i]?.body?.[activeLanguage] : caseData.panels?.[i]?.body) || '', source: { tier: 'AMBER' as const } }] },
              student: { blocks: [{ type: 'para' as const, text: `LEGAL ANALYSIS: ${(typeof caseData.panels?.[i]?.body === 'object' ? caseData.panels?.[i]?.body?.[activeLanguage] : caseData.panels?.[i]?.body) || ''}`, source: { tier: 'AMBER' as const } }], ratio: '', obiter: [], examAngle: '' },
              advocate: { blocks: [{ type: 'para' as const, text: `TRIAL PROPOSITION: Standard of proof and statutory application.`, source: { tier: 'AMBER' as const } }], pinpoints: [{ proposition: 'Core proposition', para: 8 }] },
            },
            endHook: i < 7 ? 'How did the proceedings unfold?' : 'Case dossier complete.',
          }));
        };

        const currentEpisodes = ensureEpisodes();

        const handleAddEpisode = () => {
          const nextNum = currentEpisodes.length + 1;
          const newEp: Episode = {
            n: nextNum,
            kicker: `EPISODE 0${nextNum}`,
            title: `Episode ${nextNum}`,
            layers: {
              story: { blocks: [{ type: 'para' as const, text: '', source: { tier: 'AMBER' as const } }] },
              student: { blocks: [{ type: 'para' as const, text: 'LEGAL ANALYSIS: ', source: { tier: 'AMBER' as const } }], ratio: '', obiter: [], examAngle: '' },
              advocate: { blocks: [{ type: 'para' as const, text: 'TRIAL PROPOSITION: ', source: { tier: 'AMBER' as const } }], pinpoints: [{ proposition: '', para: 8 }] },
            },
            endHook: 'What followed next in the proceedings?',
          };
          const updated = [...currentEpisodes, newEp];
          setCaseData({ ...caseData, episodes: updated });
        };

        const handleDeleteEpisode = (targetIdx: number) => {
          if (currentEpisodes.length <= 1) return;
          const filtered = currentEpisodes
            .filter((_, i) => i !== targetIdx)
            .map((ep, i) => ({
              ...ep,
              n: i + 1,
              kicker: ep.kicker.startsWith('EPISODE') ? `EPISODE 0${i + 1}` : ep.kicker,
            }));
          setCaseData({ ...caseData, episodes: filtered });
        };

        return (
          <div className="space-y-6">
            <div className="p-4 bg-black/40 border border-white/10 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Customizable Episode Architecture ({currentEpisodes.length} Episodes)
                </h3>
                <p className="text-[11px] text-[#a9a49a] mt-0.5">
                  Customize episodes dynamically. Each episode contains <strong>Story</strong> (general reading), <strong>Student</strong> (legal ratio, obiter, exam angle), and <strong>Advocate</strong> (trial proposition & paragraph pinpoints).
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEpisode}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all cursor-pointer shadow-md self-start sm:self-auto flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Add Episode</span>
              </button>
            </div>

            {currentEpisodes.map((ep, idx) => {
              const currentLayer = episodeLayersTab[idx] || 'story';

              return (
                <div key={idx} className="bg-[#121520] border border-white/10 rounded-xs overflow-hidden shadow-xl">
                  {/* Episode Header & 3-Way Layer Switcher */}
                  <div className="p-4 bg-black/60 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                      <span className="font-anton text-base text-white uppercase tracking-wider">
                        Episode 0{idx + 1} · {ep.title || `Episode ${idx + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Layer Selector Pill */}
                      <div className="inline-flex items-center p-0.5 bg-[#0A0C10] border border-white/15 rounded-xs">
                        <button
                          type="button"
                          onClick={() => setEpisodeLayersTab({ ...episodeLayersTab, [idx]: 'story' })}
                          className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                            currentLayer === 'story'
                              ? 'bg-[#D4AF37] text-black shadow-md'
                              : 'text-[#a9a49a] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>📖</span>
                          <span>Story</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEpisodeLayersTab({ ...episodeLayersTab, [idx]: 'student' })}
                          className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                            currentLayer === 'student'
                              ? 'bg-sky-400 text-black shadow-md font-bold'
                              : 'text-[#a9a49a] hover:text-sky-300 hover:bg-white/5'
                          }`}
                        >
                          <span>🎓</span>
                          <span>Student</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEpisodeLayersTab({ ...episodeLayersTab, [idx]: 'advocate' })}
                          className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                            currentLayer === 'advocate'
                              ? 'bg-emerald-400 text-black shadow-md font-bold'
                              : 'text-[#a9a49a] hover:text-emerald-300 hover:bg-white/5'
                          }`}
                        >
                          <span>⚖️</span>
                          <span>Advocate</span>
                        </button>
                      </div>

                      {/* Delete Episode button */}
                      {currentEpisodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteEpisode(idx)}
                          title="Delete this episode"
                          className="px-2 py-1 text-xs text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 rounded-xs font-mono transition-all cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* 1. STORY LAYER */}
                    {currentLayer === 'story' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-[10px] font-mono text-[#D4AF37] uppercase font-bold">
                          <span>📖 General Story Arc Layer (Public Narrative)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                              Episode Eyebrow / Kicker Tag
                            </label>
                            <input
                              type="text"
                              value={ep.kicker || ''}
                              onChange={(e) => {
                                const epList = ensureEpisodes();
                                epList[idx] = { ...epList[idx], kicker: e.target.value };
                                setCaseData({ ...caseData, episodes: epList });
                              }}
                              className="w-full bg-[#0A0C10] border border-white/15 text-xs text-[#D4AF37] font-bold p-2.5 rounded-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                              Episode Title / Headline
                            </label>
                            <input
                              type="text"
                              value={ep.title || ''}
                              onChange={(e) => {
                                const epList = ensureEpisodes();
                                epList[idx] = { ...epList[idx], title: e.target.value };
                                setCaseData({ ...caseData, episodes: epList });
                              }}
                              className="w-full bg-[#0A0C10] border border-white/15 text-sm text-white font-bold p-2.5 rounded-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                            Story Narrative Body Text ({activeLanguage.toUpperCase()})
                          </label>
                          <textarea
                            rows={4}
                            value={ep.layers?.story?.blocks?.[0]?.text || ''}
                            onChange={(e) => {
                              const epList = ensureEpisodes();
                              const storyBlocks = [{ ...(epList[idx].layers?.story?.blocks?.[0] || { type: 'para' as const, source: { tier: 'AMBER' as const } }), text: e.target.value }];
                              epList[idx] = {
                                ...epList[idx],
                                layers: {
                                  ...epList[idx].layers,
                                  story: { ...epList[idx].layers?.story, blocks: storyBlocks },
                                },
                              };
                              setCaseData({ ...caseData, episodes: epList });
                            }}
                            className="w-full bg-[#0A0C10] border border-white/15 text-xs text-[#c9c5bc] p-3 rounded-xs leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-[#D4AF37] uppercase mb-1">
                            End Hook / Next Episode Transition
                          </label>
                          <input
                            type="text"
                            value={ep.endHook || ''}
                            onChange={(e) => {
                              const epList = ensureEpisodes();
                              epList[idx] = { ...epList[idx], endHook: e.target.value };
                              setCaseData({ ...caseData, episodes: epList });
                            }}
                            className="w-full bg-[#0A0C10] border border-white/15 text-xs text-[#D4AF37] italic p-2 rounded-xs"
                            placeholder="↳ The sentence that leads readers to the next episode..."
                          />
                        </div>
                      </div>
                    )}

                    {/* 2. STUDENT LAYER */}
                    {currentLayer === 'student' && (
                      <div className="space-y-4 animate-fadeIn border-l-2 border-sky-400 pl-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-sky-500/20 text-[10px] font-mono text-sky-300 uppercase font-bold">
                          <span>🎓 Student Depth Layer (IRAC Legal Analysis, Ratio Decidendi, Obiter & Exam Angle)</span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-sky-300 uppercase mb-1">
                            Student Legal Analysis Text (IRAC Breakdown)
                          </label>
                          <textarea
                            rows={3}
                            value={ep.layers?.student?.blocks?.[0]?.text || ''}
                            onChange={(e) => {
                              const epList = ensureEpisodes();
                              const studentBlocks = [{ ...(epList[idx].layers?.student?.blocks?.[0] || { type: 'para' as const, source: { tier: 'AMBER' as const } }), text: e.target.value }];
                              epList[idx] = {
                                ...epList[idx],
                                layers: {
                                  ...epList[idx].layers,
                                  student: { ...epList[idx].layers?.student, blocks: studentBlocks },
                                },
                              };
                              setCaseData({ ...caseData, episodes: epList });
                            }}
                            className="w-full bg-[#0A0C10] border border-sky-500/30 text-xs text-sky-100 p-3 rounded-xs leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-sky-300 uppercase mb-1">
                              Ratio Decidendi (Binding Legal Principle)
                            </label>
                            <textarea
                              rows={2}
                              value={ep.layers?.student?.ratio || ''}
                              onChange={(e) => {
                                const epList = ensureEpisodes();
                                epList[idx] = {
                                  ...epList[idx],
                                  layers: {
                                    ...epList[idx].layers,
                                    student: { ...epList[idx].layers?.student, ratio: e.target.value },
                                  },
                                };
                                setCaseData({ ...caseData, episodes: epList });
                              }}
                              placeholder="e.g. Authoritative holding on statutory limits..."
                              className="w-full bg-[#0A0C10] border border-sky-500/30 text-xs text-white p-2.5 rounded-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-sky-300 uppercase mb-1">
                              Exam Angle (CLAT-PG / Judiciary Mains Focus)
                            </label>
                            <textarea
                              rows={2}
                              value={ep.layers?.student?.examAngle || ''}
                              onChange={(e) => {
                                const epList = ensureEpisodes();
                                epList[idx] = {
                                  ...epList[idx],
                                  layers: {
                                    ...epList[idx].layers,
                                    student: { ...epList[idx].layers?.student, examAngle: e.target.value },
                                  },
                                };
                                setCaseData({ ...caseData, episodes: epList });
                              }}
                              placeholder="e.g. Frequently tested in Judiciary Mains under Section 300..."
                              className="w-full bg-[#0A0C10] border border-sky-500/30 text-xs text-white p-2.5 rounded-xs"
                            />
                          </div>
                        </div>

                        {/* Obiter Dicta Bullet Manager */}
                        <div className="space-y-2 pt-2 border-t border-sky-500/10">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono text-sky-300 uppercase font-bold">
                              Obiter Dicta (Persuasive Observations)
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const epList = ensureEpisodes();
                                const currentObiter = epList[idx].layers?.student?.obiter || [];
                                epList[idx] = {
                                  ...epList[idx],
                                  layers: {
                                    ...epList[idx].layers,
                                    student: { ...epList[idx].layers?.student, obiter: [...currentObiter, ''] },
                                  },
                                };
                                setCaseData({ ...caseData, episodes: epList });
                              }}
                              className="text-[10px] font-mono text-sky-400 hover:text-white uppercase font-bold cursor-pointer"
                            >
                              + Add Obiter Point
                            </button>
                          </div>

                          {(ep.layers?.student?.obiter || []).map((ob: string, oIdx: number) => (
                            <div key={oIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ob}
                                onChange={(e) => {
                                  const epList = ensureEpisodes();
                                  const currentObiter = [...(epList[idx].layers?.student?.obiter || [])];
                                  currentObiter[oIdx] = e.target.value;
                                  epList[idx] = {
                                    ...epList[idx],
                                    layers: {
                                      ...epList[idx].layers,
                                      student: { ...epList[idx].layers?.student, obiter: currentObiter },
                                    },
                                  };
                                  setCaseData({ ...caseData, episodes: epList });
                                }}
                                className="flex-1 bg-[#0A0C10] border border-sky-500/20 text-xs text-white p-2 rounded-xs"
                                placeholder="Observation point..."
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const epList = ensureEpisodes();
                                  const currentObiter = (epList[idx].layers?.student?.obiter || []).filter((_: any, i: number) => i !== oIdx);
                                  epList[idx] = {
                                    ...epList[idx],
                                    layers: {
                                      ...epList[idx].layers,
                                      student: { ...epList[idx].layers?.student, obiter: currentObiter },
                                    },
                                  };
                                  setCaseData({ ...caseData, episodes: epList });
                                }}
                                className="text-xs text-red-400 hover:text-red-300 font-mono px-2 py-1 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Minority Dissent (Optional) */}
                        <div className="p-3 bg-black/40 border border-rose-500/20 rounded-xs space-y-2">
                          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                            Minority Dissent (Optional)
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Dissenting Judge (e.g. Justice Subba Rao)"
                              value={ep.layers?.student?.dissent?.judge || ''}
                              onChange={(e) => {
                                const epList = ensureEpisodes();
                                const curDissent = epList[idx].layers?.student?.dissent || { judge: '', ground: '', text: '' };
                                epList[idx] = {
                                  ...epList[idx],
                                  layers: {
                                    ...epList[idx].layers,
                                    student: { ...epList[idx].layers?.student, dissent: { ...curDissent, judge: e.target.value } },
                                  },
                                };
                                setCaseData({ ...caseData, episodes: epList });
                              }}
                              className="bg-[#0A0C10] border border-white/10 text-xs text-white p-2 rounded-xs"
                            />
                            <input
                              type="text"
                              placeholder="Core Ground (e.g. Overbreadth of restriction)"
                              value={ep.layers?.student?.dissent?.ground || ''}
                              onChange={(e) => {
                                const epList = ensureEpisodes();
                                const curDissent = epList[idx].layers?.student?.dissent || { judge: '', ground: '', text: '' };
                                epList[idx] = {
                                  ...epList[idx],
                                  layers: {
                                    ...epList[idx].layers,
                                    student: { ...epList[idx].layers?.student, dissent: { ...curDissent, ground: e.target.value } },
                                  },
                                };
                                setCaseData({ ...caseData, episodes: epList });
                              }}
                              className="bg-[#0A0C10] border border-white/10 text-xs text-white p-2 rounded-xs"
                            />
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Dissenting text / judicial excerpt..."
                            value={ep.layers?.student?.dissent?.text || ''}
                            onChange={(e) => {
                              const epList = ensureEpisodes();
                              const curDissent = epList[idx].layers?.student?.dissent || { judge: '', ground: '', text: '' };
                              epList[idx] = {
                                ...epList[idx],
                                layers: {
                                  ...epList[idx].layers,
                                  student: { ...epList[idx].layers?.student, dissent: { ...curDissent, text: e.target.value } },
                                },
                              };
                              setCaseData({ ...caseData, episodes: epList });
                            }}
                            className="w-full bg-[#0A0C10] border border-white/10 text-xs text-white p-2 rounded-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* 3. ADVOCATE LAYER */}
                    {currentLayer === 'advocate' && (
                      <div className="space-y-4 animate-fadeIn border-l-2 border-emerald-400 pl-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-emerald-500/20 gap-1">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-300 uppercase font-bold">
                            <span>⚖️ Advocate Layer (Trial Proposition & Pinpoints)</span>
                          </div>
                          <span className="text-[10px] font-mono text-white/40 italic">
                            Only names the legal point illustrated by facts (no hypothetical strategy)
                          </span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-emerald-300 uppercase mb-1 font-bold">
                            Trial Proposition Text (TRIAL PROPOSITION: ...)
                          </label>
                          <textarea
                            rows={3}
                            value={ep.layers?.advocate?.blocks?.[0]?.text || ''}
                            onChange={(e) => {
                              const epList = ensureEpisodes();
                              const advBlocks = [{ ...(epList[idx].layers?.advocate?.blocks?.[0] || { type: 'para' as const, source: { tier: 'AMBER' as const } }), text: e.target.value }];
                              epList[idx] = {
                                ...epList[idx],
                                layers: {
                                  ...epList[idx].layers,
                                  advocate: { ...epList[idx].layers?.advocate, blocks: advBlocks },
                                },
                              };
                              setCaseData({ ...caseData, episodes: epList });
                            }}
                            placeholder="TRIAL PROPOSITION: One sentence naming the legal point that this episode's facts or reasoning illustrate..."
                            className="w-full bg-[#0A0C10] border border-emerald-500/30 text-xs text-emerald-100 p-3 rounded-xs leading-relaxed font-mono"
                          />
                          <p className="text-[10px] text-white/50 font-mono mt-1">
                            💡 Tip: Enter the factual/statutory point illustrated by this episode. Consolidated statutory text, holdings, and citators are managed in Tab 4.
                          </p>
                        </div>

                        {/* Paragraph Pinpoints */}
                        <div className="space-y-2 pt-2 border-t border-emerald-500/10">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono text-emerald-300 uppercase font-bold">
                              Paragraph Pinpoints (¶Para: Proposition)
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const epList = ensureEpisodes();
                                const currentPinpoints = epList[idx].layers?.advocate?.pinpoints || [];
                                epList[idx] = {
                                  ...epList[idx],
                                  layers: {
                                    ...epList[idx].layers,
                                    advocate: { ...epList[idx].layers?.advocate, pinpoints: [...currentPinpoints, { proposition: '', para: 8 }] },
                                  },
                                };
                                setCaseData({ ...caseData, episodes: epList });
                              }}
                              className="text-[10px] font-mono text-emerald-400 hover:text-white uppercase font-bold cursor-pointer"
                            >
                              + Add Pinpoint
                            </button>
                          </div>

                          {(ep.layers?.advocate?.pinpoints || []).map((p: any, pIdx: number) => (
                            <div key={pIdx} className="flex items-center gap-2">
                              <span className="text-xs font-mono text-emerald-300">¶</span>
                              <input
                                type="number"
                                value={p.para || 8}
                                onChange={(e) => {
                                  const epList = ensureEpisodes();
                                  const currentPinpoints = [...(epList[idx].layers?.advocate?.pinpoints || [])];
                                  currentPinpoints[pIdx] = { ...currentPinpoints[pIdx], para: parseInt(e.target.value) || 1 };
                                  epList[idx] = {
                                    ...epList[idx],
                                    layers: {
                                      ...epList[idx].layers,
                                      advocate: { ...epList[idx].layers?.advocate, pinpoints: currentPinpoints },
                                    },
                                  };
                                  setCaseData({ ...caseData, episodes: epList });
                                }}
                                className="w-16 bg-[#0A0C10] border border-emerald-500/30 text-xs text-white p-2 rounded-xs font-mono"
                                placeholder="Para"
                              />
                              <input
                                type="text"
                                value={p.proposition || ''}
                                onChange={(e) => {
                                  const epList = ensureEpisodes();
                                  const currentPinpoints = [...(epList[idx].layers?.advocate?.pinpoints || [])];
                                  currentPinpoints[pIdx] = { ...currentPinpoints[pIdx], proposition: e.target.value };
                                  epList[idx] = {
                                    ...epList[idx],
                                    layers: {
                                      ...epList[idx].layers,
                                      advocate: { ...epList[idx].layers?.advocate, pinpoints: currentPinpoints },
                                    },
                                  };
                                  setCaseData({ ...caseData, episodes: epList });
                                }}
                                className="flex-1 bg-[#0A0C10] border border-emerald-500/30 text-xs text-white p-2 rounded-xs"
                                placeholder="Legal proposition established in this paragraph..."
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const epList = ensureEpisodes();
                                  const currentPinpoints = (epList[idx].layers?.advocate?.pinpoints || []).filter((_: any, i: number) => i !== pIdx);
                                  epList[idx] = {
                                    ...epList[idx],
                                    layers: {
                                      ...epList[idx].layers,
                                      advocate: { ...epList[idx].layers?.advocate, pinpoints: currentPinpoints },
                                    },
                                  };
                                  setCaseData({ ...caseData, episodes: epList });
                                }}
                                className="text-xs text-red-400 hover:text-red-300 font-mono px-2 py-1 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* TAB 3: STUDENT FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="bg-[#121520] border border-sky-500/30 p-6 rounded-xs space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <h3 className="text-sm font-mono font-bold text-sky-400 uppercase tracking-wider">
                  Student Mode Revision Flashcards
                </h3>
              </div>
              <p className="text-xs text-[#a9a49a]">
                These interactive Q&A cards appear at the end of the case in <strong>Student Mode</strong> to help law students memorize core ratio and exam issues.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const current = caseData.flashcards || [];
                setCaseData({
                  ...caseData,
                  flashcards: [...current, { q: 'What is the primary holding?', a: 'The Court held that...' }],
                });
              }}
              className="px-4 py-2 bg-sky-400 hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all cursor-pointer shadow-md self-start sm:self-auto"
            >
              + Add Flashcard
            </button>
          </div>

          <div className="space-y-4">
            {(caseData.flashcards || []).length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-xs text-xs font-mono text-white/50">
                No flashcards created yet. Click "+ Add Flashcard" to add revision questions for students.
              </div>
            ) : (
              (caseData.flashcards || []).map((card, cIdx) => (
                <div key={cIdx} className="p-4 bg-black/40 border border-sky-500/20 rounded-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-[10px] font-mono font-bold text-sky-300 uppercase">
                      Flashcard #{cIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (caseData.flashcards || []).filter((_, i) => i !== cIdx);
                        setCaseData({ ...caseData, flashcards: updated });
                      }}
                      className="text-xs text-red-400 hover:text-red-300 font-mono cursor-pointer"
                    >
                      ✕ Delete Flashcard
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={card.q}
                      onChange={(e) => {
                        const updated = [...(caseData.flashcards || [])];
                        updated[cIdx] = { ...updated[cIdx], q: e.target.value };
                        setCaseData({ ...caseData, flashcards: updated });
                      }}
                      className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white font-medium p-2.5 rounded-xs"
                      placeholder="e.g. What was the central constitutional issue?"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-emerald-300 uppercase mb-1">
                      Answer / Verified Judicial Reasoning
                    </label>
                    <textarea
                      rows={2}
                      value={card.a}
                      onChange={(e) => {
                        const updated = [...(caseData.flashcards || [])];
                        updated[cIdx] = { ...updated[cIdx], a: e.target.value };
                        setCaseData({ ...caseData, flashcards: updated });
                      }}
                      className="w-full bg-[#0A0C10] border border-emerald-500/30 text-xs text-emerald-100 p-2.5 rounded-xs font-serif italic"
                      placeholder="e.g. The Court ruled that fundamental rights are not silos..."
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ADVOCATE REFERENCE & CITATIONS (5-PART CONSOLIDATED BLOCK) */}
      {activeTab === 'history' && (() => {
        const advRef = caseData.advocateReference || {};
        const statutoryText = advRef.statutoryText || [];
        const holdings = advRef.holdings || [];
        const precedents = advRef.precedents || [];
        const citatorHistory = advRef.citatorHistory || [];
        const parallelCitations: string[] = advRef.parallelCitations || ((caseData as any).citations?.parallel || []);
        const citatorDisclaimer = advRef.citatorDisclaimer ||
          "These are the citator entries recorded in this report and may not be complete or current. Verify this case's present status through a live citator (SCC Online, Manupatra, or equivalent) before relying on it in an active matter.";

        const updateAdvRef = (partial: Partial<import('@/types').AdvocateReference>) => {
          const updatedRef = { ...advRef, ...partial };
          setCaseData({ ...caseData, advocateReference: updatedRef });
        };

        return (
          <div className="bg-[#121520] border border-emerald-500/30 p-6 rounded-xs space-y-8 shadow-xl">
            {/* Header */}
            <div className="pb-5 border-b border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-base font-anton text-white uppercase tracking-wider">
                  Consolidated Advocate Reference Studio
                </h3>
              </div>
              <p className="text-xs text-[#a9a49a] max-w-2xl leading-relaxed">
                Working citation toolkit for practicing lawyers. Populates the 5 consolidated reference parts rendered at the conclusion of Advocate mode. Every line traces directly to certified court record.
              </p>
            </div>

            {/* PART 1: STATUTORY TEXT AS REPRODUCED IN THE JUDGMENT */}
            <div className="p-5 bg-black/40 border border-emerald-500/20 rounded-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">1 ·</span>
                    <h4 className="font-anton text-sm text-white uppercase tracking-wider">
                      Statutory Text As Reproduced In The Judgment
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#a9a49a]">
                    Quote, verbatim, any section(s) of law the judgment reproduces in full.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateAdvRef({
                      statutoryText: [...statutoryText, { statute: '', text: '' }],
                    });
                  }}
                  className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase rounded-xs cursor-pointer self-start sm:self-auto"
                >
                  + Add Statute Quote
                </button>
              </div>

              {statutoryText.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-white/10 rounded-xs text-xs font-mono text-white/40">
                  No verbatim statutory quotes added yet. (Omitted if none quoted in judgment).
                </div>
              ) : (
                <div className="space-y-4">
                  {statutoryText.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#0A0C10] border border-white/10 rounded-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase">
                          Statute #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = statutoryText.filter((_, i) => i !== idx);
                            updateAdvRef({ statutoryText: updated });
                          }}
                          className="text-xs text-red-400 hover:text-red-300 font-mono cursor-pointer"
                        >
                          ✕ Delete
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                          Act & Section Header (e.g. Section 125, Code of Criminal Procedure, 1973)
                        </label>
                        <input
                          type="text"
                          value={item.statute}
                          onChange={(e) => {
                            const updated = [...statutoryText];
                            updated[idx] = { ...updated[idx], statute: e.target.value };
                            updateAdvRef({ statutoryText: updated });
                          }}
                          placeholder="e.g. Section 125, Code of Criminal Procedure, 1973"
                          className="w-full bg-[#121520] border border-white/15 text-xs text-white p-2 rounded-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-emerald-300 uppercase mb-1">
                          Verbatim Quoted Text (Reproduced exactly as in judgment)
                        </label>
                        <textarea
                          rows={3}
                          value={item.text}
                          onChange={(e) => {
                            const updated = [...statutoryText];
                            updated[idx] = { ...updated[idx], text: e.target.value };
                            updateAdvRef({ statutoryText: updated });
                          }}
                          placeholder="&ldquo;Quote section text verbatim...&rdquo;"
                          className="w-full bg-[#121520] border border-emerald-500/20 text-xs text-[#dedad2] p-2.5 rounded-xs font-serif leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PART 2: THE COURT'S ENUMERATED HOLDINGS */}
            <div className="p-5 bg-black/40 border border-emerald-500/20 rounded-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">2 ·</span>
                    <h4 className="font-anton text-sm text-white uppercase tracking-wider">
                      The Court&apos;s Enumerated Holdings
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#a9a49a]">
                    List numbered conclusions with real pinpoint citations (SCR/SCC page or paragraph). Keep 1 line each.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextNum = String(holdings.length + 1);
                    updateAdvRef({
                      holdings: [...holdings, { number: nextNum, holding: '', pinpoint: '' }],
                    });
                  }}
                  className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase rounded-xs cursor-pointer self-start sm:self-auto"
                >
                  + Add Holding
                </button>
              </div>

              {holdings.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-white/10 rounded-xs text-xs font-mono text-white/40">
                  No enumerated holdings added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {holdings.map((h, idx) => (
                    <div key={idx} className="p-3 bg-[#0A0C10] border border-white/10 rounded-xs flex flex-col md:flex-row items-start md:items-center gap-3">
                      <div className="w-16">
                        <label className="block text-[9px] font-mono text-[#a9a49a] uppercase">Point #</label>
                        <input
                          type="text"
                          value={h.number}
                          onChange={(e) => {
                            const updated = [...holdings];
                            updated[idx] = { ...updated[idx], number: e.target.value };
                            updateAdvRef({ holdings: updated });
                          }}
                          className="w-full bg-[#121520] border border-white/15 text-xs text-center font-mono font-bold text-white p-2 rounded-xs"
                          placeholder="1"
                        />
                      </div>

                      <div className="flex-1 w-full">
                        <label className="block text-[9px] font-mono text-[#a9a49a] uppercase">Holding Summary (1 Line)</label>
                        <input
                          type="text"
                          value={h.holding}
                          onChange={(e) => {
                            const updated = [...holdings];
                            updated[idx] = { ...updated[idx], holding: e.target.value };
                            updateAdvRef({ holdings: updated });
                          }}
                          placeholder="Authoritative holding statement..."
                          className="w-full bg-[#121520] border border-white/15 text-xs text-white p-2 rounded-xs"
                        />
                      </div>

                      <div className="w-full md:w-48">
                        <label className="block text-[9px] font-mono text-emerald-300 uppercase">Pinpoint Citation</label>
                        <input
                          type="text"
                          value={h.pinpoint}
                          onChange={(e) => {
                            const updated = [...holdings];
                            updated[idx] = { ...updated[idx], pinpoint: e.target.value };
                            updateAdvRef({ holdings: updated });
                          }}
                          placeholder="e.g. 865H, 866A-C"
                          className="w-full bg-[#121520] border border-emerald-500/30 text-xs font-mono text-emerald-300 p-2 rounded-xs"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = holdings.filter((_, i) => i !== idx);
                          updateAdvRef({ holdings: updated });
                        }}
                        className="text-xs text-red-400 hover:text-red-300 font-mono px-2 py-1 cursor-pointer self-end md:self-center mt-2 md:mt-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PART 3: PRECEDENTS DISCUSSED IN THIS JUDGMENT */}
            <div className="p-5 bg-black/40 border border-emerald-500/20 rounded-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">3 ·</span>
                    <h4 className="font-anton text-sm text-white uppercase tracking-wider">
                      Precedents Discussed In This Judgment
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#a9a49a]">
                    Table of cases the court engaged with: Case Name — Citation — How current judgment treated it.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateAdvRef({
                      precedents: [...precedents, { caseName: '', citation: '', treatment: 'Affirmed' }],
                    });
                  }}
                  className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase rounded-xs cursor-pointer self-start sm:self-auto"
                >
                  + Add Precedent
                </button>
              </div>

              {precedents.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-white/10 rounded-xs text-xs font-mono text-white/40">
                  No precedents discussed added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {precedents.map((p, idx) => (
                    <div key={idx} className="p-3 bg-[#0A0C10] border border-white/10 rounded-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-4">
                        <label className="block text-[9px] font-mono text-[#a9a49a] uppercase">Case Title</label>
                        <input
                          type="text"
                          value={p.caseName}
                          onChange={(e) => {
                            const updated = [...precedents];
                            updated[idx] = { ...updated[idx], caseName: e.target.value };
                            updateAdvRef({ precedents: updated });
                          }}
                          placeholder="e.g. Bai Tahira v. Ali Hussain"
                          className="w-full bg-[#121520] border border-white/15 text-xs text-white p-2 rounded-xs font-serif font-bold"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-[9px] font-mono text-[#a9a49a] uppercase">Citation</label>
                        <input
                          type="text"
                          value={p.citation}
                          onChange={(e) => {
                            const updated = [...precedents];
                            updated[idx] = { ...updated[idx], citation: e.target.value };
                            updateAdvRef({ precedents: updated });
                          }}
                          placeholder="e.g. [1979] 2 SCR 75"
                          className="w-full bg-[#121520] border border-white/15 text-xs font-mono text-white p-2 rounded-xs"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-[9px] font-mono text-emerald-300 uppercase">Treatment Note / Verb</label>
                        <input
                          type="text"
                          value={p.treatment}
                          onChange={(e) => {
                            const updated = [...precedents];
                            updated[idx] = { ...updated[idx], treatment: e.target.value };
                            updateAdvRef({ precedents: updated });
                          }}
                          placeholder="e.g. Affirmed as correctly decided / Applied / Referred to"
                          className="w-full bg-[#121520] border border-emerald-500/30 text-xs text-white p-2 rounded-xs"
                        />
                      </div>

                      <div className="md:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = precedents.filter((_, i) => i !== idx);
                            updateAdvRef({ precedents: updated });
                          }}
                          className="text-xs text-red-400 hover:text-red-300 font-mono px-2 py-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PART 4: SUBSEQUENT CITATOR HISTORY & MANDATORY NOTICE */}
            <div className="p-5 bg-black/40 border border-emerald-500/20 rounded-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">4 ·</span>
                    <h4 className="font-anton text-sm text-white uppercase tracking-wider">
                      Subsequent Citator History
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#a9a49a]">
                    Reproduce recorded citator metadata plainly (e.g. F 1986 SC 587 (4)).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateAdvRef({
                      citatorHistory: [...citatorHistory, { code: 'F (Followed)', citation: '', points: '(4)' }],
                    });
                  }}
                  className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase rounded-xs cursor-pointer self-start sm:self-auto"
                >
                  + Add Citator Entry
                </button>
              </div>

              {citatorHistory.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-white/10 rounded-xs text-xs font-mono text-white/40">
                  No citator history added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {citatorHistory.map((c, idx) => (
                    <div key={idx} className="p-3 bg-[#0A0C10] border border-white/10 rounded-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-4">
                        <label className="block text-[9px] font-mono text-emerald-300 uppercase">Code / Verb</label>
                        <input
                          type="text"
                          value={c.code}
                          onChange={(e) => {
                            const updated = [...citatorHistory];
                            updated[idx] = { ...updated[idx], code: e.target.value };
                            updateAdvRef({ citatorHistory: updated });
                          }}
                          placeholder="e.g. F (Followed) / RF (Referred) / D (Distinguished)"
                          className="w-full bg-[#121520] border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300 p-2 rounded-xs"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-[9px] font-mono text-[#a9a49a] uppercase">Citation</label>
                        <input
                          type="text"
                          value={c.citation}
                          onChange={(e) => {
                            const updated = [...citatorHistory];
                            updated[idx] = { ...updated[idx], citation: e.target.value };
                            updateAdvRef({ citatorHistory: updated });
                          }}
                          placeholder="e.g. 1986 SC 587"
                          className="w-full bg-[#121520] border border-white/15 text-xs font-mono text-white p-2 rounded-xs"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-[9px] font-mono text-[#a9a49a] uppercase">Point(s)</label>
                        <input
                          type="text"
                          value={c.points || ''}
                          onChange={(e) => {
                            const updated = [...citatorHistory];
                            updated[idx] = { ...updated[idx], points: e.target.value };
                            updateAdvRef({ citatorHistory: updated });
                          }}
                          placeholder="e.g. (4) or (5, 6)"
                          className="w-full bg-[#121520] border border-white/15 text-xs font-mono text-white p-2 rounded-xs"
                        />
                      </div>

                      <div className="md:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = citatorHistory.filter((_, i) => i !== idx);
                            updateAdvRef({ citatorHistory: updated });
                          }}
                          className="text-xs text-red-400 hover:text-red-300 font-mono px-2 py-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mandatory Citator Notice Editor */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <label className="block text-[10px] font-mono text-amber-300 uppercase font-bold">
                  ⚠️ Mandatory Citator Verification Disclaimer Notice
                </label>
                <textarea
                  rows={2}
                  value={citatorDisclaimer}
                  onChange={(e) => {
                    updateAdvRef({ citatorDisclaimer: e.target.value });
                  }}
                  className="w-full bg-[#0A0C10] border border-amber-500/30 text-xs text-amber-200 p-2.5 rounded-xs font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* PART 5: FULL PARALLEL CITATION INDEX */}
            <div className="p-5 bg-black/40 border border-emerald-500/20 rounded-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">5 ·</span>
                    <h4 className="font-anton text-sm text-white uppercase tracking-wider">
                      Full Parallel Citation Index
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#a9a49a]">
                    List every equivalent/parallel citation provided in the report header (AIR, SCR, SCC, SCALE, BOM LR, DMC, etc.).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateAdvRef({
                      parallelCitations: [...parallelCitations, ''],
                    });
                  }}
                  className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase rounded-xs cursor-pointer self-start sm:self-auto"
                >
                  + Add Parallel Citation
                </button>
              </div>

              {/* Bulk paste helper */}
              <div>
                <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                  Quick Bulk Edit (Separated by &ldquo;·&rdquo; or comma or newlines)
                </label>
                <textarea
                  rows={2}
                  value={parallelCitations.join(' · ')}
                  onChange={(e) => {
                    const parsed = e.target.value
                      .split(/[·,\n]+/)
                      .map((s) => s.trim())
                      .filter(Boolean);
                    updateAdvRef({ parallelCitations: parsed });
                  }}
                  placeholder="e.g. 1985 AIR 945 · 1985 SCR (3) 844 · 1985 (2) SCC 556"
                  className="w-full bg-[#0A0C10] border border-white/15 text-xs font-mono text-emerald-200 p-2.5 rounded-xs"
                />
              </div>

              {parallelCitations.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {parallelCitations.map((c: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0A0C10] border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-xs"
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = parallelCitations.filter((_: string, i: number) => i !== idx);
                          updateAdvRef({ parallelCitations: updated });
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 5: LEGAL BRIEF */}
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

      {/* TAB 4: VISUAL ASSETS & AI MULTI-PROMPT STUDIO */}
      {activeTab === 'images' && (
        <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-8 shadow-2xl">
          {/* Header & Global Studio Actions */}
          <div className="pb-5 border-b border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <h3 className="text-base font-anton text-white uppercase tracking-wider">
                    Visual Asset Studio · 3 Key Case Visuals
                  </h3>
                </div>
                <p className="text-xs text-[#a9a49a] max-w-2xl">
                  Each case features 3 targeted visuals corresponding to its narrative structure: the <strong>Hero Billboard Cover</strong>, the <strong>Episode 02 Archival Exhibit</strong>, and the <strong>Episode 07 Courtroom Verdict</strong>.
                </p>
              </div>

              {/* Global Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 1. Auto-Generate AI Prompts with LLM */}
                <button
                  type="button"
                  onClick={() => handleGenerateSmartPrompts()}
                  disabled={generatingSmartPrompts || batchGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5D061] hover:from-white hover:to-white text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[#D4AF37]/30"
                  title="Use Groq / Gemini AI to craft 3 bespoke prompts based on the exact case facts and scenes"
                >
                  {generatingSmartPrompts ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Crafting Prompts with AI...</span>
                    </>
                  ) : (
                    <>
                      <span>🧠</span>
                      <span>Auto-Generate AI Prompts (Groq / Gemini)</span>
                    </>
                  )}
                </button>

                {/* 2. Reset to Baseline Prompts */}
                <button
                  type="button"
                  onClick={handleResetBaselinePrompts}
                  disabled={generatingSmartPrompts || batchGenerating}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/15 text-white font-mono text-xs uppercase tracking-wider rounded-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer hover:border-[#D4AF37]"
                  title="Reset to clean baseline generic prompts for this case"
                >
                  <span>↺</span>
                  <span>Reset Baseline Prompts</span>
                </button>

                {/* 3. Batch Generate All 3 AI Images */}
                <button
                  type="button"
                  onClick={handleGenerateAllThree}
                  disabled={batchGenerating || !!generatingTarget}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[#D4AF37]/30"
                >
                  {batchGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>{batchProgress || 'Generating Visuals...'}</span>
                    </>
                  ) : (
                    <>
                      <span>⚡</span>
                      <span>Generate All 3 AI Images</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {smartPromptProvider && (
            <div className="p-3 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] rounded-xs text-xs font-mono flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span>{smartPromptProvider}</span>
              </div>
              <span className="text-[10px] text-white/60">Prompts updated for all 3 scene positions!</span>
            </div>
          )}

          {batchProgress && (
            <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xs text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>{batchProgress}</span>
            </div>
          )}

          {/* 1. Hero Billboard Cover Poster (Top Header & Browse Cards) */}
          <div className="p-5 bg-black/50 border border-white/10 rounded-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#D4AF37] text-black font-mono font-bold text-[10px] uppercase rounded-2xs">
                  Hero Cover
                </span>
                <span className="text-xs font-mono font-bold text-white uppercase">
                  1. Case Billboard Poster (Top Hero Banner & Reel Cards)
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/50 truncate max-w-xs">
                {caseData.bannerImage || caseData.poster?.src || 'No image set'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {/* Image Preview */}
              <div className="space-y-2">
                <div className="aspect-[16/9] bg-[#0E1016] border border-white/15 rounded-xs overflow-hidden relative flex items-center justify-center group shadow-md">
                  <img
                    src={caseData.bannerImage || caseData.poster?.src || '/images/cases/ghost-case.jpg'}
                    alt="Hero Poster Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cases/ghost-case.jpg';
                    }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#8c887e] text-center">Placement: Top Case Banner & Reel Cards</p>
              </div>

              {/* Prompt & Actions */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-[#a9a49a] uppercase">AI Visual Prompt (Editable)</label>
                    <button
                      type="button"
                      onClick={() => copyPrompt('poster', prompts.poster || posterPrompt)}
                      className="text-[10px] font-mono text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{copiedPromptId === 'poster' ? '✓ Copied!' : '📋 Copy Prompt'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={prompts.poster}
                    onChange={(e) => handlePromptTextChange('poster', e.target.value)}
                    id="prompt-poster"
                    className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2.5 rounded-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Dual Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A: Gemini AI */}
                  <button
                    type="button"
                    disabled={generatingTarget === 'poster' || batchGenerating}
                    onClick={() => {
                      const p = (document.getElementById('prompt-poster') as HTMLTextAreaElement)?.value || prompts.poster || posterPrompt;
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
                      disabled={uploadingTarget === 'poster' || batchGenerating}
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
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono font-bold text-[10px] uppercase rounded-2xs">
                  Episode 02
                </span>
                <span className="text-xs font-mono font-bold text-white uppercase">
                  2. Archival Exhibit (Evidence / Police Docket / Newspaper)
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/50 truncate max-w-xs">
                {caseData.panels?.[1]?.photoExhibitSrc || caseData.panels?.[1]?.image || (caseData as any).episodes?.[1]?.exhibit?.image?.src || 'No exhibit image'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {/* Image Preview */}
              <div className="space-y-2">
                <div className="aspect-[16/9] bg-[#0E1016] border border-white/15 rounded-xs overflow-hidden relative flex items-center justify-center group shadow-md">
                  <img
                    src={caseData.panels?.[1]?.photoExhibitSrc || caseData.panels?.[1]?.image || (caseData as any).episodes?.[1]?.exhibit?.image?.src || '/images/cases/nanavati_portrait.jpg'}
                    alt="Exhibit Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cases/nanavati_portrait.jpg';
                    }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#8c887e] text-center">Placement: Inside Episode 02 Evidence Layer</p>
              </div>

              {/* Prompt & Actions */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-[#a9a49a] uppercase">AI Visual Prompt (Editable)</label>
                    <button
                      type="button"
                      onClick={() => copyPrompt('exhibit', prompts.exhibit || exhibitPrompt)}
                      className="text-[10px] font-mono text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{copiedPromptId === 'exhibit' ? '✓ Copied!' : '📋 Copy Prompt'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={prompts.exhibit}
                    onChange={(e) => handlePromptTextChange('exhibit', e.target.value)}
                    id="prompt-exhibit"
                    className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2.5 rounded-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Dual Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A: Gemini AI */}
                  <button
                    type="button"
                    disabled={generatingTarget === 'exhibit' || batchGenerating}
                    onClick={() => {
                      const p = (document.getElementById('prompt-exhibit') as HTMLTextAreaElement)?.value || prompts.exhibit || exhibitPrompt;
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
                      disabled={uploadingTarget === 'exhibit' || batchGenerating}
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
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono font-bold text-[10px] uppercase rounded-2xs">
                  Episode 07
                </span>
                <span className="text-xs font-mono font-bold text-white uppercase">
                  3. Courtroom Verdict (Judicial Bench & Decision Moment)
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/50 truncate max-w-xs">
                {caseData.panels?.[6]?.photoExhibitSrc || caseData.panels?.[6]?.image || (caseData as any).episodes?.[6]?.image?.src || 'No verdict image'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {/* Image Preview */}
              <div className="space-y-2">
                <div className="aspect-[16/9] bg-[#0E1016] border border-white/15 rounded-xs overflow-hidden relative flex items-center justify-center group shadow-md">
                  <img
                    src={caseData.panels?.[6]?.photoExhibitSrc || caseData.panels?.[6]?.image || (caseData as any).episodes?.[6]?.image?.src || '/images/cases/ghost_court_verdict.jpg'}
                    alt="Verdict Scene Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cases/ghost_court_verdict.jpg';
                    }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#8c887e] text-center">Placement: Inside Episode 07 Verdict & Ratio</p>
              </div>

              {/* Prompt & Actions */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-[#a9a49a] uppercase">AI Visual Prompt (Editable)</label>
                    <button
                      type="button"
                      onClick={() => copyPrompt('verdict', prompts.verdict || verdictPrompt)}
                      className="text-[10px] font-mono text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{copiedPromptId === 'verdict' ? '✓ Copied!' : '📋 Copy Prompt'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={prompts.verdict}
                    onChange={(e) => handlePromptTextChange('verdict', e.target.value)}
                    id="prompt-verdict"
                    className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2.5 rounded-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Dual Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A: Gemini AI */}
                  <button
                    type="button"
                    disabled={generatingTarget === 'verdict' || batchGenerating}
                    onClick={() => {
                      const p = (document.getElementById('prompt-verdict') as HTMLTextAreaElement)?.value || prompts.verdict || verdictPrompt;
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
                      disabled={uploadingTarget === 'verdict' || batchGenerating}
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

