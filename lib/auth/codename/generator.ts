import { ADJECTIVES, NOUNS, VERBS } from "./words";

/**
 * Get a random element from an array
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a unique codename in PascalCase format
 * Format: AdjectiveNounVerb (e.g., "SwiftPhantomStrikes")
 *
 * Note: Does NOT check for uniqueness against existing codenames.
 * The large word combination space makes collisions extremely rare.
 *
 * @returns A PascalCase codename string
 */
export function generateCodename(): string {
  // Create a Set to track used words in this codename
  const usedWords = new Set<string>();

  // Helper to get unique word from an array
  const getUniqueWord = (wordArray: string[]): string => {
    let word: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      word = getRandomElement(wordArray);
      attempts++;
    } while (usedWords.has(word) && attempts < maxAttempts);

    usedWords.add(word);
    return word;
  };

  const adjective = getUniqueWord(ADJECTIVES);
  const noun = getUniqueWord(NOUNS);
  const verb = getUniqueWord(VERBS);

  return `${adjective}${noun}${verb}`;
}
