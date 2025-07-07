/**
 * Markdown Processing Utilities
 *
 * This module provides utilities for processing markdown content in changelog entries
 * with light theme styling. It handles conversion of markdown syntax to HTML with
 * appropriate Tailwind CSS classes for consistent visual hierarchy.
 *
 * Features:
 * - Markdown to HTML conversion with light theme styling
 * - Heading hierarchy processing (h1-h6)
 * - Text formatting (bold, italic, inline code)
 * - List processing (ordered and unordered)
 * - Horizontal rules and paragraph handling
 * - Content preview generation
 * - Reading time estimation
 *
 * @module markdownProcessor
 */

/**
 * Process markdown content and convert it to HTML with light theme styling
 *
 * Converts common markdown syntax to HTML elements with appropriate Tailwind classes
 * for light theme. Maintains proper visual hierarchy and spacing for readability.
 *
 * Supported markdown features:
 * - Headings (h1-h6) with size hierarchy
 * - Bold text (**text** and __text__)
 * - Italic text (*text* and _text_)
 * - Inline code (`code`)
 * - Horizontal rules (---)
 * - Ordered and unordered lists
 * - Paragraphs with proper spacing
 *
 * @param content - Raw markdown content string
 * @returns Processed HTML string with light theme Tailwind classes
 */
export function processMarkdownContent(content: string): string {
  if (!content) return "";

  let processedContent = content;

  // Process headings with light theme styling and proper hierarchy
  processedContent = processedContent
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">$1</h1>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-6">$1</h2>'
    )
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-5">$1</h3>'
    )
    .replace(
      /^#### (.+)$/gm,
      '<h4 class="text-lg font-medium text-gray-900 mb-2 mt-4">$1</h4>'
    )
    .replace(
      /^##### (.+)$/gm,
      '<h5 class="text-base font-medium text-gray-900 mb-2 mt-3">$1</h5>'
    )
    .replace(
      /^###### (.+)$/gm,
      '<h6 class="text-sm font-medium text-gray-900 mb-1 mt-2">$1</h6>'
    );

  // Process bold text (**text** and __text__)
  processedContent = processedContent
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-gray-900">$1</strong>'
    )
    .replace(
      /__(.*?)__/g,
      '<strong class="font-semibold text-gray-900">$1</strong>'
    );

  // Process italic text (*text* and _text_)
  processedContent = processedContent
    .replace(
      /(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)/g,
      '<em class="italic text-gray-800">$1</em>'
    )
    .replace(
      /(?<!_)_(?!_)([^_]+)(?<!_)_(?!_)/g,
      '<em class="italic text-gray-800">$1</em>'
    );

  // Process inline code
  processedContent = processedContent.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
  );

  // Process horizontal rules
  processedContent = processedContent.replace(
    /^---$/gm,
    '<hr class="border-gray-200 my-6">'
  );

  // Process unordered lists and mark them with data attribute
  processedContent = processedContent.replace(
    /^- (.+)$/gm,
    '<li class="text-gray-700 mb-1" data-list-type="unordered">$1</li>'
  );

  // Process ordered lists and mark them with data attribute
  processedContent = processedContent.replace(
    /^\d+\. (.+)$/gm,
    '<li class="text-gray-700 mb-1" data-list-type="ordered">$1</li>'
  );

  // Wrap consecutive list items in appropriate ul/ol tags based on their type
  processedContent = processedContent.replace(
    /(<li[^>]*data-list-type="(ordered|unordered)"[^>]*>[\s\S]*?<\/li>\s*)+/g,
    (match) => {
      // Determine list type from the first list item
      const listTypeMatch = match.match(/data-list-type="(ordered|unordered)"/);
      const listType = listTypeMatch ? listTypeMatch[1] : "unordered";

      // Remove data attributes from the final output
      const cleanedMatch = match.replace(
        /\s*data-list-type="(ordered|unordered)"/g,
        ""
      );

      if (listType === "ordered") {
        return `<ol class="list-decimal list-inside space-y-1 mb-4 ml-4">${cleanedMatch}</ol>`;
      } else {
        return `<ul class="list-disc list-inside space-y-1 mb-4 ml-4">${cleanedMatch}</ul>`;
      }
    }
  );

  // Process paragraphs (text that isn't already wrapped in HTML tags)
  const lines = processedContent.split("\n");
  const processedLines = lines.map((line) => {
    const trimmedLine = line.trim();

    // Skip empty lines, lines that start with HTML tags, or list items
    if (
      !trimmedLine ||
      trimmedLine.startsWith("<") ||
      trimmedLine.startsWith("-") ||
      /^\d+\./.test(trimmedLine)
    ) {
      return line;
    }

    // Wrap non-HTML lines in paragraph tags
    return `<p class="text-gray-700 mb-4 leading-relaxed">${trimmedLine}</p>`;
  });

  return processedLines.join("\n");
}

/**
 * Generate a content preview from processed markdown
 *
 * Creates a shortened version of the processed content for use in
 * collapsed states or preview cards. Strips HTML tags and limits
 * character count while preserving readability.
 *
 * @param content - Processed HTML content string
 * @param maxLength - Maximum character length for preview (default: 150)
 * @returns Truncated plain text preview
 */
export function generateContentPreview(
  content: string,
  maxLength: number = 150
): string {
  if (!content) return "";

  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, " ");

  // Clean up extra whitespace
  const cleanText = plainText.replace(/\s+/g, " ").trim();

  // Truncate to maxLength and add ellipsis if needed
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Find the last complete word within the limit
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
}

/**
 * Estimate reading time for processed content
 *
 * Calculates approximate reading time based on word count and
 * average reading speed. Useful for displaying reading time
 * estimates in the UI.
 *
 * @param content - Processed HTML content string
 * @param wordsPerMinute - Average reading speed (default: 200 WPM)
 * @returns Estimated reading time in minutes (minimum 1 minute)
 */
export function estimateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  if (!content) return 1;

  // Strip HTML tags and count words
  const plainText = content.replace(/<[^>]*>/g, " ");
  const wordCount = plainText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // Return minimum 1 minute
  return Math.max(1, readingTime);
}
