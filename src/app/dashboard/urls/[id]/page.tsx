import { Suspense } from "react";
import { UrlAnalyticsDashboard } from "@/components/templates/UrlAnalyticsDashboard";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

/**
 * URL Analytics Dashboard Page
 * @description Displays comprehensive analytics for a specific shortened URL
 */
interface UrlAnalyticsPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function UrlAnalyticsPage({
  params,
}: UrlAnalyticsPageProps) {
  const { id } = await params;
  const urlId = parseInt(id, 10);

  if (isNaN(urlId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Invalid URL ID
          </h1>
          <p className="text-gray-600">The provided URL ID is not valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="large" />
          </div>
        }
      >
        <UrlAnalyticsDashboard urlId={urlId} />
      </Suspense>
    </div>
  );
}
