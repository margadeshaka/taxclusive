import useSWR, { type SWRConfiguration } from "swr";

export interface BlogTag {
  name: string;
  slug?: string;
}

export interface BlogBlock {
  __component: string;
  body?: string | null;
}

export interface BlogImage {
  url: string;
  alt?: string | null;
}

export interface BlogSummary {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string | null;
  description?: string | null;
  content?: string | null;
  status?: string;
  featured?: boolean;
  publishedAt?: string | null;
  tags?: BlogTag[];
  blocks?: BlogBlock[];
  cover?: BlogImage | null;
  coverImage?: string | null;
}

function normalizeBlog(raw: any): BlogSummary {
  return {
    id: raw.id,
    title: raw.title || "Untitled Blog Post",
    slug: raw.slug || "",
    excerpt: raw.excerpt ?? null,
    description: raw.description ?? raw.excerpt ?? null,
    content: raw.content ?? null,
    status: raw.status,
    featured: raw.featured ?? false,
    publishedAt: raw.publishedAt ?? raw.published_at ?? null,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    blocks: Array.isArray(raw.blocks) ? raw.blocks : [],
    cover: raw.cover ?? raw.featured_image ?? null,
    coverImage: raw.coverImage ?? raw.featured_image?.url ?? raw.cover?.url ?? null,
  };
}

async function fetchAllBlogsFromApi(): Promise<BlogSummary[]> {
  const res = await fetch("/api/public/blogs");
  if (!res.ok) throw new Error("Failed to fetch blogs");
  const json = await res.json();

  const blogs = Array.isArray(json.data) ? json.data : [];
  return blogs.map(normalizeBlog);
}

async function fetchBlogByIdFromApi(id: string): Promise<BlogSummary | null> {
  const res = await fetch(`/api/public/blogs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch blog");
  const json = await res.json();
  return json.data ? normalizeBlog(json.data) : null;
}

const defaultSWRConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000,
  focusThrottleInterval: 10000,
  loadingTimeout: 5000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  suspense: false,
  keepPreviousData: true,
};

/**
 * Custom hook to fetch and cache blogs using SWR
 * @returns Object containing blogs data, loading state, error state, and mutate function
 */
export function useBlogs() {
  const { data, error, isLoading, mutate } = useSWR<BlogSummary[]>(
    "all-blogs",
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
  const { data, error, isLoading, mutate } = useSWR<BlogSummary | null>(
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
