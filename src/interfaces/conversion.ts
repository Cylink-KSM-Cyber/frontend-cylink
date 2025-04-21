/**
 * Conversion Rate API Request Parameters
 * @description Parameters for requesting conversion rate data
 */
export interface ConversionRateParams {
  start_date?: string;
  end_date?: string;
  goal_id?: number;
  comparison?: 7 | 14 | 30 | 90;
}

/**
 * Conversion Rate API Response
 * @description Response structure from the conversion rate API
 */
export interface ConversionRateResponse {
  status: number;
  message: string;
  data: {
    period: {
      start_date: string;
      end_date: string;
    };
    overall_stats: {
      total_clicks: number;
      total_conversions: number;
      conversion_rate: number;
      total_conversion_value: number;
      average_value_per_conversion: number;
    };
    goals: ConversionGoal[];
    comparison: {
      previous_period: {
        start_date: string;
        end_date: string;
      };
      overall: {
        previous_conversion_rate: number;
        change_percentage: number;
        previous_conversions: number;
        change: number;
      };
      goals: ConversionGoalComparison[];
    };
  };
}

/**
 * Conversion Goal
 * @description Individual conversion goal data
 */
export interface ConversionGoal {
  goal_id: number;
  name: string;
  conversions: number;
  conversion_rate: number;
  conversion_value: number;
}

/**
 * Conversion Goal Comparison
 * @description Comparison data for conversion goals
 */
export interface ConversionGoalComparison {
  goal_id: number;
  previous_conversion_rate: number;
  change_percentage: number | null;
  previous_conversions: number;
  change: number;
}

/**
 * Extended Dashboard Stats with Conversion Data
 * @description Dashboard stats extended with conversion rate data
 */
export interface ConversionDashboardStats {
  conversionRate: number;
  conversionChangePercentage: number;
  totalConversions: number;
  topClicksCount: number;
}
