/**
 * Onboarding Driver Callbacks Utility
 *
 * Provides reusable callback creators for driver.js onboarding navigation logic.
 *
 * @module utils/onboardingDriverCallbacks
 */

/**
 * Creates a driver.js onNextClick handler for onboarding navigation.
 * @param transitionStepIndex - The step index at which to trigger navigation
 * @param nextUrl - The URL to navigate to when transition step is reached
 * @returns A callback function for driver.js onNextClick
 */
export function createOnNextClickHandler(
  transitionStepIndex: number,
  nextUrl: string
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (_el: unknown, _step: unknown, options: unknown) => {
    if (
      typeof options === "object" &&
      options !== null &&
      "state" in options &&
      typeof (options as Record<string, unknown>).state === "object"
    ) {
      const state = (options as Record<string, unknown>).state as {
        activeIndex?: number;
      };
      if (state.activeIndex === transitionStepIndex) {
        if (typeof window !== "undefined") {
          window.location.href = nextUrl;
        }
      } else if (
        "driver" in options &&
        typeof (options as Record<string, unknown>).driver === "object" &&
        typeof (
          (options as Record<string, unknown>).driver as {
            moveNext?: () => void;
          }
        ).moveNext === "function"
      ) {
        (
          (options as Record<string, unknown>).driver as {
            moveNext: () => void;
          }
        ).moveNext();
      }
    }
  };
}

/**
 * Creates a driver.js onDoneClick handler for onboarding navigation.
 * @param nextUrl - The URL to navigate to when onboarding is done
 * @returns A callback function for driver.js onDoneClick
 */
export function createOnDoneClickHandler(nextUrl: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (_el: unknown, _step: unknown, _options: unknown) => {
    if (typeof window !== "undefined") {
      window.location.href = nextUrl;
    }
  };
}
