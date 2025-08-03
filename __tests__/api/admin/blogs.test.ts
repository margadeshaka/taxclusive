import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/admin/blogs/route';
import { getServerSession } from 'next-auth';

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
const mockPrisma = {
  blog: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe('/api/admin/blogs', () => {
  const mockAdminSession = {
    user: {
      id: '1',
      email: 'admin@taxclusive.com',
      role: 'ADMIN',
    },
  };

  const mockEditorSession = {
    user: {
      id: '2',
      email: 'editor@taxclusive.com',
      role: 'EDITOR',
    },
  };

  const mockBlog = {
    id: '1',
    title: 'Test Blog',
    slug: 'test-blog',
    excerpt: 'Test excerpt',
    content: 'Test content',
    status: 'PUBLISHED',
    featured: false,
    coverImage: 'test.jpg',
    authorId: '1',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      name: 'Test Author',
      email: 'author@test.com',
    },
    tags: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/blogs', () => {
    it('should return blogs for authenticated admin', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
      mockPrisma.blog.findMany.mockResolvedValue([mockBlog]);

      const request = new NextRequest('http://localhost:3000/api/admin/blogs');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.blogs).toHaveLength(1);
      expect(data.blogs[0]).toEqual(expect.objectContaining({
        id: mockBlog.id,
        title: mockBlog.title,
        slug: mockBlog.slug,
      }));
    });

    it('should return blogs for authenticated editor', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockEditorSession);
      mockPrisma.blog.findMany.mockResolvedValue([mockBlog]);

      const request = new NextRequest('http://localhost:3000/api/admin/blogs');
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should reject unauthenticated requests', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/blogs');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should handle search queries', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
      mockPrisma.blog.findMany.mockResolvedValue([mockBlog]);

      const request = new NextRequest('http://localhost:3000/api/admin/blogs?search=test');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.blog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ title: expect.objectContaining({ contains: 'test' }) }),
            ]),
          }),
        })
      );
    });

    it('should handle status filters', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
      mockPrisma.blog.findMany.mockResolvedValue([mockBlog]);

      const request = new NextRequest('http://localhost:3000/api/admin/blogs?status=PUBLISHED');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.blog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'PUBLISHED',
          }),
        })
      );
    });

    it('should handle pagination', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
      mockPrisma.blog.findMany.mockResolvedValue([mockBlog]);

      const request = new NextRequest('http://localhost:3000/api/admin/blogs?page=2&limit=10');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.blog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );
    });
  });

  describe('POST /api/admin/blogs', () => {
    const validBlogData = {
      title: 'New Test Blog',
      excerpt: 'New test excerpt',
      content: 'New test content',
      status: 'DRAFT',
      featured: false,
      coverImage: 'new-test.jpg',
    };

    it('should create blog for authenticated admin', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
      mockPrisma.blog.create.mockResolvedValue({
        ...mockBlog,
        ...validBlogData,
        id: '2',
      });

      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBlogData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.blog).toEqual(expect.objectContaining({
        title: validBlogData.title,
        excerpt: validBlogData.excerpt,
      }));
      expect(mockPrisma.blog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ...validBlogData,
            authorId: mockAdminSession.user.id,
            slug: expect.stringMatching(/^new-test-blog/),
          }),
        })
      );
    });

    it('should create blog for authenticated editor', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockEditorSession);
      mockPrisma.blog.create.mockResolvedValue({
        ...mockBlog,
        ...validBlogData,
        id: '2',
      });

      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBlogData),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it('should reject unauthenticated requests', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBlogData),
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);

      const invalidData = {
        // Missing required title
        excerpt: 'Test excerpt',
        content: 'Test content',
      };

      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should generate unique slug', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
      mockPrisma.blog.create.mockResolvedValue({
        ...mockBlog,
        ...validBlogData,
        id: '2',
      });

      const blogWithSameTitle = {
        ...validBlogData,
        title: 'Duplicate Title',
      };

      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogWithSameTitle),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockPrisma.blog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: expect.stringMatching(/^duplicate-title/),
          }),
        })
      );
    });

    it('should sanitize content', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
      mockPrisma.blog.create.mockResolvedValue({
        ...mockBlog,
        ...validBlogData,
        id: '2',
      });

      const maliciousData = {
        ...validBlogData,
        title: '<script>alert("xss")</script>Malicious Title',
        content: '<img src="x" onerror="alert(1)">Safe content',
      };

      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousData),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockPrisma.blog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: expect.not.stringMatching(/<script>/),
            content: expect.not.stringMatching(/onerror/),
          }),
        })
      );
    });

    it('should handle database errors', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
      mockPrisma.blog.create.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBlogData),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it('should set publishedAt when status is PUBLISHED', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
      mockPrisma.blog.create.mockResolvedValue({
        ...mockBlog,
        ...validBlogData,
        id: '2',
      });

      const publishedBlogData = {
        ...validBlogData,
        status: 'PUBLISHED',
      };

      const request = new NextRequest('http://localhost:3000/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publishedBlogData),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockPrisma.blog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            publishedAt: expect.any(Date),
          }),
        })
      );
    });
  });
});