import { PersonaItem, Episode } from '@/types/case';

/**
 * Checks if a string contains embedded PERSONA markers (e.g. "PERSONA 1", "PERSONA 01").
 */
export function hasPersonaFormat(text?: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return /\bPERSONA\s+\d+/i.test(text);
}

/**
 * Extracts individual personas from unstructured or serialized text.
 * e.g., "PERSONA 1 · SHAH BANO BEGUM (The Petitioner / Indigent Divorced Wife) A 62-year-old..."
 */
export function extractPersonasFromText(text?: string): PersonaItem[] {
  if (!text || typeof text !== 'string' || !hasPersonaFormat(text)) return [];

  // Split on boundaries like "PERSONA 1", "PERSONA 2", "PERSONA 01"
  const parts = text.split(/(?=\bPERSONA\s+\d+[\s:·\-\–])/i);

  const results: PersonaItem[] = [];

  parts.forEach((part, idx) => {
    const trimmed = part.trim();
    if (!trimmed.toLowerCase().startsWith('persona')) return;

    // Pattern 1: PERSONA X · NAME (ROLE) Description...
    const matchWithRole = trimmed.match(
      /^PERSONA\s+(\d+)\s*[:·\-\–]?\s*([A-Z0-9\s\.\,\&/'\-]+?)\s*\(([^)]+)\)\s*([A-Za-z0-9][\s\S]*)$/
    );

    if (matchWithRole) {
      results.push({
        name: matchWithRole[2].trim(),
        role: matchWithRole[3].trim(),
        tag: matchWithRole[3].trim(),
        description: matchWithRole[4].trim(),
      });
      return;
    }

    // Pattern 2: PERSONA X · ALL_CAPS_NAME Rest of description...
    const matchCaps = trimmed.match(
      /^PERSONA\s+(\d+)\s*[:·\-\–]?\s*([A-Z0-9\s\.\,\&/'\-]{3,120}?)\s+((?:The|A|An|In|On|When|Having|After|Decorated|Represented|Delivered|Acquitted|Head|Led|Authored|[A-Z][a-z])[\s\S]*)$/
    );

    if (matchCaps) {
      const pNum = parseInt(matchCaps[1], 10);
      results.push({
        name: matchCaps[2].trim(),
        role: `Persona 0${pNum}`,
        tag: 'Litigant / Entity',
        description: matchCaps[3].trim(),
      });
      return;
    }

    // Fallback: Generic Persona extractor
    const pNumMatch = trimmed.match(/^PERSONA\s+(\d+)/i);
    const pNum = pNumMatch ? parseInt(pNumMatch[1], 10) : idx + 1;
    const cleanDesc = trimmed.replace(/^PERSONA\s+\d+\s*[:·\-\–]?\s*/i, '');

    results.push({
      name: `Persona ${pNum}`,
      role: 'Key Litigant',
      tag: 'Trial Entity',
      description: cleanDesc,
    });
  });

  return results;
}

/**
 * Returns dynamic personas for an episode, checking both structured array and fallback text parsing.
 */
export function getEpisodePersonas(
  episode: Episode,
  depth: 'story' | 'student' | 'advocate' = 'story'
): PersonaItem[] {
  // 1. If explicit personas array exists and is non-empty, return it
  if (episode.personas && Array.isArray(episode.personas) && episode.personas.length > 0) {
    return episode.personas;
  }
  if (episode.characters && Array.isArray(episode.characters) && episode.characters.length > 0) {
    return episode.characters;
  }

  // 2. Check current depth layer text
  const currentText = episode.layers?.[depth]?.blocks?.[0]?.text;
  if (currentText && hasPersonaFormat(currentText)) {
    return extractPersonasFromText(currentText);
  }

  // 3. Check story layer text as fallback
  const storyText = episode.layers?.story?.blocks?.[0]?.text;
  if (storyText && hasPersonaFormat(storyText)) {
    return extractPersonasFromText(storyText);
  }

  return [];
}
