/**
 * Enhanced API client with caching, retry logic, timeout handling, and interceptors
 */
import { getCSRFToken } from "./csrf";
import { rateLimitedFetch } from "./rate-limit";

// Default timeout for API requests (in milliseconds)
const DEFAULT_TIMEOUT = 10000;

// Maximum number of retry attempts
const MAX_RETRY_ATTEMPTS = 3;

// Exponential backoff factor for retries
const RETRY_BACKOFF_FACTOR = 1.5;

// Apply rate limiting to the fetch function
// Allow 100 requests per minute
const rateLimitedFetchFn = rateLimitedFetch(fetch, {
  limit: 100,
  windowMs: 60 * 1000, // 1 minute
});

// Request interceptors array
const requestInterceptors: RequestInterceptor[] = [];

// Response interceptors array
const responseInterceptors: ResponseInterceptor[] = [];

// Error interceptors array
const errorInterceptors: ErrorInterceptor[] = [];

// Add CSRF token to all non-GET requests
addRequestInterceptor((url, options) => {
  // Only add CSRF token to non-GET requests
  if (options.method && options.method.toUpperCase() !== "GET") {
    // Create headers object if it doesn't exist
    const headers = options.headers || {};

    // Add CSRF token to headers
    if (typeof window !== "undefined") {
      headers["X-CSRF-Token"] = getCSRFToken();
    }

    // Return updated URL and options
    return {
      url,
      options: {
        ...options,
        headers,
      },
    };
  }

  // Return unchanged URL and options for GET requests
  return { url, options };
});

/**
 * Add a request interceptor
 * @param interceptor - The request interceptor function
 */
export function addRequestInterceptor(interceptor: RequestInterceptor): void {
  requestInterceptors.push(interceptor);
}

/**
 * Add a response interceptor
 * @param interceptor - The response interceptor function
 */
export function addResponseInterceptor(interceptor: ResponseInterceptor): void {
  responseInterceptors.push(interceptor);
}

/**
 * Add an error interceptor
 * @param interceptor - The error interceptor function
 */
export function addErrorInterceptor(interceptor: ErrorInterceptor): void {
  errorInterceptors.push(interceptor);
}

/**
 * Clear all interceptors
 */
export function clearInterceptors(): void {
  requestInterceptors.length = 0;
  responseInterceptors.length = 0;
  errorInterceptors.length = 0;
}

/**
 * Type for request interceptor function
 */
export type RequestInterceptor = (
  url: string,
  options: RequestOptions
) => { url: string; options: RequestOptions };

/**
 * Type for response interceptor function
 */
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

/**
 * Type for API errors
 */
export type ApiError = Error | Response | { status?: number; message?: string };

/**
 * Type for error interceptor function
 */
export type ErrorInterceptor = (error: ApiError, url: string, options: RequestOptions) => ApiError | Promise<ApiError>;

/**
 * Options for API requests
 */
export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: "default" | "no-store" | "reload" | "force-cache" | "only-if-cached";
  skipInterceptors?: boolean;
}

/**
 * Enhanced fetch function with timeout, retry logic, caching, and interceptors
 * @param url - The URL to fetch
 * @param options - Request options
 * @returns Promise with the response
 */
