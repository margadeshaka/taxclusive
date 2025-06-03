/**
 * CSRF Protection Utilities
 *
 * This module provides utilities for generating and validating CSRF tokens
 * to protect against Cross-Site Request Forgery attacks.
 */

/**
 * Generate a random CSRF token
 * @returns A random string to be used as a CSRF token
 */
export function generateCSRFToken(): string {
  // Generate a random string of 32 characters
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Get the current CSRF token from storage or generate a new one
 * @returns The current CSRF token
 */
export function getCSRFToken(): string {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return "";
  }

  // Try to get the token from localStorage
  let token = localStorage.getItem("csrf_token");

  // If no token exists, generate a new one and store it
  if (!token) {
    token = generateCSRFToken();
    localStorage.setItem("csrf_token", token);
  }

  return token;
}

/**
 * Validate a CSRF token against the stored token
 * @param token - The token to validate
 * @returns Whether the token is valid
 */
export function validateCSRFToken(token: string): boolean {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return false;
  }

  // Get the stored token
  const storedToken = localStorage.getItem("csrf_token");

  // If no stored token exists, the validation fails
  if (!storedToken) {
    return false;
  }

  // Compare the tokens using a timing-safe comparison
  // to prevent timing attacks
  return timingSafeEqual(token, storedToken);
}

/**
 * Timing-safe comparison of two strings
 * This prevents timing attacks by taking the same amount of time
 * regardless of how many characters match
 *
 * @param a - First string
 * @param b - Second string
 * @returns Whether the strings are equal
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
