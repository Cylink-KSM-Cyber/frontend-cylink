import {
  ConversionRateParams,
  ConversionRateResponse,
} from "@/interfaces/conversion";
import { get } from "./api";

/**
 * Get overall conversion rate data
 * @description Fetches conversion rate data for the user's URLs
 * @param params - Optional parameters for filtering and comparison
 * @returns Promise with the conversion rate data
 */
export const getConversionRate = async (
  params?: ConversionRateParams
): Promise<ConversionRateResponse> => {
  try {
    // Construct query parameters
    const queryParams = new URLSearchParams();

    if (params?.start_date) {
      queryParams.append("start_date", params.start_date);
    }

    if (params?.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    if (params?.goal_id !== undefined) {
      queryParams.append("goal_id", params.goal_id.toString());
    }

    if (params?.comparison !== undefined) {
      queryParams.append("comparison", params.comparison.toString());
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    // Make the API request
    const response = await get<ConversionRateResponse>(
      `/api/v1/conversion-rate${queryString}`
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch conversion rate data:", error);
    throw error;
  }
};
