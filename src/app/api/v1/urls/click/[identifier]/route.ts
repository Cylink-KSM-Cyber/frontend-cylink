import { NextResponse } from "next/server";

/**
 * API route to record a click on a URL
 * This is a development stub when the real API isn't available
 */
export async function GET() {
  // Always return success for development
  return NextResponse.json({
    status: 200,
    message: "Click recorded successfully",
  });
}
