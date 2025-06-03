"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { fetchBlogs, fetchBlogById } from "@/lib/api";
import { Blog, BlogListResponse } from "@/lib/types";

// Define the shape of the context state
interface BlogContextState {
  blogs: Blog[];
  loading: boolean;
  error: Error | null;
  fetchAllBlogs: () => Promise<void>;
  fetchBlog: (id: string) => Promise<Blog | null>;
}

// Create the context with a default value
const BlogContext = createContext<BlogContextState>({
  blogs: [],
  loading: false,
  error: null,
  fetchAllBlogs: async () => {},
  fetchBlog: async () => null,
});

// Custom hook to use the blog context
export const useBlogContext = () => useContext(BlogContext);

interface BlogProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app and makes blog data available
export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch all blogs
  const fetchAllBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred while fetching blogs"));
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a single blog by ID
  const fetchBlog = async (id: string): Promise<Blog | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogById(id);
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(`An error occurred while fetching blog with ID ${id}`)
      );
      console.error(`Error fetching blog with ID ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Provide the blog context to the component tree
  return (
    <BlogContext.Provider
      value={{
        blogs,
        loading,
        error,
        fetchAllBlogs,
        fetchBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
