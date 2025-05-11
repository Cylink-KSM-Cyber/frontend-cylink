/**
 * Utility for consistent logging across the application
 * This logger provides structured logging and respects environment settings
 */

/**
 * Logger utility for the application
 * @description Provides structured logging with different log levels
 */

/**
 * Log level enum - controls verbosity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Current log level - can be set based on environment
 */
let currentLogLevel: LogLevel =
  process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO;

/**
 * Get the current log level
 * @returns The current log level
 */
export const getLogLevel = (): LogLevel => currentLogLevel;

/**
 * Set the log level
 * @param level The log level to set
 */
export const setLogLevel = (level: LogLevel): void => {
  currentLogLevel = level;
};

/**
 * Format log data for output
 * @param data The data to format
 * @returns Formatted data string
 */
const formatData = (data?: unknown): string => {
  if (!data) return "";
  try {
    return typeof data === "object"
      ? JSON.stringify(data, null, 2)
      : String(data);
  } catch (error) {
    return `[Unformattable data: ${String(error)}]`;
  }
};

/**
 * Generic logger function that formats and outputs log messages
 * @param level The log level
 * @param module The module name
 * @param message The log message
 * @param data Additional data to log
 */
const log = (
  level: LogLevel,
  module: string,
  message: string,
  data?: unknown
): void => {
  // Skip logging if the current log level is higher than this message's level
  if (level < currentLogLevel) return;

  // Create timestamp in ISO format
  const timestamp = new Date().toISOString();

  // Format log prefix with timestamp and level
  const prefix = `[${timestamp}] [${LogLevel[level]}] [${module}]`;

  // Format the message
  const formattedMsg = `${prefix} ${message}`;

  // Format the data if present
  const formattedData = data ? formatData(data) : "";

  // Choose console method based on level
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(formattedMsg, formattedData);
      break;
    case LogLevel.INFO:
      console.info(formattedMsg, formattedData);
      break;
    case LogLevel.WARN:
      console.warn(formattedMsg, formattedData);
      break;
    case LogLevel.ERROR:
      console.error(formattedMsg, formattedData);
      break;
  }
};

/**
 * Debug level logger
 * @param message The log message
 * @param data Additional data to log
 */
const debug = (message: string, data?: unknown): void => {
  log(LogLevel.DEBUG, "App", message, data);
};

/**
 * Info level logger
 * @param message The log message
 * @param data Additional data to log
 */
const info = (message: string, data?: unknown): void => {
  log(LogLevel.INFO, "App", message, data);
};

/**
 * Warning level logger
 * @param message The log message
 * @param data Additional data to log
 */
const warn = (message: string, data?: unknown): void => {
  log(LogLevel.WARN, "App", message, data);
};

/**
 * Error level logger
 * @param message The log message
 * @param data Additional data to log
 */
const error = (message: string, data?: unknown): void => {
  log(LogLevel.ERROR, "App", message, data);
};

/**
 * URL Shortener specific logger
 * @description Specialized logger for URL shortening operations
 */
const urlShortener = {
  debug: (message: string, data?: unknown): void => {
    log(LogLevel.DEBUG, "URLShortener", message, data);
  },
  info: (message: string, data?: unknown): void => {
    log(LogLevel.INFO, "URLShortener", message, data);
  },
  warn: (message: string, data?: unknown): void => {
    log(LogLevel.WARN, "URLShortener", message, data);
  },
  error: (message: string, data?: unknown): void => {
    log(LogLevel.ERROR, "URLShortener", message, data);
  },
};

/**
 * Logger interface
 */
const logger = {
  debug,
  info,
  warn,
  error,
  urlShortener,
  setLogLevel,
  getLogLevel,
};

export default logger;
