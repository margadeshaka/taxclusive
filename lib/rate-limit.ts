/**
 * Rate Limiting Utilities
 *
 * This module provides utilities for implementing rate limiting
 * to protect against brute force attacks and API abuse.
 */

// Store for rate limit data
// In a production environment, this should be replaced with a Redis store
// or another persistent store that can be shared across instances
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

/**
 * Options for rate limiting
 */
export interface RateLimitOptions {
  // Maximum number of requests allowed in the window
  limit: number;

  // Time window in milliseconds
  windowMs: number;

  // Identifier for the rate limit (e.g., IP address, user ID)
  identifier: string;
}

/**
 * Result of a rate limit check
 */
export interface RateLimitResult {
  // Whether the request is allowed
  allowed: boolean;

  // Number of requests remaining in the current window
  remaining: number;

  // Time in milliseconds until the rate limit resets
  resetIn: number;
}

/**
 * Check if a request is allowed based on rate limiting rules
 * @param options - Rate limiting options
 * @returns Result of the rate limit check
 */
export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const { limit, windowMs, identifier } = options;
  const now = Date.now();

  // Get or initialize rate limit data for this identifier
  let data = rateLimitStore[identifier];
  if (!data || now > data.resetTime) {
    // If no data exists or the window has expired, create new data
    data = {
      count: 0,
      resetTime: now + windowMs,
    };
    rateLimitStore[identifier] = data;
  }

  // Increment the request count
  data.count += 1;

  // Calculate remaining requests and reset time
  const remaining = Math.max(0, limit - data.count);
  const resetIn = Math.max(0, data.resetTime - now);

  // Determine if the request is allowed
  const allowed = data.count <= limit;

  return {
    allowed,
    remaining,
    resetIn,
  };
}

/**
 * Middleware function for rate limiting in API routes
 * @param options - Rate limiting options
 * @returns A function that can be used as middleware in API routes
 */
export function rateLimitMiddleware(options: Omit<RateLimitOptions, "identifier">) {
  return (req: Request): Response | null => {
    // Get the client IP address or a default identifier
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    // Check the rate limit
    const result = checkRateLimit({
      ...options,
      identifier: ip,
    });

    // If the request is not allowed, return a 429 Too Many Requests response
    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests, please try again later.",
          resetIn: result.resetIn,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": options.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(result.resetIn / 1000).toString(),
            "Retry-After": Math.ceil(result.resetIn / 1000).toString(),
          },
        }
      );
    }

    // If the request is allowed, return null to continue processing
    return null;
  };
}

/**
 * Apply rate limiting to a fetch function
 * @param fetchFn - The fetch function to wrap
 * @param options - Rate limiting options
 * @returns A rate-limited fetch function
 */
export function rateLimitedFetch(
  fetchFn: typeof fetch,
  options: Omit<RateLimitOptions, "identifier">
): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    // Generate a unique identifier for the request
    // In a real application, this should be based on the client IP
    const identifier =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    // Check the rate limit
    const result = checkRateLimit({
      ...options,
      identifier,
    });

    // If the request is not allowed, throw an error
    if (!result.allowed) {
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(result.resetIn / 1000)} seconds.`
      );
    }

    // If the request is allowed, proceed with the fetch
    return fetchFn(input, init);
  };
}
