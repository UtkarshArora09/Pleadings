import { z } from 'zod';

const optionalHoneypot = z.string().max(120).optional().default('');
const optionalTurnstile = z.string().max(4096).optional();

export const AdminLoginSchema = z.object({
  key: z.string().min(1).max(256).optional(),
  password: z.string().min(1).max(256).optional(),
  pin: z.string().min(1).max(256).optional(),
});

export const SubscribeSchema = z
  .object({
    contact: z.string().trim().min(5, 'Valid contact is required').max(160),
    channel: z.enum(['whatsapp', 'email']).default('whatsapp'),
    caseSlug: z.string().trim().max(140).optional().default('general'),
    frequency: z.string().trim().max(40).optional().default('daily-3min'),
    website: optionalHoneypot,
    turnstileToken: optionalTurnstile,
  })
  .superRefine((data, ctx) => {
    if (data.channel === 'email') {
      const emailCheck = z.string().email().safeParse(data.contact);
      if (!emailCheck.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contact'],
          message: 'Please enter a valid email address.',
        });
      }
    } else {
      const digits = data.contact.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contact'],
          message: 'Please enter a valid 10-to-15 digit WhatsApp phone number.',
        });
      }
    }
  });

export const SuggestCaseSchema = z.object({
  caseName: z.string().trim().min(3, 'Case name or topic is required').max(240),
  courtOrCity: z.string().trim().max(160).optional().default('Not specified'),
  year: z.string().trim().max(40).optional().default('Unknown'),
  storySynopsis: z.string().trim().min(10, 'Please provide a brief summary of what happened').max(4000),
  contributorName: z.string().trim().max(120).optional().default('Anonymous'),
  contributorContact: z.string().trim().max(160).optional().default('None'),
  website: optionalHoneypot,
  turnstileToken: optionalTurnstile,
});

