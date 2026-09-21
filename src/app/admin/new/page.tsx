'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCasePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    citation: '',
    court: 'Supreme Court of India',
    year: new Date().getFullYear() - 1,
    genre: 'constitutional' as 'crime' | 'consumer' | 'constitutional' | 'cyber' | 'tort',
    statuteSections: '',
    factsSummary: '',
    judgmentUrl: '',
    judgmentText: '',
    additionalNotes: '',
    reviewer: '',
    enrolmentNumber: '',
    rank: 1,
    makeTrendingTop10: true,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.court ||
      !formData.statuteSections ||
      !formData.factsSummary ||
      !formData.reviewer.trim() ||
      !formData.enrolmentNumber.trim()
    ) {
      setError(
        'Please fill in all required fields: Title, Court, Statute/Sections, Facts Summary, Reviewing Advocate, and Bar Enrolment Number.'
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      setCurrentStep('1. Reading admin source document & extracting legal facts...');
      await new Promise((r) => setTimeout(r, 600));

      setCurrentStep('2. Structuring 8-Episode Story Arc (Hook, People, Incident, Timeline, Evidence, Arguments, Verdict, Ratio)...');
      await new Promise((r) => setTimeout(r, 600));

      setCurrentStep('3. Translating full case into natural judicial Hindi (en + hi)...');
      await new Promise((r) => setTimeout(r, 600));

      setCurrentStep('4. Generating cinematic AI visual prompts (Hero 16:9, Scene, Courtroom)...');

      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rank: formData.makeTrendingTop10 ? formData.rank : 99,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to process case ingestion');
      }

      // Redirect to the Review Studio for this case
      router.push(`/admin/cases/${data.case.slug}`);
    } catch (err: unknown) {
      console.error('Ingestion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to ingest case');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
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
            Enter the verified facts and judgment source. AI will structure the complete Pleadings story, arguments, interactive poll, Hindi text, and visual assets for your review.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-300 rounded-xs text-xs font-mono">
          ✕ {error}
        </div>
      )}

      {/* Ingestion Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Case Information */}
        <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Step 1 · Basic Case Record
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
                Reviewing Advocate <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Adv. Counsel Name"
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
                placeholder="e.g. D/1042/2012"
                value={formData.enrolmentNumber}
                onChange={(e) => setFormData({ ...formData, enrolmentNumber: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white px-3.5 py-2.5 rounded-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Trending & Front Page Placement */}
        <div className="bg-[#121520] border border-[#E50914]/30 p-6 rounded-xs space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#E50914]">
              Step 2 · Front Page & Trending Placement
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-black/40 border border-white/10 rounded-xs">
            <div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-white">
                <input
                  type="checkbox"
                  checked={formData.makeTrendingTop10}
                  onChange={(e) => setFormData({ ...formData, makeTrendingTop10: e.target.checked })}
                  className="w-4 h-4 accent-[#E50914] rounded cursor-pointer"
                />
                <span>Feature in Trending Top 10 Landmark Precedents Shelf</span>
              </label>
              <p className="text-[11px] text-[#a9a49a] mt-1 pl-6">
                When enabled, this case is displayed on the Homepage Top 10 numbered shelf and the Billboard Trending selector bar.
              </p>
            </div>

            {formData.makeTrendingTop10 && (
              <div className="flex items-center gap-2 pl-6 sm:pl-0">
                <span className="text-xs font-mono text-[#D4AF37]">Rank Position:</span>
                <select
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) })}
                  className="bg-[#121520] border border-[#D4AF37] text-[#D4AF37] font-bold text-xs px-3 py-1.5 rounded-xs focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      #{i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Case Facts & Legal Source Material */}
        <div className="bg-[#121520] border border-white/10 p-6 rounded-xs space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Step 3 · Case Facts & Source Material
            </h2>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
              Factual Summary / Background <span className="text-[#E50914]">*</span>
            </label>
            <textarea
              required
              rows={5}
              placeholder="Describe what happened: the incident, who was arrested/sued, what was challenged, and why it went to court..."
              value={formData.factsSummary}
              onChange={(e) => setFormData({ ...formData, factsSummary: e.target.value })}
              className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-3 rounded-xs focus:outline-none leading-relaxed"
            />
          </div>

          <div>
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

          <div>
            <label className="block text-[11px] font-mono text-[#a9a49a] uppercase mb-1">
              Judgment Extract / Excerpts / Key Observations
            </label>
            <textarea
              rows={4}
              placeholder="Paste relevant excerpts from the certified judgment or court order..."
              value={formData.judgmentText}
              onChange={(e) => setFormData({ ...formData, judgmentText: e.target.value })}
              className="w-full bg-[#0A0C10] border border-white/15 focus:border-[#D4AF37] text-sm text-white p-3 rounded-xs focus:outline-none leading-relaxed font-mono text-xs"
            />
          </div>
        </div>

        {/* Submit & Generate Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/admin"
            className="text-xs font-mono text-[#a9a49a] hover:text-white uppercase tracking-wider"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-white text-[#0E1016] font-bold text-xs uppercase tracking-widest transition-all rounded-xs shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#0E1016] border-t-transparent rounded-full animate-spin" />
                <span>Processing AI Pipeline...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Generate Complete Pleadings Experience</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>

        {/* Live Step Progress Indicator */}
        {loading && (
          <div className="p-4 bg-[#141824] border border-[#D4AF37]/40 rounded-xs animate-fadeIn">
            <div className="text-[11px] font-mono font-bold text-[#D4AF37] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>{currentStep}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
