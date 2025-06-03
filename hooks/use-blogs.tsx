import useSWR from "swr";
import { useState, useCallback } from "react";
import {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  PaginationParams,
  PaginatedResponse,
} from "@/lib/strapi";

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
 * Custom hook to fetch and cache blogs with pagination using SWR with enhanced caching
 * @param initialParams - Initial pagination parameters
 * @returns Object containing blogs data, pagination state, loading state, error state, and functions to control pagination
 */
export function useBlogs(initialParams: PaginationParams = {}) {
  // Default pagination parameters
  const defaultParams: PaginationParams = {
    page: 1,
    pageSize: 10,
    sort: "publishedAt:desc",
    ...initialParams,
  };

  // State to track current pagination parameters
  const [params, setParams] = useState<PaginationParams>(defaultParams);

  // Create a unique cache key based on pagination parameters
  const cacheKey = `blogs-${JSON.stringify(params)}`;

  // Fetch data with SWR
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<any>>(
    cacheKey,
    () => fetchBlogs(params),
    defaultSWRConfig
  );

  // Function to change the page
  const goToPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  // Function to change the page size
  const setPageSize = useCallback((pageSize: number) => {
    setParams((prev) => ({ ...prev, pageSize, page: 1 })); // Reset to first page when changing page size
  }, []);

  // Function to change the sort order
  const setSort = useCallback((sort: string | string[]) => {
    setParams((prev) => ({ ...prev, sort, page: 1 })); // Reset to first page when changing sort
  }, []);

  // Function to set filters
  const setFilters = useCallback((filters: Record<string, any>) => {
    setParams((prev) => ({ ...prev, filters, page: 1 })); // Reset to first page when changing filters
  }, []);

  // Function to reset pagination to defaults
  const resetPagination = useCallback(() => {
    setParams(defaultParams);
  }, [defaultParams]);

  // Function to create a new blog with optimistic update
  const createBlogWithOptimisticUpdate = useCallback(
    async (blogData: any) => {
      try {
        // Create optimistic data for the new blog
        const optimisticBlog = {
          id: `temp-${Date.now()}`,
          attributes: {
            ...blogData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };

        // Get current data
        const currentData = data || {
          data: [],
          meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 0 } },
        };

        // Create optimistic update data
        const optimisticData = {
          data: [optimisticBlog, ...currentData.data],
          meta: {
            ...currentData.meta,
            pagination: {
              ...currentData.meta.pagination,
              total: currentData.meta.pagination.total + 1,
            },
          },
        };

        // Perform optimistic update
        mutate(optimisticData, false);

        // Perform actual API call
        const createdBlog = await createBlog(blogData);

        // Revalidate data to get the actual server state
        mutate();

        return createdBlog;
      } catch (error) {
        // If there's an error, revalidate to get the correct state
        mutate();
        throw error;
      }
    },
    [data, mutate]
  );

  // Function to update a blog with optimistic update
  const updateBlogWithOptimisticUpdate = useCallback(
    async (id: string, blogData: any) => {
      try {
        // Get current data
        const currentData = data || {
          data: [],
          meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 0 } },
        };

        // Create optimistic update data
        const optimisticData = {
          data: currentData.data.map((blog) =>
            blog.id === id
              ? {
                  ...blog,
                  attributes: {
                    ...blog.attributes,
                    ...blogData,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : blog
          ),
          meta: currentData.meta,
        };

        // Perform optimistic update
        mutate(optimisticData, false);

        // Perform actual API call
        const updatedBlog = await updateBlog(id, blogData);

        // Revalidate data to get the actual server state
        mutate();

        return updatedBlog;
      } catch (error) {
        // If there's an error, revalidate to get the correct state
        mutate();
        throw error;
      }
    },
    [data, mutate]
  );

  // Function to delete a blog with optimistic update
  const deleteBlogWithOptimisticUpdate = useCallback(
    async (id: string) => {
      try {
        // Get current data
        const currentData = data || {
          data: [],
          meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 0 } },
        };

        // Create optimistic update data
        const optimisticData = {
          data: currentData.data.filter((blog) => blog.id !== id),
          meta: {
            ...currentData.meta,
            pagination: {
              ...currentData.meta.pagination,
              total: Math.max(0, currentData.meta.pagination.total - 1),
            },
          },
        };

        // Perform optimistic update
        mutate(optimisticData, false);

        // Perform actual API call
        const deletedBlog = await deleteBlog(id);

        // Revalidate data to get the actual server state
        mutate();

        return deletedBlog;
      } catch (error) {
        // If there's an error, revalidate to get the correct state
        mutate();
        throw error;
      }
    },
    [data, mutate]
  );

  return {
    blogs: data?.data || [],
    pagination: data?.meta?.pagination,
    isLoading,
    isError: error,
    mutate,
    // Pagination controls
    params,
    goToPage,
    setPageSize,
    setSort,
    setFilters,
    resetPagination,
    // CRUD operations with optimistic updates
    createBlog: createBlogWithOptimisticUpdate,
    updateBlog: updateBlogWithOptimisticUpdate,
    deleteBlog: deleteBlogWithOptimisticUpdate,
  };
}

/**
 * Custom hook to fetch and cache a single blog by ID using SWR with enhanced caching
 * @param id - The ID of the blog to fetch
 * @returns Object containing blog data, loading state, error state, and functions for optimistic updates
 */
export function useBlog(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `blog-${id}` : null,
    () => fetchBlogById(id),
    defaultSWRConfig
  );

  // Function to update a blog with optimistic update
  const updateBlogWithOptimisticUpdate = useCallback(
    async (blogData: any) => {
      if (!id) return null;

      try {
        // Create optimistic data for the updated blog
        const optimisticBlog = {
          ...data,
          attributes: {
            ...data?.attributes,
            ...blogData,
            updatedAt: new Date().toISOString(),
          },
        };

        // Perform optimistic update
        mutate(optimisticBlog, false);

        // Perform actual API call
        const updatedBlog = await updateBlog(id, blogData);

        // Revalidate data to get the actual server state
        mutate();

        return updatedBlog;
      } catch (error) {
        // If there's an error, revalidate to get the correct state
        mutate();
        throw error;
      }
    },
    [id, data, mutate]
  );

  // Function to delete a blog with optimistic update
  const deleteBlogWithOptimisticUpdate = useCallback(async () => {
    if (!id) return null;

    try {
      // Perform optimistic update - set to null to indicate deletion
      mutate(null, false);

      // Perform actual API call
      const deletedBlog = await deleteBlog(id);

      // Keep it as null after successful deletion
      mutate(null);

      return deletedBlog;
    } catch (error) {
      // If there's an error, revalidate to get the correct state
      mutate();
      throw error;
    }
  }, [id, mutate]);

  return {
    blog: data,
    isLoading,
    isError: error,
    mutate,
    // CRUD operations with optimistic updates
    updateBlog: updateBlogWithOptimisticUpdate,
    deleteBlog: deleteBlogWithOptimisticUpdate,
  };
}
