'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CaseData } from '@/types';

interface OcrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseIngested?: (newCase: CaseData) => void;
}

export default function OcrScannerModal({ isOpen, onClose, onCaseIngested }: OcrScannerModalProps) {
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
  const [activeVerificationTab, setActiveVerificationTab] = useState<'metadata' | 'episodes' | 'advocate' | 'brief' | 'hindi' | 'flashcards' | 'rawText'>('metadata');
  const [activeEpisodeIdx, setActiveEpisodeIdx] = useState<number>(0);

  // Saving / Pipeline State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

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

      if (onCaseIngested) {
        onCaseIngested(savedCase);
      }

      setTimeout(() => {
        if (publishImmediately) {
          onClose();
        } else {
          router.push(`/admin/cases/${savedCase.slug}`);
          onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#0E1118] border border-[#D4AF37]/30 rounded-xs shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121622]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-[#D4AF37] text-[#0E1016] text-[10px] font-mono font-black uppercase tracking-wider rounded-xs flex items-center gap-1.5 shadow-sm">
              <span>⚡</span>
              <span>AI OCR SCANNER</span>
            </span>
            <h2 className="font-anton text-xl sm:text-2xl text-white tracking-wide uppercase">
              {scannedCase ? 'Case Verification & Ingestion Studio' : 'Upload Case PDF for Automatic Ingestion'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-[#a9a49a] hover:text-white text-sm font-mono px-2 py-1 transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Banner */}
          {scanError && (
            <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-300 rounded-xs text-xs font-mono flex items-start gap-2">
              <span className="text-base">✕</span>
              <div className="flex-1">{scanError}</div>
            </div>
          )}

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-xs text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <span className="text-base">✓</span>
              <div>{saveSuccessMsg}</div>
            </div>
          )}

          {/* STATE 1: UPLOAD & SCAN VIEW */}
          {!scannedCase && (
            <div className="space-y-6">
              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xs p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
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

                <div className="w-16 h-16 rounded-full bg-[#1A1F2C] border border-[#D4AF37]/40 flex items-center justify-center text-2xl text-[#D4AF37] shadow-inner">
                  {selectedFile ? '📄' : '📤'}
                </div>

                <div className="space-y-1">
                  {selectedFile ? (
                    <>
                      <p className="font-mono text-sm text-emerald-400 font-bold break-all">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-[#a9a49a] font-mono">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready for OCR Extraction
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base font-semibold text-white">
                        Drag and drop your Case PDF, Judgment Docket, or Scanned Brief here
                      </p>
                      <p className="text-xs text-[#a9a49a] font-mono">
                        Supports PDF (multi-page certified judgments), PNG, JPEG, WEBP · Up to 50MB
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
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all"
                  >
                    Browse Files
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      runOcrScan(null, true);
                    }}
                    className="px-4 py-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#D4AF37] rounded-xs text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <span>🧪</span>
                    <span>Test With Sample Case Template PDF</span>
                  </button>
                </div>
              </div>

              {/* Optional Custom Directives */}
              <div className="bg-[#121520] border border-white/10 p-4 rounded-xs space-y-2">
                <label className="block text-[11px] font-mono text-[#a9a49a] uppercase">
                  Optional Ingestion Directives (e.g. specific advocate review notes or emphasis)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ensure detailed coverage of Section 66A IT Act and Justice Chelameswar's ratio"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3.5 py-2.5 rounded-xs focus:outline-none font-mono"
                />
              </div>

              {/* Scan Trigger / Progress Display */}
              {isScanning ? (
                <div className="p-6 bg-[#161B28] border border-[#D4AF37]/40 rounded-xs space-y-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
                      AI OCR Scanner Active
                    </span>
                  </div>
                  <p className="text-sm text-white font-mono animate-pulse">{scanStep}</p>
                  <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#D4AF37] via-amber-200 to-[#D4AF37] h-full w-3/4 animate-[pulse_1s_ease-in-out_infinite]" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[#a9a49a] hover:text-white rounded-xs text-xs font-mono uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={!selectedFile}
                    onClick={() => runOcrScan(selectedFile, false)}
                    className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0E1016] font-bold rounded-xs text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                  >
                    <span>⚡</span>
                    <span>Extract & Structure Case</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STATE 2: VERIFICATION & STAGING WORKSPACE */}
          {scannedCase && (
            <div className="space-y-6 animate-fadeIn">
              {/* Status & Metadata Bar */}
              <div className="bg-[#121622] border border-[#D4AF37]/30 p-4 rounded-xs flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      OCR Scan Complete · Ready For Verification
                    </span>
                  </div>
                  <h3 className="font-anton text-lg sm:text-xl text-white">
                    {scannedCase.title.en}
                  </h3>
                  <p className="text-xs text-[#a9a49a] font-mono">
                    {scannedCase.court} · {scannedCase.year} · {scannedCase.genre.toUpperCase()} · Citation: {scannedCase.citation}
                  </p>
                </div>

                {scanMetadata && (
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[#a9a49a] rounded-xs">
                      ⚡ Model: {scanMetadata.modelUsed}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xs">
                      ✓ Confidence: {scanMetadata.confidenceScore}%
                    </span>
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xs">
                      ⏱ {scanMetadata.processingTimeMs}ms
                    </span>
                  </div>
                )}
              </div>

              {/* Workspace Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-white/10 pb-2">
                {[
                  { id: 'metadata', label: '1. Metadata & Coram' },
                  { id: 'episodes', label: `2. 8 Episodes & Layers (${scannedCase.episodes?.length || 0})` },
                  { id: 'advocate', label: '3. Advocate 5-Part Reference' },
                  { id: 'brief', label: '4. Case Brief & Personas' },
                  { id: 'hindi', label: '5. Bilingual Hindi Preview' },
                  { id: 'flashcards', label: '6. Flashcards & Poll' },
                  { id: 'rawText', label: '7. Raw Extracted Text' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveVerificationTab(tab.id as any)}
                    className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${
                      activeVerificationTab === tab.id
                        ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow-md'
                        : 'bg-white/5 text-[#a9a49a] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT 1: METADATA */}
              {activeVerificationTab === 'metadata' && (
                <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                        Case Title (English)
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
                        className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                        Editorial Short Name
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
                        className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                        Court & Year
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
                        className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                        Legal Genre & Category
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={scannedCase.genre}
                          onChange={(e) => setScannedCase({ ...scannedCase, genre: e.target.value as any })}
                          className="bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs"
                        >
                          <option value="constitutional">Constitutional</option>
                          <option value="crime">Criminal & Forensics</option>
                          <option value="cyber">Cyber & Privacy</option>
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
                          placeholder="Adv. Reviewer"
                          defaultValue="Adv. Girish Kr. Srivastava"
                          className="bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="Bar No."
                          defaultValue="D/842/1991"
                          className="bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white px-3 py-2 rounded-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                      Editorial Blurb / Overview
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

              {/* TAB CONTENT 2: EPISODES & 3-TIER LAYERS */}
              {activeVerificationTab === 'episodes' && (
                <div className="space-y-4">
                  {/* Episode Selector */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {scannedCase.episodes?.map((ep, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveEpisodeIdx(idx)}
                        className={`px-3 py-1.5 text-xs font-mono uppercase rounded-xs transition-all whitespace-nowrap ${
                          activeEpisodeIdx === idx
                            ? 'bg-[#D4AF37] text-[#0E1016] font-bold'
                            : 'bg-white/5 text-[#a9a49a] hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        Ep {idx + 1}
                      </button>
                    ))}
                  </div>

                  {scannedCase.episodes?.[activeEpisodeIdx] && (
                    <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div>
                          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">
                            {scannedCase.episodes[activeEpisodeIdx].kicker}
                          </span>
                          <h4 className="text-base font-bold text-white">
                            {scannedCase.episodes[activeEpisodeIdx].title}
                          </h4>
                        </div>
                      </div>

                      {/* Layer A: Story Narrative */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-[#D4AF37] uppercase font-bold block">
                          Layer A · General Story Narrative (Verbatim Facts)
                        </span>
                        <textarea
                          rows={3}
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
                          className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-xs text-white p-3 rounded-xs"
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

              {/* TAB CONTENT 3: ADVOCATE REFERENCE DOSSIER */}
              {activeVerificationTab === 'advocate' && (
                <div className="space-y-4">
                  <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                      Part 1 · Statutory Text Quoted in Judgment
                    </h4>
                    {scannedCase.advocateReference?.statutoryText?.map((st, i) => (
                      <div key={i} className="p-3 bg-[#0A0C10] border border-white/10 rounded-xs space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#a9a49a] font-mono">
                          <span className="text-white font-bold">{st.act || st.statute || 'Statute'}{st.section ? ` — ${st.section}` : ''}</span>
                          <span>Pinpoint: {st.pinpoint || 'Verified Record'}</span>
                        </div>
                        <p className="text-xs text-amber-100/90 italic font-mono bg-black/40 p-2.5 rounded-xs">
                          {st.quotedText || st.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                      Part 2 · The Court&apos;s Enumerated Holdings
                    </h4>
                    {scannedCase.advocateReference?.holdings?.map((h, i) => (
                      <div key={i} className="p-3 bg-[#0A0C10] border border-white/10 rounded-xs flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#0E1016] text-xs font-bold flex items-center justify-center shrink-0">
                          {h.number || i + 1}
                        </span>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-white font-medium">{h.holding}</p>
                          <p className="text-[10px] text-[#a9a49a] font-mono">Pinpoint: {h.pinpoint}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                      Part 3 · Precedents Discussed & Treatments
                    </h4>
                    <div className="space-y-2">
                      {scannedCase.advocateReference?.precedents?.map((pr, i) => (
                        <div key={i} className="p-3 bg-[#0A0C10] border border-white/10 rounded-xs flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs text-white font-bold">{pr.caseName}</p>
                            <p className="text-[10px] text-[#a9a49a] font-mono">{pr.citation}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold uppercase rounded-xs">
                            {pr.treatment}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 4: BRIEF & PERSONAS */}
              {activeVerificationTab === 'brief' && (
                <div className="space-y-4">
                  <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                      Case Brief Summary
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-[#a9a49a] uppercase block">Facts</span>
                        <p className="text-white mt-0.5">{scannedCase.brief?.facts?.en}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#a9a49a] uppercase block">Held</span>
                        <p className="text-white mt-0.5">{scannedCase.brief?.held?.en}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#a9a49a] uppercase block">Reasoning</span>
                        <p className="text-white mt-0.5">{scannedCase.brief?.reasoning?.en}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 5: BILINGUAL HINDI PREVIEW */}
              {activeVerificationTab === 'hindi' && (
                <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-4">
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

              {/* TAB CONTENT 6: FLASHCARDS & POLL */}
              {activeVerificationTab === 'flashcards' && (
                <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                    Student High-Yield Flashcards ({scannedCase.flashcards?.length || 0})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scannedCase.flashcards?.map((fc, i) => (
                      <div key={i} className="p-3.5 bg-[#0A0C10] border border-white/10 rounded-xs space-y-2">
                        <p className="text-xs font-bold text-white">Q: {fc.q}</p>
                        <p className="text-xs text-amber-300/90 font-mono">A: {fc.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 7: RAW EXTRACTED OCR TEXT */}
              {activeVerificationTab === 'rawText' && (
                <div className="bg-[#121520] border border-white/10 p-5 rounded-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#a9a49a]">
                    <span>Raw OCR Extracted Transcript</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(rawText)}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs"
                    >
                      Copy Raw Text
                    </button>
                  </div>
                  <pre className="p-4 bg-[#0A0C10] border border-white/10 rounded-xs text-xs font-mono text-white/80 overflow-x-auto max-h-96 whitespace-pre-wrap">
                    {rawText || 'No raw text available.'}
                  </pre>
                </div>
              )}

              {/* Bottom Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
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
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xs text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-40 flex items-center gap-2"
                  >
                    <span>💾</span>
                    <span>{isSaving ? 'Saving...' : 'Save to Pipeline (In Review)'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSaveToPipeline(true)}
                    className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0E1016] font-bold rounded-xs text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-40 flex items-center gap-2 shadow-lg"
                  >
                    <span>🚀</span>
                    <span>{isSaving ? 'Publishing...' : 'Verify & Publish Live'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
