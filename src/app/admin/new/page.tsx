'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Episode, PersonaItem } from '@/types';

const DEFAULT_EPISODES: Episode[] = [
  {
    n: 1,
    kicker: 'EPISODE 01 · THE PREMISE',
    title: 'THE GENESIS OF THE DISPUTE',
    layers: {
      story: {
        blocks: [{ type: 'para', text: '', source: { tier: 'AMBER' } }],
      },
    },
    endHook: 'The controversy escalated to the next judicial milestone.',
  },
  {
    n: 2,
    kicker: 'EPISODE 02 · DRAMATIS PERSONAE',
    title: 'THE PARTIES & CONFLICTING INTERESTS',
    layers: {
      story: {
        blocks: [{ type: 'para', text: '', source: { tier: 'AMBER' } }],
      },
    },
    endHook: 'What followed next in the proceedings?',
  },
  {
    n: 3,
    kicker: 'EPISODE 03 · THE TRIAL & INQUIRY',
    title: 'PROCEDURAL ORDERS & INVESTIGATIVE RECORD',
    layers: {
      story: {
        blocks: [{ type: 'para', text: '', source: { tier: 'AMBER' } }],
      },
    },
    endHook: 'What followed next in the proceedings?',
  },
  {
    n: 4,
    kicker: 'EPISODE 04 · THE LEGAL CONTROVERSY',
    title: 'THE CENTRAL CONSTITUTIONAL QUESTION',
    layers: {
      story: {
        blocks: [{ type: 'para', text: '', source: { tier: 'AMBER' } }],
      },
    },
    endHook: 'The rival contentions were framed before the bench.',
  },
  {
    n: 5,
    kicker: 'EPISODE 05 · COURTROOM ARGUMENTS',
    title: 'CONTENTIONS AT THE BAR',
    layers: {
      story: {
        blocks: [{ type: 'para', text: '', source: { tier: 'AMBER' } }],
      },
    },
    endHook: 'The bench retired to formulate its authoritative doctrine.',
  },
  {
    n: 6,
    kicker: 'EPISODE 06 · JUDICIAL DELIBERATION',
    title: 'BENCH REASONING & DOCTRINAL TESTS',
    layers: {
      story: {
        blocks: [{ type: 'para', text: '', source: { tier: 'AMBER' } }],
      },
    },
    endHook: 'The operative verdict was delivered in open court.',
  },
  {
    n: 7,
    kicker: 'EPISODE 07 · OPERATIVE VERDICT',
    title: 'THE BINDING HOLDING & DECREE',
    layers: {
      story: {
        blocks: [{ type: 'para', text: '', source: { tier: 'AMBER' } }],
      },
    },
    endHook: 'How does this judgment shape Indian jurisprudence going forward?',
  },
  {
    n: 8,
    kicker: 'EPISODE 08 · PRECEDENTIAL LEGACY',
    title: 'THE DOCTRINE GOING FORWARD',
    layers: {
      story: {
        blocks: [{ type: 'para', text: '', source: { tier: 'AMBER' } }],
      },
    },
    endHook: 'The precedent remains binding law under Article 141.',
  },
];

