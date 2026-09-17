import { CasePromptContext, getCaseVisualPrompts } from '@/lib/ai/visualPrompts';

export interface SmartPromptResult {
  poster: string;
  exhibit: string;
  verdict: string;
  provider: 'Groq (Llama 3.3 70B)' | 'Google Gemini' | 'OpenAI' | 'Archetype Fallback';
  caseSummaryUsed?: string;
}

export interface PromptGenerationRequest {
  caseData: {
    title?: string | { en?: string; hi?: string };
    shortTitle?: string;
    court?: string;
    year?: number | string;
    genre?: string;
    categoryTag?: string;
    statuteSections?: string;
    facts?: string | { en?: string; hi?: string };
    held?: string | { en?: string; hi?: string };
    hook?: string | { en?: string; hi?: string };
    slug?: string;
    brief?: any;
    episodes?: any[];
  };
  artStyle?: string;
  customInstruction?: string;
  targetSlot?: 'all' | 'poster' | 'exhibit' | 'verdict';
}

const ART_DIRECTOR_SYSTEM_PROMPT = `You are a world-class Legal Cinematographer, Historical Art Director, and Master AI Image Prompt Engineer.
Your job is to read real Indian legal cases and craft 3 bespoke, photorealistic, historically accurate, visually stunning Midjourney/FLUX/Imagen 3 image prompts.

Each prompt must follow these professional prompt engineering principles:
1. HISTORICAL & ERA FIDELITY: Reflect the exact year/era (e.g. 1950s Bombay high-society & wooden naval courts, 1970s Kerala monastery & retro court benches, 1990s industrial pollution, 2010s modern high court). Use appropriate period clothing (e.g. vintage advocate collar bands, cotton robes, traditional Indian dress, period military uniforms).
2. CINEMATOGRAPHY & LIGHTING: Specify 35mm film stock (e.g. Kodak Portra 400, Tri-X 400 for black & white, Kodachrome), natural lighting, dramatic chiaroscuro, volumetric dust rays through high court windows, shallow depth of field (f/1.8).
3. THREE SPECIFIC ROLES:
   - POSTER (Hero/Cover Visual): Cinematic, atmospheric wide or medium shot capturing the emotional and thematic essence of the case.
   - EXHIBIT (Authentic Archival Evidence / Key Subject / Crime Scene / Document): Forensic documentary feel, macro or table-top view of aged evidence, typed FIR with red wax seals, period newspaper headline, or key figure in period attire.
   - VERDICT (The Judicial Bench / Courtroom Climax / Law vs Reality): Solemn judicial bench with Indian national emblem, heavy teak gavel, scales of justice, tense courtroom gallery, or triumphant constitutional climax.
4. QUALITY TAGS: End prompts with concise photography aesthetics: "photorealistic, cinematic film still, 35mm photography, 8k resolution, authentic period details, dramatic lighting, no modern digital artifacts, award-winning cinematography".
5. NO TEXT OVERLAY WATERMARKS: The image should look like a genuine photograph/film still, not a poster with fake text printed across it.

Output MUST BE strict JSON in this exact structure:
{
  "poster": "detailed prompt for cover poster...",
  "exhibit": "detailed prompt for archival evidence/exhibit...",
  "verdict": "detailed prompt for courtroom verdict/bench scene...",
  "caseSummaryUsed": "1-sentence summary of the core visual theme"
}`;

function extractJsonFromText(raw: string): { poster?: string; exhibit?: string; verdict?: string; caseSummaryUsed?: string } | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch {}
    }
  }
  return null;
}

/**
 * Dynamic model cache to avoid repeated model listing
 */
let cachedGroqModels: string[] | null = null;
let cachedGeminiModels: string[] | null = null;

async function getActiveGroqModels(apiKey: string): Promise<string[]> {
  if (cachedGroqModels && cachedGroqModels.length > 0) return cachedGroqModels;
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey.trim()}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        const active = data.data
          .map((m: { id: string }) => m.id)
          .filter((id: string) => !id.includes('whisper') && !id.includes('tts'));
        if (active.length > 0) {
          cachedGroqModels = active;
          console.log('⚡ Discovered active Groq models:', active);
          return active;
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch Groq model list:', err);
  }
  return [
    'llama-3.3-70b-versatile',
    'llama-3.2-11b-vision-preview',
    'llama-3.2-3b-preview',
    'llama3-70b-8192',
    'llama3-8b-8192',
    'qwen-2.5-32b',
    'deepseek-r1-distill-llama-70b',
  ];
}

async function getActiveGeminiModels(apiKey: string): Promise<string[]> {
  if (cachedGeminiModels && cachedGeminiModels.length > 0) return cachedGeminiModels;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`, {
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.models) && data.models.length > 0) {
        const active = data.models
          .filter((m: { supportedGenerationMethods?: string[] }) =>
            m.supportedGenerationMethods?.includes('generateContent')
          )
          .map((m: { name: string }) => m.name.replace(/^models\//, ''));
        if (active.length > 0) {
          cachedGeminiModels = active;
          console.log('⚡ Discovered active Gemini models:', active);
          return active;
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch Gemini model list:', err);
  }
  return [
    'gemini-3.6-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
  ];
}

/**
 * Call Groq API with dynamic active models
 */
async function callGroq(userPrompt: string): Promise<{ poster: string; exhibit: string; verdict: string; caseSummaryUsed?: string } | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;

  const models = await getActiveGroqModels(apiKey);

  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: ART_DIRECTOR_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Groq (${model}) error status ${response.status}:`, errText);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = extractJsonFromText(content);
        if (parsed?.poster && parsed?.exhibit && parsed?.verdict) {
          return {
            poster: parsed.poster,
            exhibit: parsed.exhibit,
            verdict: parsed.verdict,
            caseSummaryUsed: parsed.caseSummaryUsed,
          };
        }
      }
    } catch (err) {
      console.warn(`Groq prompt generation with ${model} failed:`, err);
    }
  }

  return null;
}

