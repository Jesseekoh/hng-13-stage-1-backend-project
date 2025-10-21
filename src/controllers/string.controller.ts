import { stringRequestSchema } from "../schama";
import type { Request, Response, NextFunction } from "express";
import type { ParsedFilters } from "../utils/interpretQuery";
import {
  analyzeString,
  generateSHA256,
  StringAnalysisResult,
} from "../utils/stringAnalysis";
import { interpretQuery } from "../utils/interpretQuery";

const strings: StringAnalysisResult[] = [];

export async function analyzeStringController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.body === undefined || req.body.value === undefined) {
      return res.status(400).json({
        message: 'Invalid request body or missing "value" field',
      });
    }

    const validationResult = stringRequestSchema.parse(req.body);
    const { value } = validationResult;
    const hash = generateSHA256(value);

    const existingString = strings.find((s) => s.value === value);

    if (existingString) {
      return res.status(409).json({
        message: "String already exists",
      });
    }

    const result = analyzeString(value.trim());

    strings.push(result);
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
}

export async function getStringController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { value } = req.params;

    const validationResult = stringRequestSchema.parse(req.params);
    const result = strings.find((s) => s.value === value);
    if (!result) return res.status(404).json({ error: "String not found" });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getFilteredStringsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let result: StringAnalysisResult[] = [...strings];
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = req.query;

    if (is_palindrome === "true") {
      result = result.filter((s) => s.properties.is_palindrome === true);
    }
    if (min_length) {
      result = result.filter((s) => s.properties.length >= +min_length);
    }
    if (word_count) {
      result = result.filter((s) => s.properties.word_count === +word_count);
    }
    if (max_length) {
      result = result.filter((s) => s.properties.length <= +max_length);
    }
    if (contains_character) {
      result = result.filter((s) =>
        s.value.includes(contains_character as string),
      );
    }

    res.status(200).json({
      data: result,
      count: result.length,
      filters_applied: {
        is_palindrome,
        min_length,
        max_length,
        word_count,
        contains_character,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function filterByNaturalLanguage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { query } = req.query;
    if (!query) {
      res.status(400).json({
        message: 'Invalid request body or missing "value" field',
      });
    }

    let filters: ParsedFilters = {} as ParsedFilters;
    try {
      filters = interpretQuery(query as string);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }

    let filteredStrings = [...strings];

    if (filters.is_palindrome) {
      filteredStrings = filteredStrings.filter(
        (s) => s.properties.is_palindrome === true,
      );
    }
    console.log(filteredStrings);
    if (filters.min_length) {
      filteredStrings = filteredStrings.filter(
        (s) => s.properties.length >= +filters.min_length,
      );
    }
    if (filters.word_count) {
      filteredStrings = filteredStrings.filter(
        (s) => s.properties.word_count === +filters.word_count,
      );
    }
    if (filters.max_length) {
      filteredStrings = filteredStrings.filter(
        (s) => s.properties.length <= +filters.max_length,
      );
    }
    if (filters.contains_character) {
      filteredStrings = filteredStrings.filter((s) =>
        s.value.includes(filters.contains_character as string),
      );
    }
    res.json({
      data: filteredStrings,
      count: filteredStrings.length,
      interpreted_query: {
        original: query,
        parsed_filters: filters,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStringController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const validationResult = stringRequestSchema.parse(req.params);
    const existingIndex = strings.findIndex(
      (s) => s.value === validationResult.value,
    );

    if (existingIndex === -1) {
      return res.status(404).json({ error: "String not found" });
    }

    strings.splice(existingIndex, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