export async function fetchWithRetry(url: string, options: RequestOptions = {}): Promise<Response> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRY_ATTEMPTS,
    retryDelay = 1000,
    cache = "default",
    skipInterceptors = false,
    ...fetchOptions
  } = options;

  // Create an AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Apply request interceptors if not skipped
    let interceptedUrl = url;
    let interceptedOptions = {
      ...options,
      timeout,
      retries,
      retryDelay,
      cache,
      ...fetchOptions,
    };

    if (!skipInterceptors && requestInterceptors.length > 0) {
      for (const interceptor of requestInterceptors) {
        const result = interceptor(interceptedUrl, interceptedOptions);
        interceptedUrl = result.url;
        interceptedOptions = result.options;
      }
    }

    // Add the signal to the fetch options
    const fetchWithTimeout = {
      ...interceptedOptions,
      signal: controller.signal,
      cache,
      skipInterceptors: true, // Skip interceptors for retry requests to avoid infinite loops
    };

    try {
      let response = await rateLimitedFetchFn(interceptedUrl, fetchWithTimeout);

      // Apply response interceptors if not skipped
      if (!skipInterceptors && responseInterceptors.length > 0 && response.ok) {
        for (const interceptor of responseInterceptors) {
          response = await interceptor(response.clone());
        }
      }

      // If the response is successful, return it
      if (response.ok) {
        return response;
      }

      // If we have retries left and the error is retryable, retry the request
      if (retries > 0 && isRetryableError(response.status)) {
        // Calculate backoff delay with jitter
        const delay =
          retryDelay *
          Math.pow(RETRY_BACKOFF_FACTOR, MAX_RETRY_ATTEMPTS - retries) *
          (0.8 + Math.random() * 0.4);

        // Wait for the delay
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Retry the request with one less retry
        return fetchWithRetry(url, {
          ...options,
          retries: retries - 1,
          retryDelay,
        });
      }

      // Apply error interceptors if not skipped
      let interceptedError: ApiError = response;
      if (!skipInterceptors && errorInterceptors.length > 0) {
        for (const interceptor of errorInterceptors) {
          interceptedError = await interceptor(interceptedError, url, options);
        }
      }

      // If we're out of retries or the error is not retryable, create an error with the status code
      const errorMessage = `API error: ${response.status}`;
      const apiError = new Error(errorMessage);
      // Add the response to the error object for additional context
      Object.assign(apiError, { response: interceptedError });

      // Throw the error
      throw apiError;
    } catch (error) {
      // If the error is an AbortError, it's a timeout
      if (error instanceof DOMException && error.name === "AbortError") {
        const timeoutError = new Error(`Request timeout after ${timeout}ms`);

        // Apply error interceptors if not skipped
        let interceptedError: ApiError = timeoutError;
        if (!skipInterceptors && errorInterceptors.length > 0) {
          for (const interceptor of errorInterceptors) {
            interceptedError = await interceptor(interceptedError, url, options);
          }
        }

        throw interceptedError;
      }

      // If we have retries left and the error is retryable, retry the request
      if (retries > 0 && isRetryableError(error)) {
        // Calculate backoff delay with jitter
        const delay =
          retryDelay *
          Math.pow(RETRY_BACKOFF_FACTOR, MAX_RETRY_ATTEMPTS - retries) *
          (0.8 + Math.random() * 0.4);

        // Wait for the delay
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Retry the request with one less retry
        return fetchWithRetry(url, {
          ...options,
          retries: retries - 1,
          retryDelay,
        });
      }

      // Apply error interceptors if not skipped
      let interceptedError: ApiError = error instanceof Error ? error : new Error(String(error));
      if (!skipInterceptors && errorInterceptors.length > 0) {
        for (const interceptor of errorInterceptors) {
          interceptedError = await interceptor(interceptedError, url, options);
        }
      }

      // If we're out of retries or the error is not retryable, rethrow the error
      throw interceptedError;
    }
  } finally {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
  }
}

/**
 * Check if an error is retryable
 * @param error - The error to check
 * @returns Whether the error is retryable
 */
function isRetryableError(error: unknown): boolean {
  // Network errors are retryable
  if (error instanceof TypeError) {
    return true;
  }

  // Certain HTTP status codes are retryable
  if (typeof error === "number") {
    // 408: Request Timeout
    // 429: Too Many Requests
    // 500: Internal Server Error
    // 502: Bad Gateway
    // 503: Service Unavailable
    // 504: Gateway Timeout
    return [408, 429, 500, 502, 503, 504].includes(error);
  }

  // Response objects with retryable status codes
  if (typeof Response !== "undefined" && error instanceof Response) {
    return isRetryableError(error.status);
  }

  // Handle error objects with status property
  if (error && typeof error === "object" && "status" in error) {
    return isRetryableError(error.status);
  }

  return false;
}