/**
 * Call Google Gemini API with dynamic active models
 */
async function callGemini(userPrompt: string): Promise<{ poster: string; exhibit: string; verdict: string; caseSummaryUsed?: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;

  const models = await getActiveGeminiModels(apiKey);

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${ART_DIRECTOR_SYSTEM_PROMPT}\n\nCase Details to Art Direct:\n${userPrompt}\n\nReturn strictly valid JSON.` }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = extractJsonFromText(rawText);
          if (parsed?.poster && parsed?.exhibit && parsed?.verdict) {
            return {
              poster: parsed.poster,
              exhibit: parsed.exhibit,
              verdict: parsed.verdict,
              caseSummaryUsed: parsed.caseSummaryUsed,
            };
          }
        }
      } else {
        const errText = await response.text();
        console.warn(`Gemini (${model}) error status ${response.status}:`, errText);
      }
    } catch (err) {
      console.warn(`Gemini prompt generation with ${model} failed:`, err);
    }
  }

  return null;
}

/**
 * Call OpenAI API if configured
 */
async function callOpenAI(userPrompt: string): Promise<{ poster: string; exhibit: string; verdict: string; caseSummaryUsed?: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: ART_DIRECTOR_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.poster && parsed.exhibit && parsed.verdict) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('OpenAI prompt generation failed:', err);
  }
  return null;
}

/**
 * Main Smart Prompt Generator
 * Tries Groq -> Gemini -> OpenAI -> Archetype Fallback
 */
export async function generateSmartPromptsWithLLM(req: PromptGenerationRequest): Promise<SmartPromptResult> {
  const { caseData, artStyle, customInstruction } = req;

  const title = typeof caseData.title === 'string' ? caseData.title : caseData.title?.en || caseData.slug || 'Landmark Legal Case';
  const court = caseData.court || 'Supreme Court of India';
  const year = caseData.year || 2020;
  const genre = caseData.genre || caseData.categoryTag || 'Constitutional';
  const facts = typeof caseData.facts === 'string' ? caseData.facts : caseData.facts?.en || caseData.hook || '';
  const held = typeof caseData.held === 'string' ? caseData.held : caseData.held?.en || '';
  const statutes = caseData.statuteSections || '';

  const userPrompt = `
CASE FILE DETAILS:
- Title: ${title}
- Court & Year: ${court} (${year})
- Legal Category/Genre: ${genre}
- Key Statutes / Sections: ${statutes}
- Facts & Context: ${facts}
- Court Holding / Decision: ${held}
- Preferred Aesthetic / Art Style: ${artStyle || 'Cinematic 35mm Period Film, authentic retro lighting'}
${customInstruction ? `- Custom User Direction: ${customInstruction}` : ''}

Generate 3 deeply tailored, award-winning visual prompts:
1. "poster": Hero/Cover still representing the thematic core of ${title}.
2. "exhibit": Archival period evidence, typed forensic docket, aged newspaper cutting, or primary physical subject.
3. "verdict": High-stakes judicial courtroom bench, solemn judgment reading, or decisive legal moment.
`;

  // 1. Try Groq (Ultra-fast Llama-3.3-70B)
  const groqResult = await callGroq(userPrompt);
  if (groqResult) {
    return {
      poster: groqResult.poster,
      exhibit: groqResult.exhibit,
      verdict: groqResult.verdict,
      provider: 'Groq (Llama 3.3 70B)',
      caseSummaryUsed: groqResult.caseSummaryUsed,
    };
  }

  // 2. Try Google Gemini
  const geminiResult = await callGemini(userPrompt);
  if (geminiResult) {
    return {
      poster: geminiResult.poster,
      exhibit: geminiResult.exhibit,
      verdict: geminiResult.verdict,
      provider: 'Google Gemini',
      caseSummaryUsed: geminiResult.caseSummaryUsed,
    };
  }

  // 3. Try OpenAI
  const openaiResult = await callOpenAI(userPrompt);
  if (openaiResult) {
    return {
      poster: openaiResult.poster,
      exhibit: openaiResult.exhibit,
      verdict: openaiResult.verdict,
      provider: 'OpenAI',
      caseSummaryUsed: openaiResult.caseSummaryUsed,
    };
  }

  // 4. Fallback to Dynamic Archetype Engine
  const ctx: CasePromptContext = {
    title,
    court,
    year,
    genre,
    categoryTag: genre,
    slug: caseData.slug,
  };
  const fallbackSet = getCaseVisualPrompts(ctx, { forceRandom: false });

  return {
    poster: fallbackSet.poster.prompt,
    exhibit: fallbackSet.exhibit.prompt,
    verdict: fallbackSet.verdict.prompt,
    provider: 'Archetype Fallback',
    caseSummaryUsed: `${title} (${year})`,
  };
}
