import { Metadata } from "next";
import { getChangelogEntries } from "@/utils/changelog";
import { ChangelogEntry } from "@/interfaces/changelog";

/**
 * Changelog Page Metadata
 * @description SEO-optimized metadata for the changelog page
 */
export const metadata: Metadata = {
  title: "Changelog | CyLink - Latest Updates & Improvements",
  description:
    "Stay informed about the latest updates, new features, and improvements to the CyLink platform. View our complete changelog of releases and enhancements.",
  keywords: [
    "CyLink changelog",
    "URL shortener updates",
    "platform improvements",
    "new features",
    "bug fixes",
    "security updates",
    "KSM Cyber Security",
  ],
  openGraph: {
    title: "CyLink Changelog - Latest Updates & Features",
    description:
      "Discover the latest updates and improvements to CyLink, the secure URL shortener platform by KSM Cyber Security.",
    type: "website",
    siteName: "CyLink",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyLink Changelog - Latest Updates",
    description:
      "Stay updated with the latest CyLink platform improvements and new features.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Process markdown content with proper heading hierarchy
 */
function processMarkdownContent(content: string): string {
  return (
    content
      // Remove the main title (first h1) since we show it separately
      .replace(/^# .+$/m, "")
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
      // Convert bold text
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-white">$1</strong>'
      )
      // Convert italic text
      .replace(/\*(.+?)\*/g, '<em class="italic text-gray-200">$1</em>')
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

        // If it's already a tag (heading, list, etc.), return as is
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
 * Changelog Page Component
 * @description Main changelog page displaying all platform updates and improvements
 */
export default async function ChangelogPage() {
  // Fetch all changelog entries at build time
  const entries: ChangelogEntry[] = await getChangelogEntries();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <svg
                  className="w-8 h-8 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.5 2c-5.621 0-10.211 4.443-10.49 10h3.5c.275-3.275 2.997-6 6.99-6s6.715 2.725 6.99 6h3.5c-.279-5.557-4.869-10-10.49-10z" />
                  <path d="M13.5 22c5.621 0 10.211-4.443 10.49-10h-3.5c-.275 3.275-2.997 6-6.99 6s-6.715-2.725-6.99-6h-3.5c.279 5.557 4.869 10 10.49 10z" />
                </svg>
                <span className="text-xl font-bold">CyLink</span>
              </div>
              <div className="hidden md:flex space-x-8">
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </a>
                <a
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </a>
                <a href="/changelog" className="text-white font-medium">
                  Changelog
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold mb-4">Changelog</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Stay up to date with the latest features, improvements, and fixes to
            CyLink.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {entries.length > 0 ? (
          <div className="space-y-16">
            {entries.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Timeline line */}
                {index !== entries.length - 1 && (
                  <div className="absolute left-[76px] top-8 bottom-0 w-px bg-gray-800"></div>
                )}

                <div className="flex gap-8">
                  {/* Date and Version Column */}
                  <div className="flex-shrink-0 w-32">
                    <div className="text-gray-400 text-sm mb-1">
                      {new Date(entry.frontmatter.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-white text-black rounded-full text-sm font-medium">
                      {entry.frontmatter.version
                        .split(".")
                        .slice(0, 2)
                        .join(".")}
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-bold mb-6 leading-tight">
                      {entry.frontmatter.title}
                    </h2>

                    {/* Category badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {entry.frontmatter.category.map((cat) => (
                        <span
                          key={cat}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            cat === "Feature"
                              ? "bg-blue-900 text-blue-200"
                              : cat === "Bug Fix"
                              ? "bg-red-900 text-red-200"
                              : cat === "Improvement"
                              ? "bg-green-900 text-green-200"
                              : cat === "Security"
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Content with Rich Text Hierarchy */}
                    <div className="prose prose-invert prose-lg max-w-none">
                      <div
                        className="text-gray-300 leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{
                          __html: processMarkdownContent(entry.content),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No changelog entries found
            </h3>
            <p className="text-gray-400">
              Changelog entries will appear here once they are published.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