export default function NewCasePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterFileRef = useRef<HTMLInputElement>(null);
  const exhibitFileRef = useRef<HTMLInputElement>(null);
  const verdictFileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    blurb: '',
    citation: '',
    court: 'Supreme Court of India',
    year: new Date().getFullYear() - 1,
    genre: 'constitutional' as 'crime' | 'consumer' | 'constitutional' | 'cyber' | 'tort',
    statuteSections: '',
    factsSummary: '',
    judgmentUrl: '',
    reviewer: 'Adv. Girish Kr. Srivastava',
    enrolmentNumber: 'D/842/1991',
    rank: 1,
    makeTrendingTop10: true,
  });

  const [episodes, setEpisodes] = useState<Episode[]>(DEFAULT_EPISODES);
  const [selectedEpTab, setSelectedEpTab] = useState<number>(0);

  // Visual Assets & Images State
  const [images, setImages] = useState<{
    poster: string;
    exhibit: string;
    verdict: string;
  }>({
    poster: '',
    exhibit: '',
    verdict: '',
  });
  const [uploadingSlot, setUploadingSlot] = useState<'poster' | 'exhibit' | 'verdict' | null>(null);

  const [personas, setPersonas] = useState<PersonaItem[]>([
    { name: '', role: 'Petitioner / Accused', tag: 'Aggrieved Party', description: '', badgeEmoji: '⚖️' },
    { name: '', role: 'Respondent / State', tag: 'Opposing Authority', description: '', badgeEmoji: '🏛️' },
    { name: '', role: 'Key Witness / Eyewitness', tag: 'Primary Evidence', description: '', badgeEmoji: '👤' },
  ]);

  // Chronological Case Timeline ("What Changed Since")
  const [timeline, setTimeline] = useState<{ year: number; event: string }[]>([]);

  const addTimelineEvent = () => {
    setTimeline((prev) => [
      ...prev,
      { year: formData.year || new Date().getFullYear(), event: '' },
    ]);
  };

  const updateTimelineEvent = (index: number, field: 'year' | 'event', val: any) => {
    setTimeline((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const removeTimelineEvent = (index: number) => {
    setTimeline((prev) => prev.filter((_, idx) => idx !== index));
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // OCR Auto-Fill State
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const updateEpisodeField = (idx: number, updates: Partial<Episode>) => {
    setEpisodes((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], ...updates };
      return updated;
    });
  };

  const updateEpisodeNarrative = (idx: number, text: string) => {
    setEpisodes((prev) => {
      const updated = [...prev];
      const ep = updated[idx];
      const existingBlocks = ep.layers?.story?.blocks || [];
      const firstBlock = existingBlocks[0] || { type: 'para' as const, source: { tier: 'AMBER' as const } };
      updated[idx] = {
        ...ep,
        layers: {
          ...ep.layers,
          story: {
            ...ep.layers?.story,
            blocks: [{ ...firstBlock, text }],
          },
        },
      };
      return updated;
    });

    if (idx === 0) {
      setFormData((prev) => ({ ...prev, factsSummary: text }));
    }
  };

  const handleOcrFile = async (file: File | null, isSample = false) => {
    try {
      setOcrLoading(true);
      setError(null);
      setOcrSuccessMsg(null);

      let res: Response;
      if (isSample) {
        res = await fetch('/api/admin/ocr?sample=true');
      } else if (file) {
        const data = new FormData();
        data.append('file', file);
        res = await fetch('/api/admin/ocr', {
          method: 'POST',
          body: data,
        });
      } else {
        return;
      }

      const data = await res.json();
      if (!data.success || !data.case) {
        throw new Error(data.error || 'Failed to extract case details via OCR.');
      }

      const c = data.case;

      // Populate base form fields
      setFormData((prev) => ({
        ...prev,
        title: typeof c.title === 'string' ? c.title : (c.title?.en || prev.title),
        shortTitle: c.shortTitle || (typeof c.featuredHeroHook === 'string' ? c.featuredHeroHook : c.featuredHeroHook?.en) || prev.shortTitle,
        blurb: typeof c.blurb === 'string' ? c.blurb : (c.blurb?.en || c.featuredHeroDesc?.en || c.featuredHeroHook?.en || c.brief?.facts?.en?.slice(0, 260) || prev.blurb),
        citation: c.citation || prev.citation,
        court: c.court || prev.court,
        year: typeof c.year === 'number' ? c.year : (parseInt(c.year) || prev.year),
        genre: c.genre || prev.genre,
        statuteSections: c.brief?.chargesApplied?.join('; ') || c.categoryTag || prev.statuteSections,
        factsSummary: c.brief?.facts?.en || c.episodes?.[0]?.layers?.story?.blocks?.[0]?.text || prev.factsSummary,
        judgmentUrl: c.judgmentUrl || prev.judgmentUrl,
        reviewer: 'Adv. Girish Kr. Srivastava',
        enrolmentNumber: 'D/842/1991',
      }));

      // Populate all 8 episodes
      if (c.episodes && Array.isArray(c.episodes) && c.episodes.length > 0) {
        const extractedEpisodes: Episode[] = c.episodes.map((ep: any, idx: number) => {
          const defaultKickers = [
            'EPISODE 01 · THE PREMISE',
            'EPISODE 02 · DRAMATIS PERSONAE',
            'EPISODE 03 · THE TRIAL & INQUIRY',
            'EPISODE 04 · THE LEGAL CONTROVERSY',
            'EPISODE 05 · COURTROOM ARGUMENTS',
            'EPISODE 06 · JUDICIAL DELIBERATION',
            'EPISODE 07 · OPERATIVE VERDICT',
            'EPISODE 08 · PRECEDENTIAL LEGACY',
          ];
          const defaultTitles = [
            'THE GENESIS OF THE DISPUTE',
            'THE PARTIES & CONFLICTING INTERESTS',
            'PROCEDURAL ORDERS & INVESTIGATIVE RECORD',
            'THE CENTRAL CONSTITUTIONAL QUESTION',
            'CONTENTIONS AT THE BAR',
            'BENCH REASONING & DOCTRINAL TESTS',
            'THE BINDING HOLDING & DECREE',
            'THE DOCTRINE GOING FORWARD',
          ];

          const narrativeText =
            ep.layers?.story?.blocks?.[0]?.text ||
            (typeof ep.text === 'string' ? ep.text : '') ||
            (idx === 0 ? c.brief?.facts?.en || '' : '');

          return {
            n: idx + 1,
            kicker: ep.kicker || defaultKickers[idx] || `EPISODE 0${idx + 1}`,
            title: ep.title || defaultTitles[idx] || `Episode ${idx + 1}`,
            endHook: ep.endHook || (idx < 7 ? 'What followed next in the proceedings?' : 'The precedent remains binding law under Article 141.'),
            layers: {
              story: {
                blocks: [
                  {
                    type: 'para' as const,
                    text: narrativeText,
                    source: { tier: 'AMBER' as const, para: idx + 1 },
                  },
                ],
              },
            },
          };
        });

        // Ensure array has 8 episodes
        while (extractedEpisodes.length < 8) {
          const idx = extractedEpisodes.length;
          extractedEpisodes.push(DEFAULT_EPISODES[idx]);
        }

        setEpisodes(extractedEpisodes);
      }

      // Populate Personas
      if (c.personas && Array.isArray(c.personas) && c.personas.length > 0) {
        setPersonas(c.personas);
      }

      // Populate Chronological Timeline / What Changed Since
      if (c.timeline && Array.isArray(c.timeline) && c.timeline.length > 0) {
        setTimeline(c.timeline);
      }

      // Populate Images if present
      if (c.poster?.src || c.bannerImage || c.exhibitImage || c.verdictImage) {
        setImages((prev) => ({
          poster: c.poster?.src || c.bannerImage || prev.poster,
          exhibit: c.exhibitImage || prev.exhibit,
          verdict: c.verdictImage || prev.verdict,
        }));
      }

      setOcrSuccessMsg(`✓ Successfully auto-filled all 8 customizable episodes and case record from "${isSample ? 'Pleadings Sample Template PDF' : file?.name}" via Multimodal OCR.`);
    } catch (ocrErr: any) {
      console.error('OCR Ingestion error:', ocrErr);
      setError(ocrErr.message || 'Failed to auto-populate from PDF.');
    } finally {
      setOcrLoading(false);
    }
  };

  async function compressImageForUpload(
    file: File,
    maxWidth = 1024,
    maxHeight = 576,
    quality = 0.65
  ): Promise<{ blob: Blob; dataUrl: string; fileName: string }> {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        reject(new Error('SVG uploads are disallowed for security reasons. Please upload JPG, PNG, or WebP.'));
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

  const handleImageFile = async (file: File | null, slot: 'poster' | 'exhibit' | 'verdict') => {
    if (!file) return;
    try {
      setUploadingSlot(slot);
      setError(null);
      const { blob, fileName, dataUrl } = await compressImageForUpload(file);
      let finalUrl = dataUrl;

      try {
        const data = new FormData();
        data.append('file', blob, fileName);
        data.append(
          'slug',
          formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 50) : 'case'
        );
        data.append('type', slot);
        const upRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: data,
        });
        if (upRes.ok) {
          const upJson = await upRes.json();
          if (upJson.success && upJson.url) {
            finalUrl = upJson.url;
          }
        }
      } catch (uploadErr) {
        console.warn('Network upload fallback to Data URI:', uploadErr);
      }
      setImages((prev) => ({ ...prev, [slot]: finalUrl }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleSubmit = async (submitStatus: 'PUBLISHED' | 'ADMIN_REVIEW' = 'PUBLISHED') => {
    if (
      !formData.title.trim() ||
      !formData.court.trim() ||
      !formData.statuteSections.trim() ||
      !formData.reviewer.trim() ||
      !formData.enrolmentNumber.trim()
    ) {
      setError(
        'Please fill in all required fields: Title, Court, Statute/Sections, Reviewing Advocate, and Bar Enrolment Number.'
      );
      return;
    }

    const firstEpText = episodes[0]?.layers?.story?.blocks?.[0]?.text || formData.factsSummary;
    if (!firstEpText.trim()) {
      setError('Please provide the narrative text for Episode 01 (The Genesis of the Dispute).');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const titleStr = formData.title.trim();
      const safeSlug =
        titleStr
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '') || `case-${Date.now()}`;

      const validPersonas = personas.filter((p) => p.name.trim() || p.description.trim());

      const validTimeline = timeline
        .filter((t) => t.event && t.event.trim().length > 0)
        .map((t) => ({ year: Number(t.year) || formData.year, event: t.event.trim() }))
        .sort((a, b) => a.year - b.year);

      // Ensure every episode has a valid story block and attached image
      const formattedEpisodes = episodes.map((ep, idx) => {
        const text = ep.layers?.story?.blocks?.[0]?.text || (idx === 0 ? formData.factsSummary : '');
        const epImg =
          idx === 1 && images.exhibit
            ? { src: images.exhibit, alt: `Archival Exhibit for ${titleStr}`, provenance: 'archival' as const }
            : idx === 6 && images.verdict
            ? { src: images.verdict, alt: `Courtroom Verdict for ${titleStr}`, provenance: 'illustration' as const }
            : ep.image;

        return {
          ...ep,
          n: idx + 1,
          kicker: ep.kicker || `EPISODE 0${idx + 1}`,
          title: ep.title || `Episode ${idx + 1}`,
          image: epImg,
          layers: {
            story: {
              blocks: [
                {
                  type: 'para' as const,
                  text: text.trim(),
                  source: { tier: 'AMBER' as const, para: idx + 1 },
                },
              ],
            },
          },
          endHook: ep.endHook || (idx < 7 ? 'What followed next in the proceedings?' : 'Case dossier complete.'),
          personas: idx === 1 && validPersonas.length > 0 ? validPersonas : undefined,
        };
      });

      const posterObj = images.poster
        ? { src: images.poster, alt: `${titleStr} cover poster`, provenance: 'illustration' as const }
        : undefined;

      const resolvedBlurb =
        formData.blurb.trim() ||
        firstEpText.slice(0, 240).trim() ||
        `Landmark judicial proceedings and constitutional review in ${titleStr}.`;

      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: safeSlug,
          blurb: { en: resolvedBlurb, hi: resolvedBlurb },
          hook: resolvedBlurb,
          featuredHeroHook: { en: formData.shortTitle || titleStr, hi: formData.shortTitle || titleStr },
          featuredHeroDesc: { en: resolvedBlurb, hi: resolvedBlurb },
          factsSummary: firstEpText,
          rank: formData.makeTrendingTop10 ? formData.rank : 99,
          bannerImage: images.poster || undefined,
          poster: posterObj,
          exhibitImage: images.exhibit || undefined,
          verdictImage: images.verdict || undefined,
          publishStatus: submitStatus,
          status: submitStatus,
          timeline: validTimeline.length > 0 ? validTimeline : undefined,
          personas: validPersonas.length > 0 ? validPersonas : undefined,
          episodes: formattedEpisodes,
          brief: {
            facts: { en: formattedEpisodes[0]?.layers?.story?.blocks?.[0]?.text || formData.factsSummary, hi: '' },
            held: { en: formattedEpisodes[6]?.layers?.story?.blocks?.[0]?.text || '', hi: '' },
            reasoning: { en: formattedEpisodes[5]?.layers?.story?.blocks?.[0]?.text || '', hi: '' },
            whyItMatters: { en: formattedEpisodes[7]?.layers?.story?.blocks?.[0]?.text || '', hi: '' },
          },
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save case record.');
      }

      // Redirect cleanly (guaranteed never undefined)
      const targetSlug = data.case?.slug || data.slug || safeSlug;
      router.push(`/admin/cases/${targetSlug}`);
    } catch (err: unknown) {
      console.error('Case save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save case');
      setLoading(false);
    }
  };

  const activeEp = episodes[selectedEpTab] || episodes[0];
  const activeEpNarrative = activeEp?.layers?.story?.blocks?.[0]?.text || '';
  const isPersonaEpisode = selectedEpTab === 1;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <Link href="/admin" className="text-xs font-mono text-[#D4AF37] hover:underline mb-1 block">
            ← Back to Case Catalog
          </Link>
          <h1 className="font-anton text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Add New Landmark Case
          </h1>
          <p className="text-xs text-[#a9a49a]">
            Enter the verified facts and customize all 8 story episodes directly. No unwanted AI generation or pipeline overwrites.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-300 rounded-xs text-xs font-mono">
          ✕ {error}
        </div>
      )}

      {ocrSuccessMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-xs text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <span className="text-base">✓</span>
          <div>{ocrSuccessMsg}</div>
        </div>
      )}

      {/* Quick OCR Document Scanner Dropzone */}
      <div className="bg-gradient-to-r from-[#161B28] via-[#121520] to-[#161B28] border border-[#D4AF37]/40 p-5 rounded-xs space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xs bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-base text-[#D4AF37]">
              ⚡
            </span>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                Smart OCR Auto-Fill Engine
              </h3>
              <p className="text-xs text-[#a9a49a]">
                Upload a case PDF or judgment docket to extract all 8 episodes, kicker, headlines, and characters.
              </p>
            </div>
          </div>

          <Link
            href="/admin/ocr"
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#a9a49a] hover:text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all self-start sm:self-auto"
          >
            Open Standalone Studio ↗
          </Link>
        </div>

        <div
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) {
              handleOcrFile(e.dataTransfer.files[0], false);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xs p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
            dragActive
              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
              : 'border-white/15 bg-black/30 hover:border-[#D4AF37]/50 hover:bg-black/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/png,image/jpeg,image/webp"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleOcrFile(e.target.files[0], false);
              }
            }}
            className="hidden"
          />

          {ocrLoading ? (
            <div className="flex items-center gap-3 py-2">
              <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-wider animate-pulse">
                Extracting all 8 story episodes from document via OCR...
              </span>
            </div>
          ) : (
            <>
              <p className="text-xs text-white font-medium">
                Drag & drop Judgment PDF here or <span className="text-[#D4AF37] font-bold underline">browse file</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOcrFile(null, true);
                  }}
                  className="px-3 py-1 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xs text-[10px] font-mono uppercase tracking-wider transition-all"
                >
                  🧪 Test With Sample Template PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Case Ingestion & Episode Customization Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit('PUBLISHED'); }} className="space-y-6">
        {/* Step 1: Basic Case Information */}
        <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Step 1 · Basic Case Record & Citation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Case Title <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shreya Singhal v. Union of India"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Short / Editorial Name
              </label>
              <input
                type="text"
                placeholder="e.g. The Section 66A Free Speech Case"
                value={formData.shortTitle}
                onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Court <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Supreme Court of India"
                value={formData.court}
                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Year <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2020 })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Legal Genre <span className="text-[#E50914]">*</span>
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value as any })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-[#D4AF37] font-semibold px-3.5 py-2.5 rounded-xs focus:outline-none cursor-pointer"
              >
                <option value="constitutional">Constitutional Law</option>
                <option value="crime">Criminal / Crime Noir</option>
                <option value="cyber">Cyber & Tech Law</option>
                <option value="consumer">Consumer Protection</option>
                <option value="tort">Corporate & Tort Law</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Statute / Sections Involved <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Section 66A IT Act, Article 19(1)(a)"
                value={formData.statuteSections}
                onChange={(e) => setFormData({ ...formData, statuteSections: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Law Report Citation
              </label>
              <input
                type="text"
                placeholder="e.g. (2015) 5 SCC 1, AIR 2015 SC 1523"
                value={formData.citation}
                onChange={(e) => setFormData({ ...formData, citation: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Catalog Blurb / Editorial Story Hook */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase">
                Catalog Blurb / Story Hook <span className="text-[#E50914]">*</span>
              </label>
              <span className="text-[10px] font-mono text-[#D4AF37]">
                Displayed on Home Reel Cards & Search
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="e.g. When communications were completely suspended across Jammu & Kashmir, the Executive Editor of Kashmir Times challenged the blackout. In a landmark ruling, the Supreme Court declared that freedom of speech and trade over the internet are fundamental rights under Article 19."
              value={formData.blurb}
              onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
              className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white p-3 rounded-xs focus:outline-none leading-relaxed font-sans"
            />
            <p className="text-[10px] font-mono text-[#8c887e] mt-1">
              A punchy 1–3 sentence overview in simple, natural English explaining the core real-life conflict and what the court held.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Reviewing Advocate <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Adv. Girish Kr. Srivastava"
                value={formData.reviewer}
                onChange={(e) => setFormData({ ...formData, reviewer: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Bar Enrolment Number <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. D/842/1991"
                value={formData.enrolmentNumber}
                onChange={(e) => setFormData({ ...formData, enrolmentNumber: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
              Verified Public Judgment URL
            </label>
            <input
              type="url"
              placeholder="e.g. https://indiankanoon.org/doc/110813550/"
              value={formData.judgmentUrl}
              onChange={(e) => setFormData({ ...formData, judgmentUrl: e.target.value })}
              className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
            />
          </div>

          {/* Trending Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-black/40 border border-white/10 rounded-xs mt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-white">
              <input
                type="checkbox"
                checked={formData.makeTrendingTop10}
                onChange={(e) => setFormData({ ...formData, makeTrendingTop10: e.target.checked })}
                className="w-4 h-4 accent-[#D4AF37] rounded cursor-pointer"
              />
              <span>Feature on Top 10 Trending Shelf</span>
            </label>

            {formData.makeTrendingTop10 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#D4AF37]">Rank:</span>
                <select
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) })}
                  className="bg-[#121520] border border-[#D4AF37] text-[#D4AF37] font-bold text-xs px-2.5 py-1 rounded-xs focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      #{i + 1} Trending
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Chronological Case Timeline / What Changed Since */}
        <div className="bg-[#121520] border border-[#D4AF37]/30 p-6 rounded-xs space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Step 2 · Chronological Milestones (&ldquo;What Changed Since&rdquo;)
                </h2>
              </div>
              <p className="text-xs text-[#a9a49a] mt-0.5">
                Key milestones from inception, lower court orders, to the final landmark ruling and subsequent statutory shifts.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 rounded-xs">
                {timeline.length} {timeline.length === 1 ? 'Milestone' : 'Milestones'}
              </span>
              <button
                type="button"
                onClick={addTimelineEvent}
                className="px-2.5 py-1 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[#D4AF37] rounded-xs text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
              >
                <span>+</span> Add Milestone
              </button>
            </div>
          </div>

          {timeline.length === 0 ? (
            <div className="p-6 bg-black/30 border border-dashed border-white/10 rounded-xs text-center space-y-2">
              <span className="text-2xl">⏳</span>
              <p className="text-xs text-white/60 font-sans">
                No timeline milestones added yet.
              </p>
              <p className="text-[11px] text-[#8c887e]">
                Drop a judgment PDF into the OCR engine above to auto-extract genuine historical dates, or click below.
              </p>
              <button
                type="button"
                onClick={addTimelineEvent}
                className="mt-2 px-3 py-1.5 bg-[#D4AF37] hover:bg-white text-[#0E1016] rounded-xs text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>+</span> Add First Milestone
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-black/40 border border-white/10 hover:border-[#D4AF37]/40 rounded-xs flex flex-col sm:flex-row gap-3 items-start transition-colors"
                >
                  <div className="w-full sm:w-28 shrink-0">
                    <label className="block text-[9px] font-mono text-[#D4AF37] uppercase mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      required
                      min={1947}
                      max={2035}
                      value={item.year}
                      onChange={(e) => updateTimelineEvent(idx, 'year', parseInt(e.target.value) || formData.year)}
                      className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-[#D4AF37] font-mono font-bold p-2 rounded-xs focus:outline-none"
                      placeholder="e.g. 2021"
                    />
                  </div>

                  <div className="flex-1 w-full">
                    <label className="block text-[9px] font-mono text-[#a9a49a] uppercase mb-1">
                      Milestone Event / Legal Evolution
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={item.event}
                      onChange={(e) => updateTimelineEvent(idx, 'event', e.target.value)}
                      placeholder="e.g. NCDRC awarded ₹2 crore compensation; Supreme Court later set aside quantum and remanded matter for fresh consideration."
                      className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white p-2.5 rounded-xs focus:outline-none leading-relaxed font-sans"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTimelineEvent(idx)}
                    className="self-end sm:self-center px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xs text-xs font-mono transition-colors cursor-pointer"
                    title="Delete milestone"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 3: 8 Story Episodes (Fully Customizable) */}
        <div className="bg-[#121520] border border-[#D4AF37]/40 p-6 rounded-xs space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Step 3 · 8 Story Episodes (Fully Customizable)
                </h2>
              </div>
              <p className="text-xs text-[#a9a49a] mt-0.5">
                Episode 0 is the Hero Cover. Episodes 1 to 8 contain the genuine legal narrative and characters with zero AI interference.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 rounded-xs self-start sm:self-auto">
              8 Episodes Complete Arc
            </span>
          </div>

          {/* Episode Tab Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xs">
            {episodes.map((ep, idx) => {
              const isSelected = selectedEpTab === idx;
              const hasText = (ep.layers?.story?.blocks?.[0]?.text || '').trim().length > 0;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedEpTab(idx)}
                  className={`py-2 px-1 text-center rounded-xs font-mono transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                      : hasText
                      ? 'bg-white/10 text-white hover:bg-white/15'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider">
                    EP 0{idx + 1}
                  </div>
                  <div className="text-[8px] truncate mt-0.5 opacity-80">
                    {idx === 0
                      ? 'Premise'
                      : idx === 1
                      ? 'Personas'
                      : idx === 2
                      ? 'Inquiry'
                      : idx === 3
                      ? 'Controversy'
                      : idx === 4
                      ? 'Arguments'
                      : idx === 5
                      ? 'Deliberation'
                      : idx === 6
                      ? 'Verdict'
                      : 'Legacy'}
                  </div>
                  {hasText && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Episode Editor */}
          <div className="p-5 bg-black/40 border border-white/10 rounded-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-anton text-lg text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#D4AF37]">Episode 0{selectedEpTab + 1}:</span>
                <span>{activeEp.title || `Episode ${selectedEpTab + 1}`}</span>
              </span>
              <span className="text-[10px] font-mono text-[#a9a49a]">
                Tab {selectedEpTab + 1} of 8
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                  Episode Kicker / Eyebrow <span className="text-[#E50914]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={activeEp.kicker || ''}
                  onChange={(e) => updateEpisodeField(selectedEpTab, { kicker: e.target.value })}
                  className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2.5 rounded-xs font-mono"
                  placeholder={`EPISODE 0${selectedEpTab + 1} · STAGE`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                  Episode Headline / Title <span className="text-[#E50914]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={activeEp.title || ''}
                  onChange={(e) => updateEpisodeField(selectedEpTab, { title: e.target.value })}
                  className="w-full bg-[#0A0C10] border border-white/15 text-xs text-white p-2.5 rounded-xs font-sans font-bold"
                  placeholder="e.g. THE GENESIS OF THE DISPUTE"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono text-[#D4AF37] uppercase font-semibold">
                  Episode Narrative Story Content <span className="text-[#E50914]">*</span>
                </label>
                <span className="text-[10px] font-mono text-[#a9a49a]">
                  {activeEpNarrative.split(/\s+/).filter(Boolean).length} words · {activeEpNarrative.length} chars
                </span>
              </div>
              <textarea
                rows={8}
                required={selectedEpTab === 0}
                value={activeEpNarrative}
                onChange={(e) => updateEpisodeNarrative(selectedEpTab, e.target.value)}
                placeholder={`Write the factual chronological narrative for Episode 0${selectedEpTab + 1}...`}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-3.5 rounded-xs leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#a9a49a] uppercase mb-1">
                End Hook / Cliffhanger
              </label>
              <input
                type="text"
                value={activeEp.endHook || ''}
                onChange={(e) => updateEpisodeField(selectedEpTab, { endHook: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 text-xs text-[#F3EFE6]/90 p-2.5 rounded-xs italic"
                placeholder="e.g. The constitutional controversy escalated to the highest bench."
              />
            </div>

            {/* Dramatis Personae Editor inside Episode 2 */}
            {isPersonaEpisode && (
              <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>👥</span>
                      <span>Dramatis Personae · Litigants & Key Figures ({personas.length})</span>
                    </h3>
                    <p className="text-[11px] text-[#a9a49a] mt-0.5">
                      Character cards rendered in Episode 02 (Petitioner, Respondent, Key Witnesses, Bench).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const nextNum = personas.length + 1;
                      setPersonas([
                        ...personas,
                        {
                          name: '',
                          role: nextNum === 1 ? 'Primary Petitioner' : nextNum === 2 ? 'Respondent / State' : 'Key Figure',
                          tag: 'Legal Litigant',
                          description: '',
                          badgeEmoji: nextNum === 1 ? '⚖️' : nextNum === 2 ? '🏛️' : '👤',
                        },
                      ]);
                    }}
                    className="px-3 py-1.5 bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-1 self-start sm:self-auto shadow-sm"
                  >
                    <span>+</span>
                    <span>Add Character Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {personas.map((persona, pIdx) => (
                    <div key={pIdx} className="bg-black/60 border border-white/10 hover:border-[#D4AF37]/50 p-4 rounded-xs space-y-3 transition-all">
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                        <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase flex items-center gap-1">
                          <span>{persona.badgeEmoji || '👤'}</span>
                          <span>PERSONA 0{pIdx + 1}</span>
                        </span>
                        {personas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setPersonas(personas.filter((_, i) => i !== pIdx))}
                            className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase cursor-pointer"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-[9px] font-mono text-[#8c887e] uppercase mb-0.5">Character Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Shreya Singhal"
                            value={persona.name}
                            onChange={(e) => {
                              const updated = [...personas];
                              updated[pIdx].name = e.target.value;
                              setPersonas(updated);
                            }}
                            className="w-full bg-[#121520] border border-white/10 text-xs text-white p-2 rounded-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-[#8c887e] uppercase mb-0.5">Emoji</label>
                          <input
                            type="text"
                            placeholder="⚖️"
                            value={persona.badgeEmoji || '⚖️'}
                            onChange={(e) => {
                              const updated = [...personas];
                              updated[pIdx].badgeEmoji = e.target.value;
                              setPersonas(updated);
                            }}
                            className="w-full bg-[#121520] border border-white/10 text-xs text-white p-2 rounded-xs text-center"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-mono text-[#8c887e] uppercase mb-0.5">Role Pill</label>
                          <input
                            type="text"
                            placeholder="e.g. Petitioner / Student"
                            value={persona.role}
                            onChange={(e) => {
                              const updated = [...personas];
                              updated[pIdx].role = e.target.value;
                              setPersonas(updated);
                            }}
                            className="w-full bg-[#121520] border border-white/10 text-xs text-white p-2 rounded-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-[#8c887e] uppercase mb-0.5">Tag</label>
                          <input
                            type="text"
                            placeholder="e.g. Aggrieved Litigant"
                            value={persona.tag || ''}
                            onChange={(e) => {
                              const updated = [...personas];
                              updated[pIdx].tag = e.target.value;
                              setPersonas(updated);
                            }}
                            className="w-full bg-[#121520] border border-white/10 text-xs text-white p-2 rounded-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-[#8c887e] uppercase mb-0.5">Description</label>
                        <textarea
                          rows={2}
                          placeholder="Key facts and relevance in this case..."
                          value={persona.description}
                          onChange={(e) => {
                            const updated = [...personas];
                            updated[pIdx].description = e.target.value;
                            setPersonas(updated);
                          }}
                          className="w-full bg-[#121520] border border-white/10 text-xs text-[#c9c5bc] p-2 rounded-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fast Next/Prev Episode Switcher */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <button
                type="button"
                disabled={selectedEpTab === 0}
                onClick={() => setSelectedEpTab((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-xs text-[#a9a49a] hover:text-white transition-all cursor-pointer"
              >
                ← Prev Episode (0{selectedEpTab})
              </button>

              <span className="text-[#D4AF37] font-bold">
                Episode 0{selectedEpTab + 1} of 8
              </span>

              <button
                type="button"
                disabled={selectedEpTab === 7}
                onClick={() => setSelectedEpTab((prev) => Math.min(7, prev + 1))}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-xs text-[#a9a49a] hover:text-white transition-all cursor-pointer"
              >
                Next Episode (0{selectedEpTab + 2}) →
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 4 · CASE VISUAL ASSETS & IMAGE UPLOADS              */}
        {/* ======================================================== */}
        <div className="bg-[#121520] border border-white/10 rounded-xs p-6 space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
                  STEP 4 · CASE VISUAL ASSETS & IMAGES
                </span>
              </div>
              <p className="text-xs text-[#a9a49a] mt-1">
                Upload or link the 3 essential case visuals: Hero Poster, Archival Exhibit (Episode 2), and Courtroom Verdict (Episode 7).
              </p>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-2xs text-[10px] font-mono font-bold bg-white/5 text-white/70 border border-white/10 uppercase">
              JPG / PNG / WebP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Slot 1: Hero Billboard Cover Poster */}
            <div className="bg-black/50 border border-white/10 rounded-xs p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                    SLOT 1 · HERO POSTER COVER
                  </span>
                  <span className="text-[9px] font-mono text-white/40 uppercase">Slide 0</span>
                </div>
                <p className="text-[11px] text-[#8c887e] mt-1.5 leading-relaxed">
                  The primary marquee poster displayed on the case header and catalog.
                </p>

                {/* Preview */}
                <div className="mt-3 relative w-full aspect-[16/9] bg-[#0E1016] border border-white/10 rounded-xs overflow-hidden flex items-center justify-center">
                  {images.poster ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images.poster}
                        alt="Hero Poster Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => ({ ...prev, poster: '' }))}
                        className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/80 hover:bg-red-600 text-[10px] text-white font-mono rounded-xs transition-colors"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-3 text-white/30 text-xs font-mono">
                      <span>🖼️</span>
                      <p className="text-[10px] mt-1">No poster selected</p>
                    </div>
                  )}
                </div>

                {/* Direct URL input */}
                <div className="mt-3">
                  <label className="block text-[9px] font-mono text-[#8c887e] uppercase mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://... or upload below"
                    value={images.poster}
                    onChange={(e) => setImages((prev) => ({ ...prev, poster: e.target.value }))}
                    className="w-full bg-[#121520] border border-white/10 text-xs text-white p-2 rounded-xs"
                  />
                </div>
              </div>

              {/* Upload Button */}
              <div className="pt-2">
                <input
                  type="file"
                  ref={posterFileRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files?.[0] || null, 'poster')}
                />
                <button
                  type="button"
                  disabled={uploadingSlot === 'poster'}
                  onClick={() => posterFileRef.current?.click()}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white rounded-xs text-[11px] font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {uploadingSlot === 'poster' ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Compressing & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <span>📁</span>
                      <span>{images.poster ? 'Replace Poster File' : 'Browse Poster File'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Slot 2: Archival Exhibit Image (Episode 2) */}
            <div className="bg-black/50 border border-white/10 rounded-xs p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                    SLOT 2 · ARCHIVAL EXHIBIT
                  </span>
                  <span className="text-[9px] font-mono text-white/40 uppercase">Episode 2</span>
                </div>
                <p className="text-[11px] text-[#8c887e] mt-1.5 leading-relaxed">
                  Historical evidence document or photo displayed inside Episode 02.
                </p>

                {/* Preview */}
                <div className="mt-3 relative w-full aspect-[16/9] bg-[#0E1016] border border-white/10 rounded-xs overflow-hidden flex items-center justify-center">
                  {images.exhibit ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images.exhibit}
                        alt="Exhibit Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => ({ ...prev, exhibit: '' }))}
                        className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/80 hover:bg-red-600 text-[10px] text-white font-mono rounded-xs transition-colors"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-3 text-white/30 text-xs font-mono">
                      <span>📜</span>
                      <p className="text-[10px] mt-1">No exhibit image</p>
                    </div>
                  )}
                </div>

                {/* Direct URL input */}
                <div className="mt-3">
                  <label className="block text-[9px] font-mono text-[#8c887e] uppercase mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://... or upload below"
                    value={images.exhibit}
                    onChange={(e) => setImages((prev) => ({ ...prev, exhibit: e.target.value }))}
                    className="w-full bg-[#121520] border border-white/10 text-xs text-white p-2 rounded-xs"
                  />
                </div>
              </div>

              {/* Upload Button */}
              <div className="pt-2">
                <input
                  type="file"
                  ref={exhibitFileRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files?.[0] || null, 'exhibit')}
                />
                <button
                  type="button"
                  disabled={uploadingSlot === 'exhibit'}
                  onClick={() => exhibitFileRef.current?.click()}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white rounded-xs text-[11px] font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {uploadingSlot === 'exhibit' ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Compressing & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <span>📁</span>
                      <span>{images.exhibit ? 'Replace Exhibit File' : 'Browse Exhibit File'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Slot 3: Courtroom Verdict Scene (Episode 7) */}
            <div className="bg-black/50 border border-white/10 rounded-xs p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                    SLOT 3 · COURTROOM VERDICT
                  </span>
                  <span className="text-[9px] font-mono text-white/40 uppercase">Episode 7</span>
                </div>
                <p className="text-[11px] text-[#8c887e] mt-1.5 leading-relaxed">
                  Operative courtroom decree or bench holding scene inside Episode 07.
                </p>

                {/* Preview */}
                <div className="mt-3 relative w-full aspect-[16/9] bg-[#0E1016] border border-white/10 rounded-xs overflow-hidden flex items-center justify-center">
                  {images.verdict ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images.verdict}
                        alt="Verdict Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => ({ ...prev, verdict: '' }))}
                        className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/80 hover:bg-red-600 text-[10px] text-white font-mono rounded-xs transition-colors"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-3 text-white/30 text-xs font-mono">
                      <span>⚖️</span>
                      <p className="text-[10px] mt-1">No verdict image</p>
                    </div>
                  )}
                </div>

                {/* Direct URL input */}
                <div className="mt-3">
                  <label className="block text-[9px] font-mono text-[#8c887e] uppercase mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://... or upload below"
                    value={images.verdict}
                    onChange={(e) => setImages((prev) => ({ ...prev, verdict: e.target.value }))}
                    className="w-full bg-[#121520] border border-white/10 text-xs text-white p-2 rounded-xs"
                  />
                </div>
              </div>

              {/* Upload Button */}
              <div className="pt-2">
                <input
                  type="file"
                  ref={verdictFileRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files?.[0] || null, 'verdict')}
                />
                <button
                  type="button"
                  disabled={uploadingSlot === 'verdict'}
                  onClick={() => verdictFileRef.current?.click()}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white rounded-xs text-[11px] font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {uploadingSlot === 'verdict' ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Compressing & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <span>📁</span>
                      <span>{images.verdict ? 'Replace Verdict File' : 'Browse Verdict File'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit & Publish Action Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <Link
            href="/admin"
            className="text-xs font-mono text-[#a9a49a] hover:text-white uppercase tracking-wider order-3 sm:order-1"
          >
            ← Cancel & Return
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('ADMIN_REVIEW')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold text-xs uppercase tracking-widest transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>💾</span>
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('PUBLISHED')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] hover:bg-white text-[#0E1016] font-bold text-xs uppercase tracking-widest transition-all rounded-xs shadow-2xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0E1016] border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Landmark Case...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Publish Case Live</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
