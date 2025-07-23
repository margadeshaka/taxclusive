/**
 * Cache utility for optimizing data fetching
 * Provides in-memory caching with TTL and request deduplication
 */

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// Cache configuration
interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries in the cache
}

// Default configuration
const defaultConfig: CacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
};

// Cache storage
const cache = new Map<string, CacheEntry<unknown>>();

// In-flight requests storage for deduplication
const inFlightRequests = new Map<string, Promise<unknown>>();

// Current configuration
let config: CacheConfig = { ...defaultConfig };

/**
 * Configure the cache
 * @param newConfig - New configuration options
 */
export function configureCache(newConfig: Partial<CacheConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Get an item from the cache
 * @param key - Cache key
 * @returns Cached data or undefined if not found or expired
 */
export function get<T>(key: string): T | undefined {
  const entry = cache.get(key);

  if (!entry) {
    return undefined;
  }

  // Check if the entry has expired
  if (entry.expiry < Date.now()) {
    cache.delete(key);
    return undefined;
  }

  return entry.data;
}

/**
 * Set an item in the cache
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds (optional, uses default if not provided)
 */
export function set<T>(key: string, data: T, ttl?: number): void {
  // Ensure we don't exceed the maximum cache size
  if (cache.size >= config.maxSize && !cache.has(key)) {
    // Remove the oldest entry
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }

  const expiry = Date.now() + (ttl || config.defaultTTL);
  cache.set(key, { data, expiry });
}

/**
 * Remove an item from the cache
 * @param key - Cache key
 */
export function remove(key: string): void {
  cache.delete(key);
}

/**
 * Clear the entire cache
 */
export function clear(): void {
  cache.clear();
}

/**
 * Clear all cache entries with a specific prefix
 * @param prefix - The prefix to match
 * @returns Number of entries cleared
 */
export function clearByPrefix(prefix: string): number {
  let count = 0;
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
      count++;
    }
  }
  return count;
}

/**
 * Get cache size
 * @returns Number of entries in the cache
 */
export function size(): number {
  return cache.size;
}

/**
 * Fetch with cache and request deduplication
 * @param key - Cache key
 * @param fetchFn - Function to fetch data if not in cache
 * @param ttl - Time to live in milliseconds (optional)
 * @returns Promise with the data
 */
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check if the data is in the cache
  const cachedData = get<T>(key);
  if (cachedData !== undefined) {
    return cachedData;
  }

  // Check if there's already an in-flight request for this key
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }

  // Create a new request and store it
  const request = fetchFn()
    .then((data) => {
      // Cache the result
      set(key, data, ttl);
      // Remove from in-flight requests
      inFlightRequests.delete(key);
      return data;
    })
    .catch((error) => {
      // Remove from in-flight requests on error
      inFlightRequests.delete(key);
      throw error;
    });

  // Store the request
  inFlightRequests.set(key, request);

  return request;
}

/**
 * Invalidate a cache entry and refetch
 * @param key - Cache key
 * @param fetchFn - Function to fetch fresh data
 * @param ttl - Time to live in milliseconds (optional)
 * @returns Promise with the fresh data
 */
export async function invalidateAndRefetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Remove from cache
  remove(key);

  // Fetch fresh data
  return fetchWithCache(key, fetchFn, ttl);
}

// Export the cache as a default object
const cacheUtils = {
  get,
  set,
  remove,
  clear,
  clearByPrefix,
  size,
  fetchWithCache,
  invalidateAndRefetch,
  configure: configureCache,
};

export default cacheUtils;
