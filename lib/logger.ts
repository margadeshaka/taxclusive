/**
 * Logger utility for consistent logging across the application
 * Provides different log levels and formatting options
 */

// Log levels
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

// Type for log context values
export type LogContextValue = string | number | boolean | null | undefined | LogContextObject | LogContextArray;
export interface LogContextObject {
  [key: string]: LogContextValue;
}
export type LogContextArray = LogContextValue[];

// Log entry interface
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, LogContextValue>;
  error?: Error;
}

// Logger configuration
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableMetrics: boolean;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableMetrics: process.env.NODE_ENV === "production",
};

// Current configuration
let config: LoggerConfig = { ...defaultConfig };

/**
 * Configure the logger
 * @param newConfig - New configuration options
 */
export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Format a log entry for output
 * @param entry - The log entry to format
 * @returns Formatted log string
 */
function formatLogEntry(entry: LogEntry): string {
  const { level, message, timestamp, context, error } = entry;

  let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (context && Object.keys(context).length > 0) {
    formattedMessage += ` ${JSON.stringify(context)}`;
  }

  if (error) {
    formattedMessage += `\n${error.stack || error.message}`;
  }

  return formattedMessage;
}

/**
 * Log an entry based on the current configuration
 * @param entry - The log entry to log
 */
function logEntry(entry: LogEntry): void {
  // Check if we should log this level
  const levels = Object.values(LogLevel);
  const configLevelIndex = levels.indexOf(config.minLevel);
  const entryLevelIndex = levels.indexOf(entry.level);

  if (entryLevelIndex < configLevelIndex) {
    return;
  }

  // Format the log entry
  const formattedLog = formatLogEntry(entry);

  // Log to console if enabled
  if (config.enableConsole) {
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedLog);
        break;
    }
  }

  // In a production environment, you would send logs to a service like Sentry, LogRocket, etc.
  if (config.enableMetrics && (entry.level === LogLevel.ERROR || entry.level === LogLevel.FATAL)) {
    // This is where you would integrate with error monitoring services
    // Example: Sentry.captureException(entry.error || new Error(entry.message), { extra: entry.context });
  }
}

/**
 * Create a log entry with the current timestamp
 * @param level - Log level
 * @param message - Log message
 * @param context - Additional context
 * @param error - Error object if applicable
 * @returns Log entry
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, LogContextValue>,
  error?: Error
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    error,
  };
}

/**
 * Log a debug message
 * @param message - Log message
 * @param context - Additional context
 */
export function debug(message: string, context?: Record<string, LogContextValue>): void {
  logEntry(createLogEntry(LogLevel.DEBUG, message, context));
}

/**
 * Log an info message
 * @param message - Log message
 * @param context - Additional context
 */
export function info(message: string, context?: Record<string, LogContextValue>): void {
  logEntry(createLogEntry(LogLevel.INFO, message, context));
}

/**
 * Log a warning message
 * @param message - Log message
 * @param context - Additional context
 * @param error - Error object if applicable
 */
export function warn(message: string, context?: Record<string, LogContextValue>, error?: Error): void {
  logEntry(createLogEntry(LogLevel.WARN, message, context, error));
}

/**
 * Log an error message
 * @param message - Log message
 * @param context - Additional context
 * @param error - Error object if applicable
 */
export function error(message: string, context?: Record<string, LogContextValue>, error?: Error): void {
  logEntry(createLogEntry(LogLevel.ERROR, message, context, error));
}

/**
 * Log a fatal error message
 * @param message - Log message
 * @param context - Additional context
 * @param error - Error object if applicable
 */
export function fatal(message: string, context?: Record<string, LogContextValue>, error?: Error): void {
  logEntry(createLogEntry(LogLevel.FATAL, message, context, error));
}

// Export the logger as a default object
const logger = {
  debug,
  info,
  warn,
  error,
  fatal,
  configure: configureLogger,
};

export default logger;
