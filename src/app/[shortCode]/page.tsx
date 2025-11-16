/**
 * Short URL Redirect Page
 * 
 * Renders the interstitial page with countdown timer and cyber security facts
 * before redirecting to the original URL.
 *
 * @module src/app/[shortCode]/page
 */

import InterstitialPage from "./InterstitialPage";

export default async function Page({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  return <InterstitialPage shortCode={shortCode} />;
}
