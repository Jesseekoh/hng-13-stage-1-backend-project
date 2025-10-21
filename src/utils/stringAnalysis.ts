import crypto from "crypto";

export interface StringAnalysisResult {
  id: string;
  value: string;
  properties: {
    length: number;
    is_palindrome: boolean;
    sha256_hash: string;
    unique_characters: number;
    word_count: number;
    character_frequency_map: Record<string, number>;
  };
  created_at: string;
}

/**
 * Generate SHA256 hash of a string
 */
export function generateSHA256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

/**
 * Check if a string is a palindrome
 */
export function isPalindrome(str: string): boolean {
  // const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleaned = str.toLowerCase();
  return cleaned === cleaned.split("").reverse().join("");
}

/**
 * Count unique characters in a string
 */
export function countUniqueCharacters(str: string): number {
  return new Set(str).size;
}

/**
 * Count words in a string
 */
export function countWords(str: string): number {
  if (!str.trim()) return 0;
  return str.trim().split(/\s+/).length;
}

/**
 * Create character frequency map
 */
export function createCharacterFrequencyMap(
  str: string,
): Record<string, number> {
  const frequencyMap: Record<string, number> = {};

  for (const char of str) {
    frequencyMap[char] = (frequencyMap[char] || 0) + 1;
  }

  return frequencyMap;
}

/**
 * Analyze a string and return a StringAnalysisResult object
 */
export function analyzeString(input: string): StringAnalysisResult {
  const hash = generateSHA256(input);
  return {
    id: hash,
    value: input,
    properties: {
      length: input.length,
      is_palindrome: isPalindrome(input),
      unique_characters: countUniqueCharacters(input),
      word_count: countWords(input),
      sha256_hash: hash,
      character_frequency_map: createCharacterFrequencyMap(input),
    },
    created_at: new Date().toISOString(),
  };
}
