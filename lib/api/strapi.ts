// Strapi API utility functions

/**
 * Base URL for the Strapi CMS API
 * This should be configured based on your Strapi deployment
 */
const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://beneficial-bell-dbe99c11c9.strapiapp.com";

/**
 * Default headers for Strapi API requests
 */
const defaultHeaders = {
  "Content-Type": "application/json",
  // 'Authorization': `Bearer ${STRAPI_API_KEY}`
};

/**
 * Fetch all blogs from Strapi CMS
 * @returns Promise with blog data
 */
export async function fetchBlogs() {
  try {
    const response = await fetch(`${STRAPI_API_URL}/api/articles?populate=*`, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`Error fetching blogs: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
}

/**
 * Fetch a single blog by ID from Strapi CMS
 * @param id - The ID of the blog to fetch
 * @returns Promise with blog data
 */
export async function fetchBlogById(id: string) {
  try {
    const response = await fetch(`${STRAPI_API_URL}/api/articles/${id}?populate=*`, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`Error fetching blog: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch a single blog by slug from Strapi CMS
 * @param slug - The slug of the blog to fetch
 * @returns Promise with blog data
 */
export async function fetchBlogBySlug(slug: string) {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
      {
        method: "GET",
        headers: defaultHeaders,
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching blog: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.[0] || null; // Return first match or null
  } catch (error) {
    console.error(`Error fetching blog with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all blogs for static generation
 * @returns Promise with blog data
 */
export async function fetchAllBlogs() {
  try {
    const response = await fetch(`${STRAPI_API_URL}/api/articles?populate=*`, {
      method: "GET",
      headers: defaultHeaders,
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Error fetching blogs: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return [];
  }
}
