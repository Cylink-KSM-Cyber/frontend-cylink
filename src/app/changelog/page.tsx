import type { Metadata } from "next";
import { getChangelogEntries } from "@/utils/changelog";
import { ChangelogEntry } from "@/interfaces/changelog";
import ChangelogList from "@/components/organisms/ChangelogList";
import Navbar from "@/components/molecules/Navbar";

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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <header className="border-b border-gray-200 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Changelog</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
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
