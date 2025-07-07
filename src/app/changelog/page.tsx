import { Metadata } from "next";
import { getChangelogEntries } from "@/utils/changelog";
import { ChangelogEntry } from "@/interfaces/changelog";
import ChangelogList from "@/components/organisms/ChangelogList";

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
        <ChangelogList entries={entries} />
      </main>
    </div>
  );
}
