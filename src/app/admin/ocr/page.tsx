'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CaseData } from '@/types';

export default function AdminOcrScannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [customInstructions, setCustomInstructions] = useState<string>('');

  // Scanning State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanError, setScanError] = useState<string | null>(null);

  // Verification State
  const [scannedCase, setScannedCase] = useState<CaseData | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [scanMetadata, setScanMetadata] = useState<any>(null);
  const [activeVerificationTab, setActiveVerificationTab] = useState<'metadata' | 'episodes' | 'brief' | 'hindi' | 'rawText'>('metadata');
  const [activeEpisodeIdx, setActiveEpisodeIdx] = useState<number>(0);

  // Saving State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setScanError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setScanError(null);
    }
  };

  const runOcrScan = async (fileToScan: File | null = selectedFile, isSample = false) => {
    if (!fileToScan && !isSample) {
      setScanError('Please select or drop a PDF or document image to scan.');
      return;
    }

    try {
      setIsScanning(true);
      setScanError(null);
      setScannedCase(null);

      setScanStep('1. Reading document bytes & preparing OCR visual pipeline...');
      await new Promise((r) => setTimeout(r, 400));

      setScanStep('2. Multimodal OCR & Verbatim Judicial Entity Extraction (Gemini / AI)...');

      let res: Response;

      if (isSample) {
        res = await fetch('/api/admin/ocr?sample=true');
      } else if (fileToScan) {
        const formData = new FormData();
        formData.append('file', fileToScan);
        if (customInstructions) {
          formData.append('customInstructions', customInstructions);
        }
        res = await fetch('/api/admin/ocr', {
          method: 'POST',
          body: formData,
        });
      } else {
        throw new Error('No document provided.');
      }

      setScanStep('3. Structuring 8-Episode Story Arc & 3-Tier Synchronized Depth Layers...');
      await new Promise((r) => setTimeout(r, 400));

      setScanStep('4. Generating Verbatim Judicial Hindi Translations & Visual Prompts...');

      const data = await res.json();

      if (!data.success || !data.case) {
        throw new Error(data.error || 'Failed to scan and structure legal document.');
      }

      setScannedCase(data.case);
      setRawText(data.rawText || '');
      setScanMetadata(data.metadata || null);
      setActiveVerificationTab('metadata');
    } catch (err: any) {
      console.error('OCR Scan Error:', err);
      setScanError(err.message || 'An error occurred during OCR scanning.');
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleSaveToPipeline = async (publishImmediately = false) => {
    if (!scannedCase) return;

    try {
      setIsSaving(true);
      setSaveSuccessMsg(null);

      const targetStatus = publishImmediately ? 'PUBLISHED' : 'ADMIN_REVIEW';
      const payload: CaseData = {
        ...scannedCase,
        status: targetStatus,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save case to pipeline.');
      }

      const savedCase = data.case || payload;
      setScannedCase(savedCase);
      setSaveSuccessMsg(
        publishImmediately
          ? '🎉 Case successfully published to the live platform!'
          : '✅ Case successfully saved in the Admin Pipeline (Admin Review)!'
      );

      setTimeout(() => {
        if (publishImmediately) {
          router.push('/admin');
        } else {
          router.push(`/admin/cases/${savedCase.slug}`);
        }
      }, 1500);
    } catch (err: any) {
      console.error('Save to pipeline error:', err);
      setScanError(err.message || 'Failed to save case to pipeline.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJson = () => {
    if (!scannedCase) return;
    const jsonStr = JSON.stringify(scannedCase, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scannedCase.slug || 'pleadings-case'}-verified.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <Link href="/admin" className="text-xs font-mono text-[#D4AF37] hover:underline mb-1 block">
            ← Back to Case Catalog
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-[#D4AF37] text-[#0E1016] text-[10px] font-mono font-black uppercase tracking-wider rounded-xs">
              ⚡ AI OCR PIPELINE
            </span>
            <h1 className="font-anton text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Legal Document OCR Scanner & Ingestion
            </h1>
          </div>
          <p className="text-xs text-[#a9a49a] mt-1 max-w-3xl">
            Upload any Supreme Court / High Court judgment PDF, case docket, or scanned brief. The multimodal OCR engine extracts verified facts, holdings, statutory sections, and precedents, generating an 8-episode, tri-depth case dossier for your verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/new"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all"
          >
            Manual Ingestion Form
          </Link>
        </div>
      </div>

      {/* Error & Success Banners */}
      {scanError && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-300 rounded-xs text-xs font-mono flex items-start gap-2">
          <span className="text-base">✕</span>
          <div className="flex-1">{scanError}</div>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-xs text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <span className="text-base">✓</span>
          <div>{saveSuccessMsg}</div>
        </div>
      )}

      {/* STEP 1: UPLOAD & OCR SCANNER */}
      {!scannedCase && (
        <div className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xs p-10 sm:p-16 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-5 ${
              dragActive
                ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.01]'
                : selectedFile
                ? 'border-emerald-500/60 bg-emerald-950/20'
                : 'border-white/20 bg-[#121520]/70 hover:border-[#D4AF37]/60 hover:bg-[#121520]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-20 h-20 rounded-full bg-[#1A1F2C] border border-[#D4AF37]/40 flex items-center justify-center text-3xl text-[#D4AF37] shadow-xl">
              {selectedFile ? '📄' : '📤'}
            </div>

            <div className="space-y-2 max-w-xl">
              {selectedFile ? (
                <>
                  <p className="font-mono text-base text-emerald-400 font-bold break-all">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#a9a49a] font-mono">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready for Multimodal Legal Extraction
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white">
                    Drop Judgment PDF or Legal Case Document Here
                  </h3>
                  <p className="text-xs text-[#a9a49a] font-mono leading-relaxed">
                    Supports multi-page certified judgment PDFs, law reports (AIR, SCC, SCR), FIR/charge-sheet scans, and filled Pleadings case templates. Up to 50MB.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all font-semibold"
              >
                Browse Local PDF
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  runOcrScan(null, true);
                }}
                className="px-5 py-2.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#D4AF37] rounded-xs text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 font-bold"
              >
                <span>🧪</span>
                <span>Test Built-in Case Template PDF</span>
              </button>
            </div>
          </div>

          {/* Optional Directives */}
          <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-2">
            <label className="block text-[11px] font-mono text-[#a9a49a] uppercase font-semibold">
              Optional Legal Directives / Custom Review Note
            </label>
            <input
              type="text"
              placeholder="e.g. Focus on Section 66A IT Act, Justice Chelameswar's ratio, and CLAT-PG exam questions"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3.5 py-2.5 rounded-xs focus:outline-none font-mono"
            />
          </div>

          {/* Scan Action / Progress */}
          {isScanning ? (
            <div className="p-8 bg-[#161B28] border border-[#D4AF37]/40 rounded-xs space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
                  AI Optical Character Recognition & Legal Extraction Active
                </span>
              </div>
              <p className="text-sm text-white font-mono animate-pulse">{scanStep}</p>
              <div className="w-full max-w-md mx-auto bg-black/50 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#D4AF37] via-amber-200 to-[#D4AF37] h-full w-3/4 animate-[pulse_1s_ease-in-out_infinite]" />
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                disabled={!selectedFile}
                onClick={() => runOcrScan(selectedFile, false)}
                className="px-8 py-3 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0E1016] font-bold rounded-xs text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl"
              >
                <span>⚡</span>
                <span>Start OCR Scan & Auto-Extraction</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: VERIFICATION & STAGING WORKSPACE */}
      {scannedCase && (
        <div className="space-y-6 animate-fadeIn">
          {/* Status Header */}
          <div className="bg-[#121622] border border-[#D4AF37]/30 p-5 rounded-xs flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                  Document Successfully Scanned & Structured · Verification Workspace
                </span>
              </div>
              <h2 className="font-anton text-2xl sm:text-3xl text-white">
                {scannedCase.title.en}
              </h2>
              <p className="text-xs text-[#a9a49a] font-mono">
                {scannedCase.court} · {scannedCase.year} · {scannedCase.genre.toUpperCase()} · Citation: {scannedCase.citation}
              </p>
            </div>

            {scanMetadata && (
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-[#a9a49a] rounded-xs">
                  ⚡ Engine: {scanMetadata.modelUsed}
                </span>
                <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xs font-bold">
                  ✓ Confidence: {scanMetadata.confidenceScore}%
                </span>
                <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xs">
                  ⏱ Time: {scanMetadata.processingTimeMs}ms
                </span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
            {[
              { id: 'metadata', label: '1. Case Record & Metadata' },
              { id: 'episodes', label: `2. 8 Story Episodes (${scannedCase.episodes?.length || 0})` },
              { id: 'brief', label: '3. Case Brief & Personas' },
              { id: 'hindi', label: '4. Bilingual Judicial Hindi' },
              { id: 'rawText', label: '5. Raw OCR Transcript' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveVerificationTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${
                  activeVerificationTab === tab.id
                    ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow-md'
                    : 'bg-white/5 text-[#a9a49a] hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: METADATA */}
          {activeVerificationTab === 'metadata' && (
            <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold pb-2 border-b border-white/10">
                Basic Case Record Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                    Full Case Title
                  </label>
                  <input
                    type="text"
                    value={scannedCase.title.en}
                    onChange={(e) =>
                      setScannedCase({
                        ...scannedCase,
                        title: { ...scannedCase.title, en: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3.5 py-2.5 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                    Editorial Short Name / Hook
                  </label>
                  <input
                    type="text"
                    value={scannedCase.featuredHeroHook?.en || ''}
                    onChange={(e) =>
                      setScannedCase({
                        ...scannedCase,
                        featuredHeroHook: { ...scannedCase.featuredHeroHook, en: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3.5 py-2.5 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                    Court Name & Judgment Year
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={scannedCase.court}
                      onChange={(e) => setScannedCase({ ...scannedCase, court: e.target.value })}
                      className="bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs"
                    />
                    <input
                      type="number"
                      value={scannedCase.year}
                      onChange={(e) => setScannedCase({ ...scannedCase, year: parseInt(e.target.value) || 2024 })}
                      className="bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                    Primary Law Report Citation
                  </label>
                  <input
                    type="text"
                    value={scannedCase.citation}
                    onChange={(e) => setScannedCase({ ...scannedCase, citation: e.target.value })}
                    className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3.5 py-2.5 rounded-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                    Genre & Category Tag
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={scannedCase.genre}
                      onChange={(e) => setScannedCase({ ...scannedCase, genre: e.target.value as any })}
                      className="bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs"
                    >
                      <option value="constitutional">Constitutional</option>
                      <option value="crime">Criminal & Forensics</option>
                      <option value="cyber">Cyber & Free Speech</option>
                      <option value="consumer">Consumer Protection</option>
                      <option value="tort">Tort & Liability</option>
                    </select>
                    <input
                      type="text"
                      value={scannedCase.categoryTag}
                      onChange={(e) => setScannedCase({ ...scannedCase, categoryTag: e.target.value })}
                      className="bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                    Reviewing Advocate & Bar Enrolment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Adv. Lead Reviewer"
                      defaultValue="Adv. Girish Kr. Srivastava"
                      className="bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs"
                    />
                    <input
                      type="text"
                      placeholder="Bar No. D/842/1991"
                      defaultValue="D/842/1991"
                      className="bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                  Editorial Blurb / Hook
                </label>
                <textarea
                  rows={2}
                  value={scannedCase.blurb.en}
                  onChange={(e) =>
                    setScannedCase({
                      ...scannedCase,
                      blurb: { ...scannedCase.blurb, en: e.target.value },
                    })
                  }
                  className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white p-3 rounded-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: EPISODES & 3-TIER LAYERS */}
          {activeVerificationTab === 'episodes' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {scannedCase.episodes?.map((ep, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveEpisodeIdx(idx)}
                    className={`px-3.5 py-2 text-xs font-mono uppercase rounded-xs transition-all whitespace-nowrap ${
                      activeEpisodeIdx === idx
                        ? 'bg-[#D4AF37] text-[#0E1016] font-bold'
                        : 'bg-white/5 text-[#a9a49a] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Episode {idx + 1}
                  </button>
                ))}
              </div>

              {scannedCase.episodes?.[activeEpisodeIdx] && (
                <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-4">
                  <div className="pb-3 border-b border-white/10">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold tracking-wider">
                      {scannedCase.episodes[activeEpisodeIdx].kicker}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">
                      {scannedCase.episodes[activeEpisodeIdx].title}
                    </h4>
                  </div>

                  {/* Story Episode Narrative */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-[#D4AF37] uppercase font-bold block">
                      Episode Story Narrative (Extracted Facts)
                    </span>
                    <textarea
                      rows={5}
                      value={scannedCase.episodes[activeEpisodeIdx].layers?.story?.blocks?.[0]?.text || ''}
                      onChange={(e) => {
                        const updatedEpisodes = [...scannedCase.episodes!];
                        if (!updatedEpisodes[activeEpisodeIdx].layers.story.blocks) {
                          updatedEpisodes[activeEpisodeIdx].layers.story.blocks = [];
                        }
                        updatedEpisodes[activeEpisodeIdx].layers.story.blocks[0] = {
                          type: 'para',
                          text: e.target.value,
                          source: { tier: 'BLACK', para: activeEpisodeIdx + 1 },
                        };
                        setScannedCase({ ...scannedCase, episodes: updatedEpisodes });
                      }}
                      className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white p-3 rounded-xs font-sans leading-relaxed"
                    />
                  </div>

                  {/* End Hook */}
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-[#a9a49a] uppercase font-bold block">
                      End Hook / Cliffhanger
                    </span>
                    <input
                      type="text"
                      value={scannedCase.episodes[activeEpisodeIdx].endHook || ''}
                      onChange={(e) => {
                        const updatedEpisodes = [...scannedCase.episodes!];
                        updatedEpisodes[activeEpisodeIdx].endHook = e.target.value;
                        setScannedCase({ ...scannedCase, episodes: updatedEpisodes });
                      }}
                      className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3.5 py-2 rounded-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BRIEF */}
          {activeVerificationTab === 'brief' && (
            <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                Case Brief Summary
              </h4>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-[#a9a49a] uppercase block mb-1">Facts</span>
                  <textarea
                    rows={3}
                    value={scannedCase.brief?.facts?.en || ''}
                    onChange={(e) =>
                      setScannedCase({
                        ...scannedCase,
                        brief: { ...scannedCase.brief, facts: { ...scannedCase.brief.facts, en: e.target.value } },
                      })
                    }
                    className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white p-3 rounded-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#a9a49a] uppercase block mb-1">Held</span>
                  <textarea
                    rows={2}
                    value={scannedCase.brief?.held?.en || ''}
                    onChange={(e) =>
                      setScannedCase({
                        ...scannedCase,
                        brief: { ...scannedCase.brief, held: { ...scannedCase.brief.held, en: e.target.value } },
                      })
                    }
                    className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white p-3 rounded-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#a9a49a] uppercase block mb-1">Reasoning</span>
                  <textarea
                    rows={3}
                    value={scannedCase.brief?.reasoning?.en || ''}
                    onChange={(e) =>
                      setScannedCase({
                        ...scannedCase,
                        brief: { ...scannedCase.brief, reasoning: { ...scannedCase.brief.reasoning, en: e.target.value } },
                      })
                    }
                    className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white p-3 rounded-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HINDI */}
          {activeVerificationTab === 'hindi' && (
            <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0A0C10] border border-white/10 rounded-xs space-y-2">
                  <span className="text-[10px] font-mono text-[#a9a49a] uppercase">English Case Title</span>
                  <p className="text-sm font-bold text-white">{scannedCase.title.en}</p>
                  <p className="text-xs text-[#a9a49a]">{scannedCase.blurb.en}</p>
                </div>

                <div className="p-4 bg-[#0A0C10] border border-[#D4AF37]/30 rounded-xs space-y-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase">Judicial Hindi Title</span>
                  <p className="text-sm font-bold text-amber-200">{scannedCase.title.hi}</p>
                  <p className="text-xs text-white/90">{scannedCase.blurb.hi}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RAW TEXT */}
          {activeVerificationTab === 'rawText' && (
            <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#a9a49a]">
                <span>Raw OCR Extracted Transcript</span>
                <button
                  onClick={() => navigator.clipboard.writeText(rawText)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs"
                >
                  Copy Raw Text
                </button>
              </div>
              <pre className="p-4 bg-[#0A0C10] border border-white/10 rounded-xs text-xs font-mono text-white/80 overflow-x-auto max-h-96 whitespace-pre-wrap">
                {rawText || 'No raw text available.'}
              </pre>
            </div>
          )}

          {/* Pipeline Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#121622] border border-[#D4AF37]/30 rounded-xs sticky bottom-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setScannedCase(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#a9a49a] hover:text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all"
              >
                ← Scan Another PDF
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <span>📥</span>
                <span>Export JSON</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveToPipeline(false)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xs text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-40 flex items-center gap-2"
              >
                <span>💾</span>
                <span>{isSaving ? 'Saving...' : 'Save to Pipeline (In Review)'}</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveToPipeline(true)}
                className="px-7 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0E1016] font-bold rounded-xs text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-40 flex items-center gap-2 shadow-xl"
              >
                <span>🚀</span>
                <span>{isSaving ? 'Publishing...' : 'Verify & Publish Live'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
