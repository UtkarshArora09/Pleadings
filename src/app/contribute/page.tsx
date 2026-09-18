'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';

export default function ContributePage() {
  const { language } = useApp();

  const [formData, setFormData] = useState({
    advocateName: '',
    barCouncilNo: '',
    barAssociation: '',
    email: '',
    phone: '',
    designation: 'Advocate',
    caseTitle: '',
    court: 'Supreme Court of India',
    year: new Date().getFullYear().toString(),
    citation: '',
    statutes: '',
    doctrine: '',
    facts: '',
    issues: '',
    prosecutionArgs: '',
    defenceArgs: '',
    holdingAndRatio: '',
    whyItMatters: '',
    judgmentUrl: '',
    additionalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit case. Please check your fields.');
      }

      setSubmissionSuccess(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionSuccess(null);
    setFormData({
      advocateName: '',
      barCouncilNo: '',
      barAssociation: '',
      email: '',
      phone: '',
      designation: 'Advocate',
      caseTitle: '',
      court: 'Supreme Court of India',
      year: new Date().getFullYear().toString(),
      citation: '',
      statutes: '',
      doctrine: '',
      facts: '',
      issues: '',
      prosecutionArgs: '',
      defenceArgs: '',
      holdingAndRatio: '',
      whyItMatters: '',
      judgmentUrl: '',
      additionalNotes: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3EFE6] font-sans antialiased selection:bg-[#D4AF37] selection:text-black">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-20">
        {/* Top Header Section */}
        <div className="text-center space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
            <span>ADVOCATE CONTRIBUTOR NETWORK</span>
            <span>·</span>
            <span>VERIFIED SUBMISSIONS</span>
          </div>

          <h1 className="font-anton text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-tight">
            {language === 'en' ? 'Contribute A Landmark Case' : 'ऐतिहासिक केस सबमिट करें'}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#a9a49a] max-w-2xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Are you an advocate, legal researcher, or law practitioner? Submit case briefs, pivotal arguments, and ratio decidendi. After thorough verification against registry records, your submission will be published with full advocate contributor attribution.'
              : 'क्या आप एक वकील या कानूनी शोधकर्ता हैं? अपने महत्वपूर्ण केस का विवरण, दलीलें और निर्णय यहां साझा करें। सत्यापन के बाद इसे आपके नाम के साथ प्रकाशित किया जाएगा।'}
          </p>
        </div>

        {/* Success Confirmation Modal / Card */}
        {submissionSuccess ? (
          <div className="bg-[#121520] border-2 border-[#D4AF37] rounded-xl p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto text-3xl text-emerald-400 font-bold">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                SUBMISSION RECEIVED & LOGGED
              </span>
              <h2 className="font-anton text-2xl sm:text-4xl text-white uppercase">
                {language === 'en' ? 'Case Under Editorial Review' : 'केस सत्यापन प्रक्रिया में है'}
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-lg mx-auto leading-relaxed">
                {language === 'en'
                  ? 'Thank you for your valuable contribution. A confirmation email has been dispatched to your address, and our editorial panel is reviewing the citations and statutory mappings.'
                  : 'आपके योगदान के लिए धन्यवाद। आपके ईमेल पर पावती भेज दी गई है और हमारी टीम तथ्यों का सत्यापन कर रही है।'}
              </p>
            </div>

            <div className="p-4 bg-black/50 border border-white/10 rounded-md max-w-md mx-auto text-left font-mono text-xs space-y-1.5 text-[#cbd5e1]">
              <div>
                <span className="text-white/50">Reference ID:</span>{' '}
                <span className="text-[#D4AF37] font-bold">{submissionSuccess.submissionId}</span>
              </div>
              <div>
                <span className="text-white/50">Status:</span>{' '}
                <span className="text-emerald-400 font-bold">Pending Registry Verification</span>
              </div>
              <div>
                <span className="text-white/50">Notification:</span>{' '}
                <span className="text-white">{submissionSuccess.emailNotice || 'Email dispatched'}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/browse"
                className="w-full sm:w-auto px-6 py-3 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold text-xs uppercase font-mono tracking-wider rounded-xs transition-colors"
              >
                Browse Published Cases →
              </Link>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                + Submit Another Case
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 bg-red-950/80 border border-red-500/50 rounded-md text-xs sm:text-sm text-red-200 flex items-center gap-3">
                <span className="font-bold text-red-400 text-base">✕</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1: Advocate Contributor Profile */}
            <div className="bg-[#121520] border border-white/10 hover:border-[#D4AF37]/40 transition-colors rounded-xl p-5 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-black text-black bg-[#D4AF37] px-2 py-0.5 rounded-xs">
                  01
                </span>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                  Advocate / Contributor Profile
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Full Legal Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="advocateName"
                    required
                    value={formData.advocateName}
                    onChange={handleChange}
                    placeholder="e.g. Adv. Rajesh Sharma"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Bar Council Enrolment No. <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="barCouncilNo"
                    required
                    value={formData.barCouncilNo}
                    onChange={handleChange}
                    placeholder="e.g. D/1428/2016 or MAH/3452/2019"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Bar Association / Court <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="barAssociation"
                    required
                    value={formData.barAssociation}
                    onChange={handleChange}
                    placeholder="e.g. Supreme Court Bar Association / Delhi HC"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Designation / Practice Area
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full bg-[#171924] border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-hidden transition-colors"
                  >
                    <option value="Advocate">Advocate</option>
                    <option value="Advocate-on-Record (AoR)">Advocate-on-Record (AoR)</option>
                    <option value="Senior Advocate">Senior Advocate</option>
                    <option value="Criminal Defense Counsel">Criminal Defense Counsel</option>
                    <option value="Constitutional Law Practitioner">Constitutional Law Practitioner</option>
                    <option value="Civil & Commercial Litigator">Civil & Commercial Litigator</option>
                    <option value="Legal Researcher / Academician">Legal Researcher / Academician</option>
                    <option value="Law Student (Final Year)">Law Student (Final Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="advocate@chamber.com"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors"
                  />
                  <span className="text-[10px] text-white/40 mt-1 block">
                    We will send verification & publication updates to this address.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    WhatsApp / Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors font-mono"
                  />
                  <span className="text-[10px] text-white/40 mt-1 block">
                    Used strictly for editorial verification coordination.
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: Case Metadata */}
            <div className="bg-[#121520] border border-white/10 hover:border-[#D4AF37]/40 transition-colors rounded-xl p-5 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-black text-black bg-[#D4AF37] px-2 py-0.5 rounded-xs">
                  02
                </span>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                  Case Identification & Statutory Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Case Title / Party Names <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="caseTitle"
                    required
                    value={formData.caseTitle}
                    onChange={handleChange}
                    placeholder="e.g. State of Maharashtra v. Mayer Hans George"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Deciding Court <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="court"
                    required
                    value={formData.court}
                    onChange={handleChange}
                    placeholder="e.g. Supreme Court of India or High Court of Delhi"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Year of Judgment <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    required
                    min="1850"
                    max="2030"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="1965"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Formal Citation <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="citation"
                    required
                    value={formData.citation}
                    onChange={handleChange}
                    placeholder="e.g. 1965 AIR 722, 1965 SCR (1) 123"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Key Statutes & Sections (IPC / BNS / CrPC) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="statutes"
                    required
                    value={formData.statutes}
                    onChange={handleChange}
                    placeholder="e.g. Section 8(1) FERA 1947, Section 300 IPC (BNS 101)"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Core Legal Doctrine / Category
                  </label>
                  <input
                    type="text"
                    name="doctrine"
                    value={formData.doctrine}
                    onChange={handleChange}
                    placeholder="e.g. Mens Rea in Regulatory Offences, Grave & Sudden Provocation"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    Indian Kanoon or Official Judgment URL
                  </label>
                  <input
                    type="url"
                    name="judgmentUrl"
                    value={formData.judgmentUrl}
                    onChange={handleChange}
                    placeholder="https://indiankanoon.org/doc/123456/"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Detailed Legal Pleadings & Analysis */}
            <div className="bg-[#121520] border border-white/10 hover:border-[#D4AF37]/40 transition-colors rounded-xl p-5 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-black text-black bg-[#D4AF37] px-2 py-0.5 rounded-xs">
                  03
                </span>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                  Factual Story, Arguments & Ratio Decidendi
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    1. Statement of Facts & Narrative Hook <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="facts"
                    required
                    rows={4}
                    value={formData.facts}
                    onChange={handleChange}
                    placeholder="Describe what occurred leading up to the dispute or trial. What was the incident, context, and journey through lower courts?"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    2. Legal Issues Presented Before The Bench
                  </label>
                  <textarea
                    name="issues"
                    rows={2}
                    value={formData.issues}
                    onChange={handleChange}
                    placeholder="e.g. 1. Whether mens rea is an essential ingredient of Section 23(1A) of FERA? 2. Whether an RBI notification takes effect before publication?"
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-sky-400 mb-1.5 font-semibold">
                      3A. Prosecution / Petitioner Arguments
                    </label>
                    <textarea
                      name="prosecutionArgs"
                      rows={3}
                      value={formData.prosecutionArgs}
                      onChange={handleChange}
                      placeholder="What were the core statutory and factual contentions raised by the State or Petitioner?"
                      className="w-full bg-black/50 border border-white/15 focus:border-sky-400 rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-rose-400 mb-1.5 font-semibold">
                      3B. Defence / Respondent Arguments
                    </label>
                    <textarea
                      name="defenceArgs"
                      rows={3}
                      value={formData.defenceArgs}
                      onChange={handleChange}
                      placeholder="What were the counter-arguments, exceptions, and precedents relied upon by the Defence?"
                      className="w-full bg-black/50 border border-white/15 focus:border-rose-400 rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors leading-relaxed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#D4AF37] mb-1.5 font-semibold">
                    4. Court Holding & Ratio Decidendi (Binding Principle) <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="holdingAndRatio"
                    required
                    rows={4}
                    value={formData.holdingAndRatio}
                    onChange={handleChange}
                    placeholder="Summarize the core legal reasoning and final holding of the Bench. Why did the court decide the way it did?"
                    className="w-full bg-black/50 border border-[#D4AF37]/50 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-emerald-400 mb-1.5 font-semibold">
                    5. Practical Utility & Why This Case Matters (For Advocates & Students)
                  </label>
                  <textarea
                    name="whyItMatters"
                    rows={2}
                    value={formData.whyItMatters}
                    onChange={handleChange}
                    placeholder="How can practicing advocates use this precedent today? What is the practical takeaway in trial or appellate advocacy?"
                    className="w-full bg-black/50 border border-white/15 focus:border-emerald-400 rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#a9a49a] mb-1.5 font-semibold">
                    6. Key Paragraphs or Archival Notes (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    rows={2}
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Cite specific paragraph numbers (e.g. Paragraph 14, 22) or archival references."
                    className="w-full bg-black/50 border border-white/15 focus:border-[#D4AF37] rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Submission Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
              <p className="text-xs text-white/50 font-mono">
                Submissions enter our verification queue and undergo registry cross-referencing before publication.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-anton text-sm uppercase tracking-widest rounded-xs transition-all shadow-xl hover:scale-105 cursor-pointer disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Processing Submission...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Case For Review</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
