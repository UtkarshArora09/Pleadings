import { z } from 'zod';
import { CaseFile } from '@/types/case';

const SourceTierSchema = z.enum(['BLACK', 'BLUE', 'AMBER']);

const SourceSchema = z.object({
  tier: SourceTierSchema,
  para: z.number().optional(),
  paraText: z.string().optional(),
  cite: z.string().optional(),
  secondary: z.object({
    publication: z.string(),
    date: z.string(),
    url: z.string().optional()
  }).optional()
}).refine((data) => {
  if (data.tier === 'BLACK') {
    return typeof data.para === 'number' && typeof data.paraText === 'string' && typeof data.cite === 'string';
  }
  if (data.tier === 'BLUE') {
    return Boolean(data.secondary && data.secondary.publication && data.secondary.date);
  }
  return true;
}, {
  message: "BLACK tier requires 'para', 'paraText', and 'cite'. BLUE tier requires 'secondary' publication and date."
});

const BlockSchema = z.object({
  type: z.enum(['para', 'list', 'pullquote', 'callout']),
  text: z.string(),
  items: z.array(z.string()).optional(),
  source: SourceSchema
});

const ExhibitSchema = z.object({
  kind: z.enum(['record', 'quote', 'reconstruction']),
  label: z.string(),
  headline: z.string(),
  body: z.string(),
  meta: z.string(),
  docNumber: z.string().optional(),
  sourceUrl: z.string().optional(),
  para: z.number().optional(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
    provenance: z.enum(['archival', 'illustration'])
  }).optional()
}).superRefine((data, ctx) => {
  if (data.kind === 'reconstruction' && data.docNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Reconstruction exhibits must NEVER have a 'docNumber' (fabricated document numbers are forbidden)."
    });
  }
  if (data.kind === 'record' && (!data.sourceUrl || data.sourceUrl.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Record exhibits MUST have a 'sourceUrl'."
    });
  }
  if (data.kind === 'quote' && typeof data.para !== 'number') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Quote exhibits MUST have a 'para' number."
    });
  }
});

const EpisodeLayerSchema = z.object({
  blocks: z.array(BlockSchema),
  ratio: z.string().optional(),
  obiter: z.array(z.string()).optional(),
  dissent: z.object({
    judge: z.string(),
    ground: z.string(),
    text: z.string()
  }).optional(),
  examAngle: z.string().optional(),
  pinpoints: z.array(z.object({
    proposition: z.string(),
    para: z.number()
  })).optional(),
  howToUse: z.array(z.string()).optional(),
  howToDistinguish: z.array(z.string()).optional()
});

const EpisodeSchema = z.object({
  n: z.number(),
  kicker: z.string(),
  title: z.string(),
  layers: z.object({
    story: EpisodeLayerSchema,
    student: EpisodeLayerSchema,
    advocate: EpisodeLayerSchema
  }),
  exhibit: ExhibitSchema.optional(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
    provenance: z.enum(['archival', 'illustration'])
  }).optional(),
  endHook: z.string(),
  audio: z.object({
    en: z.string().optional(),
    hi: z.string().optional(),
    durationSec: z.number().optional()
  }).optional()
});

export const CaseFileSchema = z.object({
  slug: z.string(),
  title: z.string(),
  hook: z.string().refine((h) => h.trim().split(/\s+/).length <= 14, {
    message: "Hook must not exceed 14 words."
  }),
  court: z.string(),
  year: z.number(),
  decidedOn: z.string(),
  bench: z.array(z.string()),
  citations: z.object({
    primary: z.string(),
    parallel: z.array(z.string()),
    neutral: z.string().optional()
  }),
  sourceUrl: z.string(),
  status: z.object({
    code: z.enum(['GOOD_LAW', 'PARTLY_SUPERSEDED', 'OVERRULED', 'STATUTE_REPLACED']),
    explain: z.string(),
    chain: z.array(z.object({
      year: z.number(),
      event: z.string()
    }))
  }),
  statuteMap: z.array(z.object({
    old: z.string(),
    new: z.string().nullable(),
    note: z.string()
  })),
  doctrines: z.array(z.string()),
  categories: z.array(z.string()),
  readingTime: z.object({
    story: z.number(),
    student: z.number(),
    advocate: z.number()
  }),
  featured: z.boolean(),
  publishedAt: z.string(),
  poster: z.object({
    src: z.string(),
    alt: z.string(),
    provenance: z.enum(['archival', 'illustration'])
  }),
  episodes: z.array(EpisodeSchema).length(8, "A case must have exactly 8 episodes."),
  vote: z.object({
    question: z.string(),
    context: z.string(),
    options: z.tuple([
      z.object({ id: z.string(), label: z.string(), argument: z.string() }),
      z.object({ id: z.string(), label: z.string(), argument: z.string() })
    ]),
    courtChoseOptionId: z.string()
  }),
  glossary: z.array(z.object({
    slug: z.string(),
    term: z.string(),
    inThisCase: z.string()
  })),
  flashcards: z.array(z.object({
    q: z.string(),
    a: z.string()
  })),
  affectsYou: z.object({
    heading: z.string(),
    points: z.array(z.string()),
    actionLink: z.object({
      label: z.string(),
      url: z.string()
    }).optional()
  }).optional(),
  timeline: z.array(z.object({
    year: z.number(),
    event: z.string()
  })),
  relatedSlugs: z.array(z.string()),
  subsequentHistory: z.array(z.object({
    type: z.enum(['followed', 'distinguished', 'doubted', 'overruled', 'statute']),
    case: z.string(),
    year: z.number(),
    note: z.string()
  })),
  sources: z.array(z.object({
    label: z.string(),
    url: z.string()
  })),
  review: z.object({
    reviewer: z.string(),
    enrolment: z.string(),
    reviewedOn: z.string()
  }),
  hi: z.any()
});

export function validateCase(caseData: unknown): { success: boolean; errors?: string[]; warnings?: string[] } {
  const result = CaseFileSchema.safeParse(caseData);
  const warnings: string[] = [];

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`)
    };
  }

  const typed = result.data as CaseFile;

  // Custom heuristics: check AMBER blocks for party speech attributions & word counts
  typed.episodes.forEach((ep, epIdx) => {
    // Check story word count (max 250 words)
    const storyWords = ep.layers.story.blocks.map(b => b.text).join(' ').trim().split(/\s+/).length;
    if (storyWords > 250) {
      warnings.push(`Episode ${epIdx + 1} story layer exceeds 250 words (${storyWords} words).`);
    }

    ep.layers.story.blocks.forEach((block, bIdx) => {
      if (block.source.tier === 'AMBER') {
        const attributionRegex = /(thought|said|felt|confessed|pleaded|swore)\s+that/i;
        if (attributionRegex.test(block.text)) {
          warnings.push(`[AMBER Block Warning] Episode ${epIdx + 1}, Block ${bIdx + 1} appears to attribute thoughts/speech to a real party: "${block.text.substring(0, 60)}..."`);
        }
      }
    });
  });

  return {
    success: true,
    warnings
  };
}
