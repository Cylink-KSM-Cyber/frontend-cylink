/**
 * Markdown Processing Utilities
 * @description Utility functions for processing and rendering markdown content with proper styling
 */

/**
 * Process markdown content with proper heading hierarchy for dark theme
 * @param content - Raw markdown content
 * @returns Processed HTML string with TailwindCSS classes
 */
export function processMarkdownContent(content: string): string {
  return (
    content
      // Remove the main title (first h1) since we show it separately
      .replace(/^# .+$/m, "")
      // Convert horizontal rules
      .replace(/^---$/gm, '<hr class="border-gray-700 my-8">')
      // Convert h2 (##) to styled h2
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-2xl font-bold text-white mt-10 mb-6 leading-tight">$1</h2>'
      )
      // Convert h3 (###) to styled h3
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-xl font-semibold text-white mt-8 mb-4 leading-tight">$1</h3>'
      )
      // Convert h4 (####) to styled h4
      .replace(
        /^#### (.+)$/gm,
        '<h4 class="text-lg font-medium text-white mt-6 mb-3 leading-tight">$1</h4>'
      )
      // Convert h5 (#####) to styled h5
      .replace(
        /^##### (.+)$/gm,
        '<h5 class="text-base font-medium text-gray-200 mt-4 mb-2 leading-tight">$1</h5>'
      )
      // Convert h6 (######) to styled h6
      .replace(
        /^###### (.+)$/gm,
        '<h6 class="text-sm font-medium text-gray-300 mt-3 mb-2 leading-tight uppercase tracking-wide">$1</h6>'
      )
      // Convert unordered lists
      .replace(
        /^\- (.+)$/gm,
        '<li class="text-gray-300 leading-relaxed">$1</li>'
      )
      // Convert ordered lists
      .replace(
        /^\d+\. (.+)$/gm,
        '<li class="text-gray-300 leading-relaxed">$1</li>'
      )
      // Wrap consecutive list items in ul tags
      .replace(/(<li.*?<\/li>\s*)+/g, (match) => {
        return `<ul class="list-disc pl-6 space-y-2 mb-6 text-gray-300">${match}</ul>`;
      })
      // Convert bold text (** or __)
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-white">$1</strong>'
      )
      .replace(
        /__(.+?)__/g,
        '<strong class="font-semibold text-white">$1</strong>'
      )
      // Convert italic text (* or _)
      .replace(/\*(.+?)\*/g, '<em class="italic text-gray-200">$1</em>')
      .replace(/_(.+?)_/g, '<em class="italic text-gray-400">$1</em>')
      // Convert inline code
      .replace(
        /`(.+?)`/g,
        '<code class="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm font-mono">$1</code>'
      )
      // Convert paragraphs - split by double newlines and wrap non-tag content
      .split(/\n\s*\n/)
      .map((para) => {
        const trimmed = para.trim();
        if (!trimmed) return "";

        // If it's already a tag (heading, list, hr, etc.), return as is
        if (trimmed.startsWith("<")) return trimmed;

        // If it contains line breaks, preserve them
        if (trimmed.includes("\n")) {
          return `<p class="text-gray-300 leading-relaxed mb-4">${trimmed.replace(
            /\n/g,
            "<br>"
          )}</p>`;
        }

        // Regular paragraph
        return `<p class="text-gray-300 leading-relaxed mb-4">${trimmed}</p>`;
      })
      .join("\n\n")
  );
}

/**
 * Generate content preview for collapsed entries
 * @param content - Full content string
 * @param maxLength - Maximum length for preview (default: 150)
 * @returns Truncated content with ellipsis
 */
export function generateContentPreview(
  content: string,
  maxLength: number = 150
): string {
  // Remove markdown syntax for preview
  const cleanContent = content
    .replace(/^#+\s/gm, "") // Remove heading markers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold markers
    .replace(/\*(.+?)\*/g, "$1") // Remove italic markers
    .replace(/`(.+?)`/g, "$1") // Remove code markers
    .replace(/^\- /gm, "") // Remove list markers
    .replace(/\n/g, " ") // Replace newlines with spaces
    .trim();

  if (cleanContent.length <= maxLength) return cleanContent;
  return cleanContent.substring(0, maxLength) + "...";
}

/**
 * Extract reading time estimate from markdown content
 * @param content - Markdown content
 * @param wordsPerMinute - Reading speed (default: 200 WPM)
 * @returns Reading time in minutes
 */
export function estimateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  const cleanContent = content
    .replace(/^#+\s/gm, "") // Remove heading markers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold markers
    .replace(/\*(.+?)\*/g, "$1") // Remove italic markers
    .replace(/`(.+?)`/g, "$1") // Remove code markers
    .replace(/^\- /gm, "") // Remove list markers
    .trim();

  const wordCount = cleanContent.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
