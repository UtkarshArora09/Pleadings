export type Language = 'en' | 'hi';

export type CaseTheme = 'crime-noir' | 'corporate-luxury' | 'constitutional-gold' | 'cyber-neon';

export interface LawTerm {
  id: string;
  term: {
    en: string;
    hi: string;
  };
  code: string;
  definition: {
    en: string;
    hi: string;
  };
}

export interface EvidenceItem {
  masthead: string; // e.g. "THE TIMES OF INDIA" or "POLICE GAZETTE" or "FORENSIC EXHIBIT"
  date: string; // e.g. "21 MAY 1958" or "NEW DELHI"
  headline: {
    en: string;
    hi: string;
  };
  snippet: {
    en: string;
    hi: string;
  };
  highlightedPhrase?: {
    en: string;
    hi: string;
  };
  exhibitNumber?: string; // e.g. "EXHIBIT A" or "FIR NO. 104"
  caption?: {
    en: string;
    hi: string;
  };
  imageSrc?: string;
}

export interface CharacterItem {
  name: {
    en: string;
    hi: string;
  };
  role: {
    en: string;
    hi: string;
  };
  tag: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  badgeEmoji?: string;
}

export interface ArgumentSide {
  party: {
    en: string;
    hi: string;
  };
  claim: {
    en: string;
    hi: string;
  };
  statute?: string;
  keyPoint: {
    en: string;
    hi: string;
  };
}

export interface JudgeOption {
  id: string;
  title: {
    en: string;
    hi: string;
  };
  reason: {
    en: string;
    hi: string;
  };
  simulatedVotesPercent: number; // e.g. 65 for 65%
  isActualVerdict: boolean;
}

export interface JudgeDecision {
  question: {
    en: string;
    hi: string;
  };
  subtext: {
    en: string;
    hi: string;
  };
  options: JudgeOption[];
  judicialRationale: {
    en: string;
    hi: string;
  };
}

export interface StoryPanel {
  id: string;
  type:
    | 'HOOK'
    | 'PEOPLE'
    | 'INCIDENT'
    | 'TIMELINE'
    | 'EVIDENCE'
    | 'ARGUMENTS'
    | 'YOU_DECIDE'
    | 'VERDICT'
    | 'RATIO'
    | 'SETUP'
    | 'LAW'
    | 'AFTERMATH';
  eyebrow: {
    en: string;
    hi: string;
  };
  headline: {
    en: string;
    hi: string;
  };
  body: {
    en: string;
    hi: string;
  };
  stamp?: {
    en: string;
    hi: string;
  };
  citationFooter?: string;
  judgmentUrl?: string;
  tappableTerms?: LawTerm[];
  evidence?: EvidenceItem;
  photoExhibitSrc?: string;
  photoExhibitCaption?: {
    en: string;
    hi: string;
  };
  characters?: CharacterItem[];
  prosecutionArgs?: ArgumentSide;
  defenceArgs?: ArgumentSide;
  judgeDecision?: JudgeDecision;
}

export interface CaseBrief {
  courtAndYear: {
    en: string;
    hi: string;
  };
  facts: {
    en: string;
    hi: string;
  };
  issues: {
    en: string[];
    hi: string[];
  };
  chargesApplied: string[];
  held: {
    en: string;
    hi: string;
  };
  reasoning: {
    en: string;
    hi: string;
  };
  whyItMatters: {
    en: string;
    hi: string;
  };
}

export interface CaseData {
  slug: string;
  title: {
    en: string;
    hi: string;
  };
  tag: {
    en: string;
    hi: string;
  };
  categoryTag: string;
  genre: 'crime' | 'consumer' | 'constitutional' | 'cyber' | 'tort';
  theme: CaseTheme;
  court: string;
  year: number;
  readTime: {
    en: string;
    hi: string;
  };
  blurb: {
    en: string;
    hi: string;
  };
  citation: string;
  judgmentUrl: string;
  watermark: string;
  bannerImage: string;
  matchRate: number; // e.g. 98 for 98% Match
  maturityRating: string; // e.g. "U/A 16+" or "U/A 13+"
  rank: number; // e.g. 1 for Top 10 #1
  featuredHeroHook: {
    en: string;
    hi: string;
  };
  featuredHeroDesc: {
    en: string;
    hi: string;
  };
  hasJudgeDecision?: boolean;
  panels: StoryPanel[];
  brief: CaseBrief;
}
