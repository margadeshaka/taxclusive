import {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  PaginationParams,
} from "@/lib/strapi";
import {
  addRequestInterceptor,
  addResponseInterceptor,
  addErrorInterceptor,
  clearInterceptors,
} from "@/lib/api-client";

// Mock the global fetch function
global.fetch = jest.fn();

// Mock console.error to prevent test output pollution
console.error = jest.fn();

describe("Strapi API functions", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear all interceptors before each test
    clearInterceptors();
  });

  describe("fetchBlogs", () => {
    it("fetches blogs successfully", async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [
            { id: 1, attributes: { title: "Blog 1" } },
            { id: 2, attributes: { title: "Blog 2" } },
          ],
          meta: {
            pagination: {
              page: 1,
              pageSize: 10,
              pageCount: 1,
              total: 2,
            },
          },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      const result = await fetchBlogs();

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/articles?populate=*"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual({
        data: [
          { id: 1, attributes: { title: "Blog 1" } },
          { id: 2, attributes: { title: "Blog 2" } },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 1,
            total: 2,
          },
        },
      });
    });

    it("fetches blogs with pagination parameters", async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [{ id: 1, attributes: { title: "Blog 1" } }],
          meta: {
            pagination: {
              page: 2,
              pageSize: 1,
              pageCount: 2,
              total: 2,
            },
          },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Pagination parameters
      const params: PaginationParams = {
        page: 2,
        pageSize: 1,
        sort: "title:asc",
        filters: {
          title: {
            $contains: "Blog",
          },
        },
      };

      // Call the function
      const result = await fetchBlogs(params);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/articles?populate=*&pagination[page]=2&pagination[pageSize]=1&sort=title:asc&filters[title][$contains]=Blog"
        ),
        expect.any(Object)
      );
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual({
        data: [{ id: 1, attributes: { title: "Blog 1" } }],
        meta: {
          pagination: {
            page: 2,
            pageSize: 1,
            pageCount: 2,
            total: 2,
          },
        },
      });
    });

    it("handles fetch errors", async () => {
      // Mock failed response
      const errorMessage = "Network error";
      (global.fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Call the function and expect it to throw
      await expect(fetchBlogs()).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });

    it("handles API errors", async () => {
      // Mock API error response
      const mockResponse = {
        ok: false,
        status: 500,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function and expect it to throw
      await expect(fetchBlogs()).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it("applies request interceptors", async () => {
      // Add a request interceptor
      addRequestInterceptor((url, options) => {
        return {
          url: url + "&intercepted=true",
          options: {
            ...options,
            headers: {
              ...options.headers,
              "X-Intercepted": "true",
            },
          },
        };
      });

      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [],
          meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      await fetchBlogs();

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("&intercepted=true"),
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-Intercepted": "true",
          }),
        })
      );
    });
  });

  describe("fetchBlogById", () => {
    it("fetches a blog by ID successfully", async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: { id: 1, attributes: { title: "Blog 1" } },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      const result = await fetchBlogById("1");

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/articles/1?populate=*"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, attributes: { title: "Blog 1" } });
    });

    it("handles fetch errors", async () => {
      // Mock failed response
      const errorMessage = "Network error";
      (global.fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Call the function and expect it to throw
      await expect(fetchBlogById("1")).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });

    it("handles API errors", async () => {
      // Mock API error response
      const mockResponse = {
        ok: false,
        status: 404,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function and expect it to throw
      await expect(fetchBlogById("1")).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("createBlog", () => {
    it("creates a blog successfully", async () => {
      // Blog data to create
      const blogData = {
        title: "New Blog",
        description: "New blog description",
        body: "New blog content",
      };

      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            id: 3,
            attributes: {
              ...blogData,
              createdAt: "2023-01-01T00:00:00.000Z",
              updatedAt: "2023-01-01T00:00:00.000Z",
            },
          },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      const result = await createBlog(blogData);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/articles"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ data: blogData }),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual({
        id: 3,
        attributes: {
          ...blogData,
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
        },
      });
    });

    it("handles errors when creating a blog", async () => {
      // Blog data to create
      const blogData = {
        title: "New Blog",
        description: "New blog description",
        body: "New blog content",
      };

      // Mock error response
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          error: "Bad Request",
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function and expect it to throw
      await expect(createBlog(blogData)).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("updateBlog", () => {
    it("updates a blog successfully", async () => {
      // Blog data to update
      const blogId = "1";
      const blogData = {
        title: "Updated Blog",
        description: "Updated blog description",
      };

      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            id: 1,
            attributes: {
              ...blogData,
              body: "Original content",
              createdAt: "2023-01-01T00:00:00.000Z",
              updatedAt: "2023-01-02T00:00:00.000Z",
            },
          },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      const result = await updateBlog(blogId, blogData);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/articles/${blogId}`),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ data: blogData }),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        attributes: {
          ...blogData,
          body: "Original content",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-02T00:00:00.000Z",
        },
      });
    });

    it("handles errors when updating a blog", async () => {
      // Blog data to update
      const blogId = "1";
      const blogData = {
        title: "Updated Blog",
        description: "Updated blog description",
      };

      // Mock error response
      const mockResponse = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({
          error: "Not Found",
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function and expect it to throw
      await expect(updateBlog(blogId, blogData)).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("deleteBlog", () => {
    it("deletes a blog successfully", async () => {
      // Blog ID to delete
      const blogId = "1";

      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            id: 1,
            attributes: {
              title: "Deleted Blog",
              description: "Deleted blog description",
              body: "Deleted blog content",
              createdAt: "2023-01-01T00:00:00.000Z",
              updatedAt: "2023-01-01T00:00:00.000Z",
            },
          },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      const result = await deleteBlog(blogId);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/articles/${blogId}`),
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        attributes: {
          title: "Deleted Blog",
          description: "Deleted blog description",
          body: "Deleted blog content",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
        },
      });
    });

    it("handles errors when deleting a blog", async () => {
      // Blog ID to delete
      const blogId = "1";

      // Mock error response
      const mockResponse = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({
          error: "Not Found",
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function and expect it to throw
      await expect(deleteBlog(blogId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