export const ContributeSchema = z.object({
  advocateName: z.string().trim().min(2).max(140),
  barCouncilNo: z.string().trim().min(2).max(80),
  barAssociation: z.string().trim().max(160).optional().default('High Court / Supreme Court Bar'),
  email: z.string().trim().email('Please provide a valid email address.').max(160),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(30)
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Please provide a valid 10-digit phone number.'),
  designation: z.string().trim().max(100).optional().default('Advocate'),
  caseTitle: z.string().trim().min(3).max(260),
  court: z.string().trim().min(2).max(160),
  year: z.union([z.string(), z.number()]).transform((v) => String(v).trim()).refine((v) => /^\d{4}$/.test(v), {
    message: 'Year must be a valid 4-digit year.',
  }),
  citation: z.string().trim().min(2).max(200),
  statutes: z.string().trim().min(2).max(500),
  doctrine: z.string().trim().max(240).optional().default(''),
  facts: z.string().trim().min(20, 'Please provide a concise factual summary').max(10000),
  issues: z.string().trim().max(4000).optional().default(''),
  prosecutionArgs: z.string().trim().max(5000).optional().default(''),
  defenceArgs: z.string().trim().max(5000).optional().default(''),
  holdingAndRatio: z.string().trim().min(15, 'Please provide the court holding and ratio').max(8000),
  whyItMatters: z.string().trim().max(4000).optional().default(''),
  judgmentUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default('')
    .refine((v) => !v || /^https?:\/\//i.test(v), 'Judgment URL must start with http:// or https://'),
  additionalNotes: z.string().trim().max(3000).optional().default(''),
  website: optionalHoneypot,
  turnstileToken: optionalTurnstile,
});

export const ReportErrorSchema = z.object({
  slug: z.string().trim().min(1).max(160),
  episode: z.union([z.number().int().min(1).max(20), z.string().max(40)]).optional(),
  description: z.string().trim().min(8, 'Please describe the inaccuracy clearly.').max(3000),
  reporterEmail: z
    .string()
    .trim()
    .max(160)
    .optional()
    .default('')
    .refine((v) => !v || z.string().email().safeParse(v).success, 'Please provide a valid email address.'),
  website: optionalHoneypot,
  turnstileToken: optionalTurnstile,
});

export const VoteSchema = z.object({
  slug: z.string().trim().min(1).max(160),
  optionId: z.string().trim().min(1).max(80),
  anonId: z.string().trim().min(4).max(120),
});

export const GenerateImageSchema = z.object({
  prompt: z.string().trim().min(5, 'Image prompt is required').max(2000),
  slug: z.string().trim().max(120).optional().default('case'),
  type: z.string().trim().max(60).optional().default('poster'),
  aspectRatio: z.enum(['16:9', '21:9', '1:1', '4:3', '3:4', '9:16']).optional().default('16:9'),
});

export const GeneratePromptsSchema = z.object({
  caseData: z.record(z.string(), z.unknown()),
  artStyle: z.string().trim().max(200).optional(),
  customInstruction: z.string().trim().max(1000).optional(),
  targetSlot: z.enum(['all', 'poster', 'exhibit', 'verdict']).optional().default('all'),
});

const PublishStatusEnum = z.enum(['DRAFT', 'ADMIN_REVIEW', 'PUBLISHED', 'ARCHIVED']);
const LegalStatusObjectSchema = z.object({
  code: z.enum(['GOOD_LAW', 'PARTLY_SUPERSEDED', 'OVERRULED', 'STATUTE_REPLACED']),
  explain: z.string().max(2000),
  chain: z
    .array(
      z.object({
        year: z.number(),
        event: z.string().max(500),
      })
    )
    .optional()
    .default([]),
});

/**
 * Explicit allowlist for Admin Case updates (prevents mass-assignment of unexpected top-level fields
 * and prototype pollution keys like __proto__, constructor, prototype).
 */
export const AdminCaseUpdateSchema = z
  .object({
    slug: z.string().trim().min(1).max(180).optional(),
    title: z.union([z.string().max(300), z.object({ en: z.string().max(300), hi: z.string().max(300) })]).optional(),
    blurb: z.union([z.string().max(2000), z.object({ en: z.string().max(2000), hi: z.string().max(2000) })]).optional(),
    hook: z.string().max(2000).optional(),
    court: z.string().max(200).optional(),
    year: z.union([z.number().int().min(1700).max(2100), z.string().max(10)]).optional(),
    decidedOn: z.string().max(60).optional(),
    bench: z.array(z.string().max(200)).max(30).optional(),
    citation: z.string().max(250).optional(),
    citations: z
      .object({
        primary: z.string().max(250),
        parallel: z.array(z.string().max(250)).max(20).optional(),
        neutral: z.string().max(250).optional(),
      })
      .optional(),
    judgmentUrl: z.string().max(600).optional(),
    sourceUrl: z.string().max(600).optional(),
    categoryTag: z.string().max(120).optional(),
    genre: z.string().max(80).optional(),
    theme: z.string().max(80).optional(),
    tag: z.union([z.string().max(120), z.object({ en: z.string().max(120), hi: z.string().max(120) })]).optional(),
    doctrines: z.array(z.string().max(160)).max(30).optional(),
    categories: z.array(z.string().max(100)).max(20).optional(),
    bannerImage: z.string().max(2_000_000).optional(),
    poster: z
      .object({
        src: z.string().max(2_000_000),
        alt: z.string().max(400),
        provenance: z.enum(['archival', 'illustration']),
      })
      .optional(),
    rank: z.number().int().min(1).max(1000).optional(),
    featured: z.boolean().optional(),
    matchRate: z.number().min(0).max(100).optional(),
    maturityRating: z.string().max(40).optional(),
    watermark: z.string().max(120).optional(),
    readTime: z.union([z.string().max(60), z.object({ en: z.string().max(60), hi: z.string().max(60) })]).optional(),
    readingTime: z
      .object({
        story: z.number(),
        student: z.number(),
        advocate: z.number(),
      })
      .optional(),
    publishStatus: PublishStatusEnum.optional(),
    legalStatus: LegalStatusObjectSchema.optional(),
    status: z.union([PublishStatusEnum, LegalStatusObjectSchema]).optional(),
    views: z.number().int().min(0).optional(),
    panels: z.array(z.unknown()).max(16).optional(),
    episodes: z.array(z.unknown()).max(16).optional(),
    lawyerEpisodes: z.array(z.unknown()).max(12).optional(),
    brief: z.record(z.string(), z.unknown()).optional(),
    vote: z.record(z.string(), z.unknown()).optional(),
    glossary: z.array(z.unknown()).max(60).optional(),
    flashcards: z.array(z.unknown()).max(50).optional(),
    affectsYou: z.record(z.string(), z.unknown()).optional(),
    timeline: z.array(z.unknown()).max(60).optional(),
    relatedSlugs: z.array(z.string().max(160)).max(20).optional(),
    subsequentHistory: z.array(z.unknown()).max(50).optional(),
    advocateReference: z.record(z.string(), z.unknown()).optional(),
    sources: z.array(z.unknown()).max(40).optional(),
    statuteMap: z.array(z.unknown()).max(60).optional(),
    review: z.record(z.string(), z.unknown()).optional(),
    characters: z.array(z.unknown()).max(40).optional(),
    featuredHeroHook: z.union([z.string().max(1000), z.object({ en: z.string().max(1000), hi: z.string().max(1000) })]).optional(),
    featuredHeroDesc: z.union([z.string().max(2000), z.object({ en: z.string().max(2000), hi: z.string().max(2000) })]).optional(),
    hi: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const AdminCaseCreateSchema = AdminCaseUpdateSchema.extend({
  shortTitle: z.string().max(200).optional(),
  statuteSections: z.string().max(1000).optional(),
  factsSummary: z.string().max(20000).optional(),
  facts: z.string().max(20000).optional(),
  issues: z.union([z.string().max(10000), z.array(z.string().max(1000))]).optional(),
  arguments: z.string().max(15000).optional(),
  holding: z.string().max(15000).optional(),
  reasoning: z.string().max(15000).optional(),
  significance: z.string().max(10000).optional(),
  reviewer: z.string().max(200).optional(),
  enrolmentNumber: z.string().max(100).optional(),
  enrolment: z.string().max(100).optional(),
  publishedAt: z.string().max(60).optional(),
  judgmentText: z.string().max(100000).optional(),
  additionalNotes: z.string().max(50000).optional(),
  makeTrendingTop10: z.boolean().optional(),
  studentRatio: z.string().max(10000).optional(),
  studentObiter: z.union([z.string().max(10000), z.array(z.string().max(2000))]).optional(),
  studentExamAngle: z.string().max(10000).optional(),
  studentFlashcards: z.array(z.unknown()).optional(),
  advocateStrategy: z.string().max(10000).optional(),
  advocatePinpoints: z.union([z.string().max(10000), z.array(z.string().max(2000))]).optional(),
  advocateTrialPropositions: z.union([z.string().max(10000), z.array(z.string().max(2000))]).optional(),
  advocateSubsequentHistory: z.array(z.unknown()).optional(),
  parallelCitations: z.union([z.string().max(2000), z.array(z.string().max(500))]).optional(),
  personas: z.array(z.unknown()).optional(),
}).passthrough();
