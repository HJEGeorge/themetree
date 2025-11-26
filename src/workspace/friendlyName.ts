/**
 * Generates random friendly name suffixes like "swift-falcon" or "cosmic-phoenix".
 * Uses curated word lists to avoid offensive combinations.
 */

const ADJECTIVES = [
  'autumn', 'bold', 'bright', 'calm', 'clever', 'cosmic', 'crisp', 'crystal',
  'daring', 'dawn', 'deep', 'dusty', 'eager', 'early', 'fading', 'fierce',
  'floral', 'forest', 'frosty', 'gentle', 'golden', 'grand', 'happy', 'hidden',
  'hollow', 'humble', 'icy', 'jolly', 'keen', 'lively', 'lucky', 'lunar',
  'misty', 'morning', 'noble', 'northern', 'odd', 'pale', 'patient', 'peaceful',
  'plain', 'polite', 'proud', 'quiet', 'rapid', 'restless', 'rocky', 'royal',
  'rustic', 'sandy', 'serene', 'shiny', 'silent', 'silver', 'simple', 'sleepy',
  'snowy', 'soft', 'solar', 'solid', 'sparkling', 'spring', 'stellar', 'still',
  'storm', 'summer', 'swift', 'tidal', 'twilight', 'velvet', 'wandering', 'warm',
  'western', 'wild', 'winter', 'wispy', 'young', 'zesty'
];

const NOUNS = [
  'aurora', 'badger', 'brook', 'canyon', 'cedar', 'cloud', 'comet', 'coral',
  'crane', 'creek', 'dawn', 'delta', 'dove', 'dream', 'dusk', 'eagle',
  'ember', 'falcon', 'fern', 'field', 'finch', 'flame', 'forest', 'fox',
  'frost', 'glade', 'grove', 'harbor', 'hawk', 'heron', 'hill', 'horizon',
  'island', 'lake', 'leaf', 'luna', 'maple', 'meadow', 'mist', 'moon',
  'moss', 'mountain', 'night', 'oak', 'ocean', 'otter', 'owl', 'palm',
  'peak', 'pebble', 'phoenix', 'pine', 'pond', 'rain', 'raven', 'reef',
  'ridge', 'river', 'robin', 'rock', 'rose', 'sage', 'shadow', 'shore',
  'sky', 'snow', 'sparrow', 'spirit', 'star', 'stone', 'stream', 'sun',
  'thunder', 'tide', 'trail', 'tree', 'valley', 'wave', 'willow', 'wind'
];

/**
 * Generate a random friendly suffix.
 */
function generateFriendlySuffix(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adjective}-${noun}`;
}

/**
 * Generate a unique workspace name: projectName-adjective-noun
 */
export function generateWorkspaceName(projectName: string, existingNames: Set<string>): string {
  const safeName = projectName.replace(/[^a-zA-Z0-9-_]/g, '_');
  
  // Try to generate a unique name
  for (let attempts = 0; attempts < 100; attempts++) {
    const suffix = generateFriendlySuffix();
    const name = `${safeName}-${suffix}`;
    if (!existingNames.has(name)) {
      return name;
    }
  }
  
  // Fall back to adding a numeric suffix
  const suffix = generateFriendlySuffix();
  let counter = 2;
  let name = `${safeName}-${suffix}`;
  while (existingNames.has(`${name}-${counter}`)) {
    counter++;
  }
  return `${name}-${counter}`;
}

