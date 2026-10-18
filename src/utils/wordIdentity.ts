/**
 * Normalizes English headwords for robust comparison.
 * Strips whitespace, lowercases, and removes punctuation so that:
 * "Learn", "learn", "LEARN", and "  learn!  " map to the exact same word identity.
 */
export function normalizeHeadword(word: string): string {
  if (!word) return '';
  return word
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function areSameWord(w1: string, w2: string): boolean {
  return normalizeHeadword(w1) === normalizeHeadword(w2);
}
