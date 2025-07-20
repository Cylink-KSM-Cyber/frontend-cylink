/**
 * Short URL Redirect Page
 *
 * @module src/app/[shortCode]/page
 */

import ShortUrlRedirector from "./ShortUrlRedirector";

export default async function Page({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  return <ShortUrlRedirector shortCode={shortCode} />;
}
