import { NextRequest, NextResponse } from "next/server";
import { fetchUrlByShortCode, recordUrlClick } from "@/services/url";

/**
 * GET handler for short URL redirects
 * This will fetch the original URL based on the short code and redirect to it
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const shortCode = params.code;

  console.log(
    `API Route Handler - Processing redirect for short code: ${shortCode}`
  );
  console.log(`Request URL: ${request.url}`);
  console.log(`Request method: ${request.method}`);
  console.log(
    `Request headers:`,
    Object.fromEntries(request.headers.entries())
  );

  try {
    console.log(`Attempting to fetch URL data for short code: ${shortCode}`);

    // Use our service function to get the URL by short code
    const url = await fetchUrlByShortCode(shortCode);

    console.log(`URL data received:`, url);

    // Check different possible response structures
    let originalUrl: string | null = null;

    if (url && typeof url === "object") {
      if ("original_url" in url && typeof url.original_url === "string") {
        originalUrl = url.original_url;
      } else if ("data" in url && url.data && typeof url.data === "object") {
        const dataObj = url.data as Record<string, unknown>;
        if (
          "original_url" in dataObj &&
          typeof dataObj.original_url === "string"
        ) {
          originalUrl = dataObj.original_url;
        }
      }
    }

    // If we don't have an original URL, return an error
    if (!originalUrl) {
      console.error(`Original URL not found for short code: ${shortCode}`, url);
      return NextResponse.json(
        { error: "Original URL not found for this short link" },
        { status: 404 }
      );
    }

    console.log(`Successfully found original URL: ${originalUrl}`);
    console.log(`Redirecting to: ${originalUrl}`);

    // Record the click asynchronously (don't wait for it)
    recordUrlClick(shortCode).catch((err) => {
      console.error("Failed to record click:", err);
    });

    // Perform the redirect
    return NextResponse.redirect(originalUrl);
  } catch (error) {
    console.error(`Error handling redirect for ${shortCode}:`, error);

    // Detailed error logging
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    } else {
      console.error(`Unknown error type:`, error);
    }

    // If the error is a 404, return a more specific error
    if (
      error instanceof Error &&
      (error.message.includes("404") || error.message.includes("not found"))
    ) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    // Return a more detailed error for debugging
    return NextResponse.json(
      {
        error: "Failed to process redirect",
        details: error instanceof Error ? error.message : String(error),
        shortCode,
      },
      { status: 500 }
    );
  }
}
