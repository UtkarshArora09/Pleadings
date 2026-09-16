export type SourceTier = "BLACK" | "BLUE" | "AMBER";

export interface Source {
  tier: SourceTier;
  para?: number;            // required if tier === "BLACK"
  paraText?: string;        // verbatim judgment text for the ParaSheet
  cite?: string;            // required if tier === "BLACK"
  secondary?: {             // required if tier === "BLUE"
    publication: string;
    date: string;
    url?: string;
  };
}

export interface Block {
  type: "para" | "list" | "pullquote" | "callout";
  text: string;             // may contain {{term:slug|display}} and {{stat:IPC §302}}
  items?: string[];
  source: Source;
}

export interface Exhibit {
  kind: "record" | "quote" | "reconstruction";
  label: string;            // e.g. "POLICE CASE DIARY"
  headline: string;
  body: string;
  meta: string;
  docNumber?: string;       // FORBIDDEN when kind === "reconstruction"
  sourceUrl?: string;       // REQUIRED when kind === "record"
  para?: number;            // REQUIRED when kind === "quote"
  image?: { src: string; alt: string; provenance: "archival" | "illustration" };
}

export interface EpisodeLayer {
  blocks: Block[];
  ratio?: string;
  obiter?: string[];
  dissent?: { judge: string; ground: string; text: string };
  examAngle?: string;
  pinpoints?: { proposition: string; para: number }[];
  howToUse?: string[];
  howToDistinguish?: string[];
}

export interface Episode {
  n: number;
  kicker: string;           // "EPISODE 03 · THE MIDNIGHT ENCOUNTER"
  title: string;
  layers: {
    story: EpisodeLayer;
    student: EpisodeLayer;
    advocate: EpisodeLayer;
  };
  exhibit?: Exhibit;
  image?: { src: string; alt: string; provenance: "archival" | "illustration" };
  endHook: string;          // the line that pulls the reader to the next episode
  audio?: { en?: string; hi?: string; durationSec?: number };
}

export type CaseStatusCode = "GOOD_LAW" | "PARTLY_SUPERSEDED" | "OVERRULED" | "STATUTE_REPLACED";

export interface CaseStatus {
  code: CaseStatusCode;
  explain: string;
  chain: { year: number; event: string }[];
}

export interface CaseFile {
  slug: string;
  title: string;
  hook: string;                     // max 14 words
  court: string;
  year: number;
  decidedOn: string;                // ISO
  bench: string[];
  citations: { primary: string; parallel: string[]; neutral?: string };
  sourceUrl: string;
  status: CaseStatus;
  statuteMap: { old: string; new: string | null; note: string }[];
  doctrines: string[];
  categories: string[];
  readingTime: { story: number; student: number; advocate: number };
  featured: boolean;
  publishedAt: string;
  poster: { src: string; alt: string; provenance: "archival" | "illustration" };
  episodes: Episode[];              // exactly 8
  vote: {
    question: string;
    context: string;
    options: [
      { id: string; label: string; argument: string },
      { id: string; label: string; argument: string }
    ];
    courtChoseOptionId: string;
  };
  glossary: { slug: string; term: string; inThisCase: string }[];
  flashcards: { q: string; a: string }[];
  affectsYou?: { heading: string; points: string[]; actionLink?: { label: string; url: string } };
  timeline: { year: number; event: string }[];
  relatedSlugs: string[];
  subsequentHistory: { type: "followed" | "distinguished" | "doubted" | "overruled" | "statute"; case: string; year: number; note: string }[];
  sources: { label: string; url: string }[];
  review: { reviewer: string; enrolment: string; reviewedOn: string };
  hi: Omit<CaseFile, "hi" | "slug" | "citations" | "sourceUrl" | "review">;
}
