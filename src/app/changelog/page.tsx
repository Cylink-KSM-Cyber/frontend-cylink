import { Metadata } from "next";
import { getChangelogEntries } from "@/utils/changelog";
import ChangelogList from "@/components/organisms/ChangelogList";
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
 * Changelog Page Component
 * @description Main changelog page displaying all platform updates and improvements
 */
export default async function ChangelogPage() {
  // Fetch all changelog entries at build time
  const entries: ChangelogEntry[] = await getChangelogEntries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CyLink Changelog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Stay informed about the latest updates, new features, and
              improvements to the CyLink platform. We are constantly working to
              enhance your URL shortening and analytics experience.
            </p>
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {entries.length} updates published
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {entries.length > 0 ? (
          <ChangelogList entries={entries} />
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No changelog entries found
            </h3>
            <p className="text-gray-600">
              Changelog entries will appear here once they are published.
            </p>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>
              Have questions about an update? Contact our{" "}
              <a
                href="mailto:support@cylink.id"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                support team
              </a>{" "}
              for assistance.
            </p>
            <p className="mt-2">
              Follow us for real-time updates and announcements about CyLink.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
