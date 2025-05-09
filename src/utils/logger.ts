/**
 * Utility for consistent logging across the application
 * This logger provides structured logging and respects environment settings
 */

// Determine if we're in production
const isProduction = process.env.NODE_ENV === "production";

// Log levels
type LogLevel = "debug" | "info" | "warn" | "error";

// Base logger function
const log = (
  level: LogLevel,
  message: string,
  data?: Record<string, unknown>
) => {
  // Skip debug logs in production
  if (isProduction && level === "debug") {
    return;
  }

  const timestamp = new Date().toISOString();
  const metadata = data ? { timestamp, ...data } : { timestamp };

  switch (level) {
    case "debug":
      // Only log in development
      if (!isProduction) {
        console.debug(
          `[${timestamp}] [DEBUG] ${message}`,
          data ? metadata : ""
        );
      }
      break;
    case "info":
      console.info(`[${timestamp}] [INFO] ${message}`, data ? metadata : "");
      break;
    case "warn":
      console.warn(`[${timestamp}] [WARN] ${message}`, data ? metadata : "");
      break;
    case "error":
      console.error(`[${timestamp}] [ERROR] ${message}`, data ? metadata : "");
      break;
  }
};

/**
 * Logger utility for consistent logging
 */
const logger = {
  /**
   * Debug level logging - not shown in production
   */
  debug: (message: string, data?: Record<string, unknown>) =>
    log("debug", message, data),

  /**
   * Info level logging
   */
  info: (message: string, data?: Record<string, unknown>) =>
    log("info", message, data),

  /**
   * Warning level logging
   */
  warn: (message: string, data?: Record<string, unknown>) =>
    log("warn", message, data),

  /**
   * Error level logging
   */
  error: (message: string, data?: Record<string, unknown>) =>
    log("error", message, data),

  /**
   * User action logging (always logged, even in production)
   */
  userAction: (action: string, data?: Record<string, unknown>) => {
    log("info", `User Action: ${action}`, { type: "user_action", ...data });
  },

  /**
   * Application event logging (always logged, even in production)
   */
  appEvent: (event: string, data?: Record<string, unknown>) => {
    log("info", `App Event: ${event}`, { type: "app_event", ...data });
  },

  /**
   * Performance metrics logging
   */
  performance: (
    operation: string,
    durationMs: number,
    data?: Record<string, unknown>
  ) => {
    log("info", `Performance: ${operation} completed in ${durationMs}ms`, {
      type: "performance",
      durationMs,
      ...data,
    });
  },
};

export default logger;
