import useSWR from "swr";

async function fetchAllBlogsFromApi() {
  const res = await fetch("/api/public/blogs");
  if (!res.ok) throw new Error("Failed to fetch blogs");
  const json = await res.json();
  return json.data ?? [];
}

async function fetchBlogByIdFromApi(id: string) {
  const res = await fetch(`/api/public/blogs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch blog");
  const json = await res.json();
  return json.data ?? null;
}

// Default SWR configuration for better caching and performance
const defaultSWRConfig = {
  revalidateOnFocus: false, // Don't revalidate when window gets focus
  revalidateIfStale: false, // Don't revalidate if data is stale
  revalidateOnReconnect: true, // Revalidate when browser regains connection
  dedupingInterval: 60000, // Dedupe requests within 1 minute
  focusThrottleInterval: 10000, // Throttle focus events to 10 seconds
  loadingTimeout: 5000, // Show loading state after 5 seconds
  errorRetryCount: 3, // Retry failed requests 3 times
  errorRetryInterval: 5000, // Wait 5 seconds between retries
  suspense: false, // Don't use React Suspense
  keepPreviousData: true, // Keep previous data while revalidating
  // Use localStorage for persistent caching between sessions
  provider: () => {
    // Use localStorage for persistent caching if available
    const map = new Map();
    const storage = typeof window !== "undefined" ? localStorage : null;

    // Initialize cache from localStorage
    if (storage) {
      try {
        const cache = JSON.parse(storage.getItem("swr-cache") || "{}");
        Object.keys(cache).forEach((key) => {
          const item = cache[key];
          // Only use cached items that are less than 24 hours old
          if (item && Date.now() - item.timestamp < 86400000) {
            map.set(key, item.data);
          }
        });
      } catch (e) {
        console.error("Error loading SWR cache from localStorage:", e);
      }
    }

    // Return provider methods
    return {
      get: (key: string) => map.get(key),
      set: (key: string, value: any) => {
        map.set(key, value);
        if (storage) {
          try {
            // Get current cache
            const cache = JSON.parse(storage.getItem("swr-cache") || "{}");
            // Update cache with new value and timestamp
            cache[key] = { data: value, timestamp: Date.now() };
            // Save back to localStorage
            storage.setItem("swr-cache", JSON.stringify(cache));
          } catch (e) {
            console.error("Error saving SWR cache to localStorage:", e);
          }
        }
      },
      delete: (key: string) => {
        map.delete(key);
        if (storage) {
          try {
            const cache = JSON.parse(storage.getItem("swr-cache") || "{}");
            delete cache[key];
            storage.setItem("swr-cache", JSON.stringify(cache));
          } catch (e) {
            console.error("Error deleting from SWR cache in localStorage:", e);
          }
        }
      },
    };
  },
};

/**
 * Custom hook to fetch and cache blogs using SWR
 * @returns Object containing blogs data, loading state, error state, and mutate function
 */
export function useBlogs() {
  const { data, error, isLoading, mutate } = useSWR(
    'all-blogs',
    fetchAllBlogsFromApi,
    defaultSWRConfig
  );

  return {
    blogs: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Custom hook to fetch and cache a single blog by ID using SWR
 * @param id - The ID of the blog to fetch
 * @returns Object containing blog data, loading state, error state, and mutate function
 */
export function useBlog(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `blog-${id}` : null,
    () => fetchBlogByIdFromApi(id),
    defaultSWRConfig
  );

  return {
    blog: data,
    isLoading,
    isError: error,
    mutate,
  };
}
