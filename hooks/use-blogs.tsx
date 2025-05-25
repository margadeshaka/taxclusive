import useSWR from 'swr';
import { fetchBlogs, fetchBlogById } from '@/lib/strapi';

/**
 * Custom hook to fetch and cache all blogs using SWR
 * @returns Object containing blogs data, loading state, and error state
 */
export function useBlogs() {
  const { data, error, isLoading, mutate } = useSWR('blogs', fetchBlogs, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    blogs: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Custom hook to fetch and cache a single blog by ID using SWR
 * @param id - The ID of the blog to fetch
 * @returns Object containing blog data, loading state, and error state
 */
export function useBlog(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `blog-${id}` : null,
    () => fetchBlogById(id),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    blog: data,
    isLoading,
    isError: error,
    mutate,
  };
}