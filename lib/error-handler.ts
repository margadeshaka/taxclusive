import { toast } from "@/hooks/use-toast";

import { logger } from "./logger";

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NetworkError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Access denied") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends Error {
  constructor(message: string = "Rate limit exceeded") {
    super(message);
    this.name = "RateLimitError";
  }
}

// Error type guards
export const isValidationError = (error: Error): error is ValidationError =>
  error.name === "ValidationError";

export const isNetworkError = (error: Error): error is NetworkError =>
  error.name === "NetworkError";

export const isAuthenticationError = (error: Error): error is AuthenticationError =>
  error.name === "AuthenticationError";

export const isAuthorizationError = (error: Error): error is AuthorizationError =>
  error.name === "AuthorizationError";

export const isNotFoundError = (error: Error): error is NotFoundError =>
  error.name === "NotFoundError";

export const isRateLimitError = (error: Error): error is RateLimitError =>
  error.name === "RateLimitError";

// Global error handler
export function handleError(error: Error, context?: Record<string, any>) {
  // Use the logger instead of console.error
  logger.error("Error occurred", context, error);

  // Show user-friendly error messages
  if (isValidationError(error)) {
    toast({
      title: "Validation Error",
      description: error.message,
      variant: "destructive",
    });
  } else if (isNetworkError(error)) {
    toast({
      title: "Network Error",
      description: "Please check your internet connection and try again.",
      variant: "destructive",
    });
  } else if (isAuthenticationError(error)) {
    toast({
      title: "Authentication Required",
      description: "Please log in to continue.",
      variant: "destructive",
    });
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  } else if (isAuthorizationError(error)) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to perform this action.",
      variant: "destructive",
    });
  } else if (isNotFoundError(error)) {
    toast({
      title: "Not Found",
      description: error.message,
      variant: "destructive",
    });
  } else if (isRateLimitError(error)) {
    toast({
      title: "Rate Limit Exceeded",
      description: "Please wait a moment before trying again.",
      variant: "destructive",
    });
  } else {
    // Generic error
    toast({
      title: "Something went wrong",
      description: process.env.NODE_ENV === "development" 
        ? error.message 
        : "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
  }
}

// Safe async function wrapper
export function safeAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R | null> {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  };
}

// Safe sync function wrapper
export function safe<T extends any[], R>(
  fn: (...args: T) => R
): (...args: T) => R | null {
  return (...args: T): R | null => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  };
}

// Promise wrapper with error handling
export async function withErrorHandling<T>(
  promise: Promise<T>,
  context?: Record<string, any>
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    handleError(error instanceof Error ? error : new Error(String(error)), context);
    return null;
  }
}

// Retry function with exponential backoff
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 2, onRetry } = options;
  
  let attempt = 1;
  
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      
      const err = error instanceof Error ? error : new Error(String(error));
      onRetry?.(err, attempt);
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(backoff, attempt - 1)));
      attempt++;
    }
  }
  
  throw new Error("Retry function failed unexpectedly");
}

// Enhanced error context for debugging
export function getErrorContext(error: Error): Record<string, any> {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "server",
  };
}