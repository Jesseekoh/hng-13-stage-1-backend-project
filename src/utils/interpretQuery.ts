export type ParsedFilters = {
  is_palindrome: boolean;
  word_count: number;
  min_length: number;
  max_length: number;
  contains_character: string;
};

export function interpretQuery(query: string): ParsedFilters {
  query = query.toLowerCase();
  const filters = {} as ParsedFilters;
  console.log(query);
  if (query.includes("palindromic") || query.includes("palindrome")) {
    console.log("skibidi");
    filters.is_palindrome = true;
  }

  if (query.includes("single word")) {
    filters.word_count = 1;
  }

  const longerThan = query.match(/longer than (\d+)/);
  const shorterThan = query.match(/shorter than (\d+)/);

  if (shorterThan) filters.max_length = parseInt(shorterThan[1]!) - 1;
  if (longerThan) filters.min_length = parseInt(longerThan[1]!) + 1;

  const containsLetter = query.match(/letter (\w)/);
  if (containsLetter) {
    filters.contains_character = containsLetter[1]!;
  }

  if (query.includes("first vowel") && !filters.contains_character) {
    filters.contains_character = "a";
  }

  if (Object.keys(filters).length === 0)
    throw new Error("Unable to parse natural language query");

  return filters;
}
