import { NextRequest, NextResponse } from "next/server";

// Test data for development purposes
// This lets the app handle short URLs even when the backend API is not available
const TEST_URLS: Record<string, string> = {
  repocylink: "https://github.com/yourusername/cylink",
  testshort: "https://example.com/test-page",
  docs: "https://example.com/documentation",
  dashboard: "https://example.com/dashboard",
};

/**
 * API route to get URL info by identifier
 * This is a development fallback when the real API isn't available
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { identifier: string } }
) {
  const { identifier } = params;

  // Check if we have this URL in our test data
  if (identifier in TEST_URLS) {
    const originalUrl = TEST_URLS[identifier];

    // Return response matching the expected format
    return NextResponse.json({
      status: 200,
      message: "URL found",
      data: {
        id: 1,
        original_url: originalUrl,
        short_code: identifier,
        short_url: `https://cylink.id/${identifier}`,
        clicks: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }

  // Return 404 if not found
  return NextResponse.json(
    { status: 404, message: "URL not found" },
    { status: 404 }
  );
}

/**
 * API route to record a click on a URL
 * This is a development stub when the real API isn't available
 */
export async function POST() {
  // Always return success for development
  return NextResponse.json({
    status: 200,
    message: "Click recorded successfully",
  });
}
