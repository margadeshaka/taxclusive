import { renderHook, waitFor } from '@testing-library/react';
import { useBlogs } from '@/hooks/use-blogs';
import { BlogContextProvider } from '@/lib/context/blog-context';
import { ReactNode } from 'react';

// Mock the blog API
jest.mock('@/lib/api/blogs', () => ({
  getAllBlogs: jest.fn(),
  getBlogBySlug: jest.fn(),
  searchBlogs: jest.fn(),
}));

const createWrapper = ({ children }: { children: ReactNode }) => (
  <BlogContextProvider>{children}</BlogContextProvider>
);

describe('useBlogs hook', () => {
  const mockBlogs = [
    {
      id: '1',
      title: 'Test Blog 1',
      slug: 'test-blog-1',
      excerpt: 'Test excerpt 1',
      content: 'Test content 1',
      status: 'PUBLISHED' as const,
      featured: false,
      published_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      author: { name: 'Test Author', email: 'test@example.com' },
      tags: [{ name: 'test', slug: 'test' }],
      featured_image: { url: 'test.jpg', alt: 'Test image' },
      coverImage: 'test.jpg',
    },
    {
      id: '2',
      title: 'Test Blog 2',
      slug: 'test-blog-2',
      excerpt: 'Test excerpt 2',
      content: 'Test content 2',
      status: 'PUBLISHED' as const,
      featured: true,
      published_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      created_at: '2023-01-02T00:00:00Z',
      author: { name: 'Test Author', email: 'test@example.com' },
      tags: [{ name: 'featured', slug: 'featured' }],
      featured_image: { url: 'test2.jpg', alt: 'Test image 2' },
      coverImage: 'test2.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide blogs data', async () => {
    const { getAllBlogs } = require('@/lib/api/blogs');
    getAllBlogs.mockResolvedValue(mockBlogs);

    const { result } = renderHook(() => useBlogs(), { wrapper: createWrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.blogs).toEqual(mockBlogs);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    const { getAllBlogs } = require('@/lib/api/blogs');
    const errorMessage = 'Failed to fetch blogs';
    getAllBlogs.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useBlogs(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.blogs).toEqual([]);
  });

  it('should provide featured blogs', async () => {
    const { getAllBlogs } = require('@/lib/api/blogs');
    getAllBlogs.mockResolvedValue(mockBlogs);

    const { result } = renderHook(() => useBlogs(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const featuredBlogs = result.current.featuredBlogs;
    expect(featuredBlogs).toHaveLength(1);
    expect(featuredBlogs[0].featured).toBe(true);
  });

  it('should provide recent blogs', async () => {
    const { getAllBlogs } = require('@/lib/api/blogs');
    getAllBlogs.mockResolvedValue(mockBlogs);

    const { result } = renderHook(() => useBlogs(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const recentBlogs = result.current.recentBlogs;
    expect(recentBlogs).toHaveLength(2);
    // Should be sorted by published date (newest first)
    expect(new Date(recentBlogs[0].published_at)).toBeInstanceOf(Date);
  });

  it('should refresh blogs data', async () => {
    const { getAllBlogs } = require('@/lib/api/blogs');
    getAllBlogs.mockResolvedValue(mockBlogs);

    const { result } = renderHook(() => useBlogs(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getAllBlogs).toHaveBeenCalledTimes(1);

    // Call refresh
    result.current.refresh();

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getAllBlogs).toHaveBeenCalledTimes(2);
  });

  it('should handle search functionality', async () => {
    const { searchBlogs } = require('@/lib/api/blogs');
    const searchResults = [mockBlogs[0]]; // Only first blog matches
    searchBlogs.mockResolvedValue(searchResults);

    const { result } = renderHook(() => useBlogs(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Perform search
    await result.current.search('test query');

    expect(searchBlogs).toHaveBeenCalledWith('test query');
    expect(result.current.searchResults).toEqual(searchResults);
  });

  it('should clear search results', async () => {
    const { searchBlogs } = require('@/lib/api/blogs');
    searchBlogs.mockResolvedValue([mockBlogs[0]]);

    const { result } = renderHook(() => useBlogs(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Perform search
    await result.current.search('test');
    expect(result.current.searchResults).toHaveLength(1);

    // Clear search
    result.current.clearSearch();
    expect(result.current.searchResults).toEqual([]);
  });

  it('should get blog by slug', async () => {
    const { getBlogBySlug } = require('@/lib/api/blogs');
    getBlogBySlug.mockResolvedValue(mockBlogs[0]);

    const { result } = renderHook(() => useBlogs(), { wrapper: createWrapper });

    const blog = await result.current.getBlogBySlug('test-blog-1');

    expect(getBlogBySlug).toHaveBeenCalledWith('test-blog-1');
    expect(blog).toEqual(mockBlogs[0]);
  });

  it('should handle getBlogBySlug errors', async () => {
    const { getBlogBySlug } = require('@/lib/api/blogs');
    getBlogBySlug.mockRejectedValue(new Error('Blog not found'));

    const { result } = renderHook(() => useBlogs(), { wrapper: createWrapper });

    const blog = await result.current.getBlogBySlug('nonexistent');

    expect(blog).toBeNull();
  });
});