/**
 * Deterministic hash function for branch names.
 * Uses djb2 algorithm - fast and produces good distribution.
 * Same input always produces same output across all machines.
 */
export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) + hash) ^ char; // hash * 33 ^ char
  }
  return Math.abs(hash);
}

/**
 * Maps a hash to an index within a given range.
 * Uses golden ratio distribution for better spread.
 */
export function hashToIndex(hash: number, maxIndex: number): number {
  // Golden ratio for better distribution
  const goldenRatio = 0.618033988749895;
  const normalized = (hash * goldenRatio) % 1;
  return Math.floor(normalized * maxIndex);
}

