/**
 * Changelog Utilities
 * @description Utility functions for reading, parsing, and processing changelog entries
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  ChangelogEntry,
  ChangelogFrontmatter,
  ChangelogGenerationOptions,
} from "@/interfaces/changelog";

/**
 * Directory containing changelog MDX files
 */
export const CHANGELOG_DIR = path.join(process.cwd(), "_changelog");

/**
 * Read and parse a single changelog file
 * @param filePath - Path to the changelog file
 * @returns Parsed changelog entry
 */
export async function parseChangelogFile(
  filePath: string
): Promise<ChangelogEntry | null> {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    // Validate required frontmatter fields
    const frontmatter = data as ChangelogFrontmatter;
    if (!frontmatter.title || !frontmatter.date || !frontmatter.version) {
      console.warn(
        `Invalid changelog entry: ${filePath} - missing required fields`
      );
      return null;
    }

    // Extract filename without extension
    const filename = path.basename(filePath, path.extname(filePath));

    // Create slug from filename (remove date prefix if exists)
    const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "");

    return {
      id: filename,
      frontmatter: {
        ...frontmatter,
        published: frontmatter.published ?? true,
        featured: frontmatter.featured ?? false,
        category: Array.isArray(frontmatter.category)
          ? frontmatter.category
          : [frontmatter.category],
        tags: frontmatter.tags ?? [],
      },
      content: content.trim(),
      filePath,
      slug,
    };
  } catch (error) {
    console.error(`Error parsing changelog file ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all changelog entries from the _changelog directory
 * @param options - Generation options
 * @returns Array of parsed changelog entries
 */
export async function getChangelogEntries(
  options: Partial<ChangelogGenerationOptions> = {}
): Promise<ChangelogEntry[]> {
  const {
    changelogDir = CHANGELOG_DIR,
    includeDrafts = false,
    sortOrder = "desc",
    limit,
  } = options;

  try {
    // Check if changelog directory exists
    if (!fs.existsSync(changelogDir)) {
      console.warn(`Changelog directory ${changelogDir} does not exist`);
      return [];
    }

    // Read all files in the changelog directory
    const files = fs.readdirSync(changelogDir);

    // Filter for .md and .mdx files
    const markdownFiles = files.filter(
      (file) => file.endsWith(".md") || file.endsWith(".mdx")
    );

    // Parse all changelog files
    const entries: ChangelogEntry[] = [];

    for (const file of markdownFiles) {
      const filePath = path.join(changelogDir, file);
      const entry = await parseChangelogFile(filePath);

      if (entry) {
        // Filter drafts if not including them
        if (!includeDrafts && entry.frontmatter.published === false) {
          continue;
        }

        entries.push(entry);
      }
    }

    // Sort entries by date
    const sortedEntries = entries.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);

      return sortOrder === "desc"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    // Apply limit if specified
    return limit ? sortedEntries.slice(0, limit) : sortedEntries;
  } catch (error) {
    console.error("Error reading changelog entries:", error);
    return [];
  }
}

/**
 * Get a single changelog entry by ID
 * @param id - Changelog entry ID (filename without extension)
 * @returns Changelog entry or null if not found
 */
export async function getChangelogEntryById(
  id: string
): Promise<ChangelogEntry | null> {
  const possibleFiles = [`${id}.md`, `${id}.mdx`];

  for (const filename of possibleFiles) {
    const filePath = path.join(CHANGELOG_DIR, filename);

    if (fs.existsSync(filePath)) {
      return await parseChangelogFile(filePath);
    }
  }

  return null;
}

/**
 * Validate changelog entry frontmatter
 * @param data - Frontmatter data to validate
 * @returns Validation result
 */
export function validateChangelogFrontmatter(data: Record<string, unknown>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.title) errors.push("Title is required");
  if (!data.date) errors.push("Date is required");
  if (!data.version) errors.push("Version is required");
  if (!data.author) errors.push("Author is required");
  if (!data.summary) errors.push("Summary is required");
  if (!data.category) errors.push("Category is required");

  // Validate date format (YYYY-MM-DD)
  if (
    data.date &&
    typeof data.date === "string" &&
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date)
  ) {
    errors.push("Date must be in YYYY-MM-DD format");
  }

  // Validate version format (semantic versioning)
  if (
    data.version &&
    typeof data.version === "string" &&
    !/^\d+\.\d+\.\d+/.test(data.version)
  ) {
    errors.push("Version should follow semantic versioning (e.g., 1.2.0)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate filename for a new changelog entry
 * @param title - Entry title
 * @param date - Entry date
 * @returns Generated filename
 */
export function generateChangelogFilename(title: string, date: string): string {
  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();

  return `${date}-${slug}.mdx`;
}

/**
 * Get unique categories from all changelog entries
 * @param entries - Array of changelog entries
 * @returns Array of unique categories
 */
export function getUniqueCategories(entries: ChangelogEntry[]): string[] {
  const categories = new Set<string>();

  entries.forEach((entry) => {
    entry.frontmatter.category.forEach((cat) => categories.add(cat));
  });

  return Array.from(categories).sort();
}

/**
 * Get unique tags from all changelog entries
 * @param entries - Array of changelog entries
 * @returns Array of unique tags
 */
export function getUniqueTags(entries: ChangelogEntry[]): string[] {
  const tags = new Set<string>();

  entries.forEach((entry) => {
    if (entry.frontmatter.tags) {
      entry.frontmatter.tags.forEach((tag) => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}

/**
 * Create a changelog entry template
 * @param options - Template options
 * @returns MDX template string
 */
export function createChangelogTemplate(options: {
  title: string;
  date: string;
  version: string;
  author: string;
  summary: string;
  category: string[];
  tags?: string[];
}): string {
  const {
    title,
    date,
    version,
    author,
    summary,
    category,
    tags = [],
  } = options;

  return `---
title: "${title}"
date: "${date}"
version: "${version}"
category: [${category.map((c) => `"${c}"`).join(", ")}]
author: "${author}"
summary: "${summary}"
published: true
featured: false${
    tags.length > 0 ? `\ntags: [${tags.map((t) => `"${t}"`).join(", ")}]` : ""
  }
---

# ${title}

${summary}

## What's New

- Feature 1 description
- Feature 2 description

## Improvements

- Improvement 1
- Improvement 2

## Bug Fixes

- Fix 1
- Fix 2

---

*Released on ${date} as version ${version}*
`;
}
