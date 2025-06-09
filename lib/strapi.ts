// Strapi API utility functions
import {
  fetchWithRetry,
  addRequestInterceptor,
  addResponseInterceptor,
  addErrorInterceptor,
  RequestOptions,
} from "./api-client";
import cacheUtils from "./cache";
import logger from "./logger";

/**
 * Base URL for the Strapi CMS API
 * This should be configured based on your Strapi deployment
 */
const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://beneficial-bell-dbe99c11c9.strapiapp.com";
const STRAPI_API_KEY = process.env.NEXT_PUBLIC_STRAPI_API_KEY || "";

/**
 * Default headers for Strapi API requests
 */
const defaultHeaders = {
  "Content-Type": "application/json",
};

/**
 * Default options for Strapi API requests
 */
const defaultOptions = {
  method: "GET",
  headers: defaultHeaders,
  timeout: 120000, // 2 minutes timeout
  retries: 3, // 3 retry attempts
  cache: "default" as const,
};

/**
 * Authentication interceptor for Strapi API requests
 * Adds the API key to the request headers if available
 */
addRequestInterceptor((url, options) => {
  // Only add the Authorization header if the URL is for the Strapi API
  if (url.startsWith(STRAPI_API_URL) && STRAPI_API_KEY) {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${STRAPI_API_KEY}`,
    };

    return {
      url,
      options: {
        ...options,
        headers,
      },
    };
  }

  return { url, options };
});

/**
 * Error logging interceptor for Strapi API requests
 * Logs detailed error information for debugging
 */
addErrorInterceptor((error, url, options) => {
  // Extract relevant information for logging
  const method = options.method || "GET";
  const status = error.status || "Network Error";
  const errorMessage = error.message || "Unknown error";

  // Log detailed error information using structured logger
  logger.error(
    `[Strapi API Error] ${method} ${url} - ${status}: ${errorMessage}`,
    {
      url,
      method,
      status,
      timestamp: new Date().toISOString(),
    },
    error instanceof Error ? error : new Error(errorMessage)
  );

  // Rethrow the error for further handling
  return error;
});

/**
 * Response validation interceptor for Strapi API requests
 * Validates the structure of the API response
 */
addResponseInterceptor(async (response) => {
  // Clone the response to avoid consuming it
  const clonedResponse = response.clone();

  try {
    // Parse the response JSON
    const data = await clonedResponse.json();

    // Validate the response structure
    if (response.url.includes("/api/articles")) {
      // Validate articles response
      if (response.url.includes("?")) {
        // List of articles
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error("Invalid response format: expected data.data to be an array");
        }

        // Validate each article
        data.data.forEach((article: any, index: number) => {
          if (!article.id) {
            throw new Error(`Invalid article at index ${index}: missing id`);
          }
          if (!article.attributes) {
            throw new Error(`Invalid article at index ${index}: missing attributes`);
          }
        });
      } else {
        // Single article
        if (!data.data || !data.data.id || !data.data.attributes) {
          throw new Error("Invalid response format: expected data.data with id and attributes");
        }
      }
    }

    // Return the original response if validation passes
    return response;
  } catch (error) {
    logger.error("Response validation error", { url: response.url }, error);

    // Create a new response with the validation error
    return new Response(
      JSON.stringify({
        error: true,
        message: error instanceof Error ? error.message : "Unknown validation error",
        originalData: await response.clone().json(),
      }),
      {
        status: 422,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});

/**
 * Pagination parameters for fetching data
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string | string[];
  filters?: Record<string, any>;
}

/**
 * Pagination metadata returned from the API
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

/**
 * Paginated response from the API
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: PaginationMeta;
  };
}

/**
 * Build query string from pagination parameters
 * @param params - Pagination parameters
 * @returns Query string
 */
function buildQueryString(params: PaginationParams): string {
  const queryParams: string[] = ["populate=*"];

  if (params.page !== undefined) {
    queryParams.push(`pagination[page]=${params.page}`);
  }

  if (params.pageSize !== undefined) {
    queryParams.push(`pagination[pageSize]=${params.pageSize}`);
  }

  if (params.sort) {
    const sortParams = Array.isArray(params.sort) ? params.sort : [params.sort];
    sortParams.forEach((sort) => {
      queryParams.push(`sort=${sort}`);
    });
  }

  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (typeof value === "object") {
        Object.entries(value).forEach(([operator, operatorValue]) => {
          queryParams.push(`filters[${key}][${operator}]=${operatorValue}`);
        });
      } else {
        queryParams.push(`filters[${key}]=${value}`);
      }
    });
  }

  return queryParams.join("&");
}

/**
 * Fetch blogs from Strapi CMS with enhanced caching, retry logic, and pagination
 * @param params - Pagination parameters
 * @returns Promise with paginated blog data
 */
export async function fetchBlogs(params: PaginationParams = {}): Promise<PaginatedResponse<any>> {
  const queryString = buildQueryString(params);
  const cacheKey = `blogs:${queryString}`;

  // Use cache with deduplication for better performance
  return cacheUtils.fetchWithCache(
    cacheKey,
    async () => {
      try {
        // Use force-cache for GET requests that don't change frequently
        const response = await fetchWithRetry(`${STRAPI_API_URL}/api/articles?${queryString}`, {
          ...defaultOptions,
          cache: "force-cache", // Use cache-first strategy for better performance
        });

        const data = await response.json();
        return {
          data: data.data,
          meta: data.meta,
        };
      } catch (error) {
        logger.error("Error fetching blogs", { params }, error);
        throw error;
      }
    },
    // Cache for 5 minutes (can be adjusted based on data volatility)
    5 * 60 * 1000
  );
}

/**
 * Fetch a single blog by ID from Strapi CMS with enhanced caching and retry logic
 * @param id - The ID of the blog to fetch
 * @returns Promise with blog data
 */
export async function fetchBlogById(id: string) {
  const cacheKey = `blog:${id}`;

  // Use cache with deduplication for better performance
  return cacheUtils.fetchWithCache(
    cacheKey,
    async () => {
      try {
        // Use force-cache for GET requests that don't change frequently
        const response = await fetchWithRetry(`${STRAPI_API_URL}/api/articles/${id}?populate=*`, {
          ...defaultOptions,
          cache: "force-cache", // Use cache-first strategy for better performance
        });

        const data = await response.json();
        return data.data;
      } catch (error) {
        logger.error(`Error fetching blog with ID ${id}`, { id }, error);
        throw error;
      }
    },
    // Cache for 10 minutes (can be adjusted based on data volatility)
    10 * 60 * 1000
  );
}

/**
 * Create a new blog in Strapi CMS
 * @param blogData - The blog data to create
 * @returns Promise with the created blog data
 */
export async function createBlog(blogData: any) {
  try {
    const response = await fetchWithRetry(`${STRAPI_API_URL}/api/articles`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify({ data: blogData }),
      cache: "no-store", // Don't cache POST requests
    });

    const data = await response.json();

    // Invalidate the blogs list cache to ensure fresh data on next fetch
    cacheUtils.clearByPrefix("blogs:");

    return data.data;
  } catch (error) {
    logger.error("Error creating blog", { blogData }, error);
    throw error;
  }
}

/**
 * Update a blog in Strapi CMS
 * @param id - The ID of the blog to update
 * @param blogData - The updated blog data
 * @returns Promise with the updated blog data
 */
export async function updateBlog(id: string, blogData: any) {
  try {
    const response = await fetchWithRetry(`${STRAPI_API_URL}/api/articles/${id}`, {
      ...defaultOptions,
      method: "PUT",
      body: JSON.stringify({ data: blogData }),
      cache: "no-store", // Don't cache PUT requests
    });

    const data = await response.json();

    // Invalidate both the specific blog cache and the blogs list cache
    cacheUtils.remove(`blog:${id}`);
    cacheUtils.clearByPrefix("blogs:");

    return data.data;
  } catch (error) {
    logger.error(`Error updating blog with ID ${id}`, { id, blogData }, error);
    throw error;
  }
}

/**
 * Delete a blog from Strapi CMS
 * @param id - The ID of the blog to delete
 * @returns Promise with the deleted blog data
 */
export async function deleteBlog(id: string) {
  try {
    const response = await fetchWithRetry(`${STRAPI_API_URL}/api/articles/${id}`, {
      ...defaultOptions,
      method: "DELETE",
      cache: "no-store", // Don't cache DELETE requests
    });

    const data = await response.json();

    // Invalidate both the specific blog cache and the blogs list cache
    cacheUtils.remove(`blog:${id}`);
    cacheUtils.clearByPrefix("blogs:");

    return data.data;
  } catch (error) {
    logger.error(`Error deleting blog with ID ${id}`, { id }, error);
    throw error;
  }
}
