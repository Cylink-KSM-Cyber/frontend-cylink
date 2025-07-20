/**
 * Short URL Redirect Page
 *
 * Handles client-side resolution and redirection for short URLs, enabling conversion goal tracking (e.g., PostHog) before redirecting the user to the original URL.
 * This page fetches the original URL from the backend, triggers a PostHog conversion event, and then performs a client-side redirect. If the short code is invalid or not found, an error message is displayed.
 *
 * @module src/app/[shortCode]/page
 */

"use client";

import { useEffect, useState } from "react";
import { useConversionTracking } from "@/hooks/useConversionTracking";
import { UrlClickProperties } from "@/interfaces/conversionTrackings/UrlClickProperties";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

interface ShortUrlPageProps {
  params: { shortCode: string };
}

const fetchOriginalUrl = async (
  shortCode: string
): Promise<{ original_url: string; url_id?: number } | null> => {
  try {
    const res = await fetch(`/api/v1/public/urls/${shortCode}`);
    if (!res.ok) return null;
    const data = await res.json();
    // Support both direct and nested response
    if (data?.original_url)
      return { original_url: data.original_url, url_id: data.id };
    if (data?.data?.original_url)
      return { original_url: data.data.original_url, url_id: data.data.id };
    return null;
  } catch {
    return null;
  }
};

export default function ShortUrlPage({ params }: ShortUrlPageProps) {
  const { shortCode } = params;
  const { trackUrlClick } = useConversionTracking();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const handleRedirect = async () => {
      setLoading(true);
      setError(null);
      const result = await fetchOriginalUrl(shortCode);
      if (!isMounted) return;
      if (result && result.original_url) {
        // Track conversion goal (PostHog)
        const props: UrlClickProperties = {
          url_id: result.url_id,
          short_code: shortCode,
          referrer: document.referrer || undefined,
          // user_agent, device_type, location, dsb akan diisi otomatis oleh getBaseEventProperties
        };
        trackUrlClick(props);
        // Redirect setelah tracking
        setTimeout(() => {
          window.location.replace(result.original_url);
        }, 300); // beri delay kecil agar event sempat terkirim
      } else {
        setError("Short URL not found or has expired.");
      }
      setLoading(false);
    };
    handleRedirect();
    return () => {
      isMounted = false;
    };
  }, [shortCode, trackUrlClick]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
        <span className="ml-4 text-lg">Redirecting...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Redirect Error
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  return null;
}
