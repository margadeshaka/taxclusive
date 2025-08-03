/**
 * Mock Service Worker (MSW) handlers for API mocking in tests
 */

import { rest } from 'msw';

// Mock data
export const mockBlogs = [
  {
    id: '1',
    title: 'GST Compliance Guide for Small Businesses',
    slug: 'gst-compliance-guide-small-businesses',
    excerpt: 'A comprehensive guide to GST compliance for small businesses in India.',
    content: '# GST Compliance Guide\n\nThis is a detailed guide...',
    status: 'PUBLISHED',
    featured: true,
    coverImage: 'https://example.com/gst-guide.jpg',
    published_at: '2023-12-01T10:00:00Z',
    updated_at: '2023-12-01T10:00:00Z',
    created_at: '2023-11-30T10:00:00Z',
    author: {
      name: 'CA Priya Sharma',
      email: 'priya@taxclusive.com',
    },
    tags: [
      { name: 'GST', slug: 'gst' },
      { name: 'Small Business', slug: 'small-business' },
    ],
    featured_image: {
      url: 'https://example.com/gst-guide.jpg',
      alt: 'GST Compliance Guide cover image',
    },
  },
  {
    id: '2',
    title: 'Income Tax Filing Tips for FY 2023-24',
    slug: 'income-tax-filing-tips-fy-2023-24',
    excerpt: 'Essential tips for filing income tax returns for the financial year 2023-24.',
    content: '# Income Tax Filing Tips\n\nHere are the key tips...',
    status: 'PUBLISHED',
    featured: false,
    coverImage: 'https://example.com/income-tax-tips.jpg',
    published_at: '2023-11-28T10:00:00Z',
    updated_at: '2023-11-28T10:00:00Z',
    created_at: '2023-11-27T10:00:00Z',
    author: {
      name: 'CA Rajesh Kumar',
      email: 'rajesh@taxclusive.com',
    },
    tags: [
      { name: 'Income Tax', slug: 'income-tax' },
      { name: 'Tax Filing', slug: 'tax-filing' },
    ],
    featured_image: {
      url: 'https://example.com/income-tax-tips.jpg',
      alt: 'Income Tax Filing Tips cover image',
    },
  },
];

export const mockTestimonials = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    designation: 'CEO',
    company: 'Tech Solutions Pvt Ltd',
    location: 'Delhi',
    content: 'Taxclusive has been instrumental in managing our company\'s tax compliance and financial planning. Their expertise in GST and corporate taxation saved us significant costs and time.',
    rating: 5,
    status: 'APPROVED',
    featured: true,
    created_at: '2023-12-01T10:00:00Z',
    updated_at: '2023-12-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    designation: 'Founder',
    company: 'Startup India',
    location: 'Mumbai',
    content: 'As a startup, we needed expert guidance on tax structure and compliance. Taxclusive provided exceptional service and helped us set up our financial foundation correctly.',
    rating: 5,
    status: 'APPROVED',
    featured: false,
    created_at: '2023-11-30T10:00:00Z',
    updated_at: '2023-11-30T10:00:00Z',
  },
];

export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@taxclusive.com',
    role: 'ADMIN',
    created_at: '2023-01-01T10:00:00Z',
    updated_at: '2023-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Editor User',
    email: 'editor@taxclusive.com',
    role: 'EDITOR',
    created_at: '2023-01-02T10:00:00Z',
    updated_at: '2023-01-02T10:00:00Z',
  },
];

// API Handlers
export const handlers = [
  // Public Blog API
  rest.get('/api/public/blogs', (req, res, ctx) => {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const featured = url.searchParams.get('featured');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');

    let filteredBlogs = [...mockBlogs];

    if (search) {
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (featured === 'true') {
      filteredBlogs = filteredBlogs.filter(blog => blog.featured);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    return res(
      ctx.status(200),
      ctx.json({
        blogs: paginatedBlogs,
        pagination: {
          page,
          limit,
          total: filteredBlogs.length,
          totalPages: Math.ceil(filteredBlogs.length / limit),
        },
      })
    );
  }),

  rest.get('/api/public/blogs/:slug', (req, res, ctx) => {
    const { slug } = req.params;
    const blog = mockBlogs.find(b => b.slug === slug);

    if (!blog) {
      return res(ctx.status(404), ctx.json({ error: 'Blog not found' }));
    }

    return res(ctx.status(200), ctx.json({ blog }));
  }),

  // Public Testimonials API
  rest.get('/api/public/testimonials', (req, res, ctx) => {
    const url = new URL(req.url);
    const featured = url.searchParams.get('featured');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let filteredTestimonials = mockTestimonials.filter(t => t.status === 'APPROVED');

    if (featured === 'true') {
      filteredTestimonials = filteredTestimonials.filter(t => t.featured);
    }

    const paginatedTestimonials = filteredTestimonials.slice(0, limit);

    return res(
      ctx.status(200),
      ctx.json({
        testimonials: paginatedTestimonials,
        total: filteredTestimonials.length,
      })
    );
  }),

  // Contact Form API
  rest.post('/api/contact', async (req, res, ctx) => {
    const body = await req.json();
    
    // Simulate validation
    if (!body.firstName || !body.lastName || !body.email || !body.message) {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'Missing required fields',
          details: 'firstName, lastName, email, and message are required',
        })
      );
    }

    // Simulate email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'Invalid email format',
        })
      );
    }

    // Simulate successful submission
    return res(
      ctx.delay(1000), // Simulate network delay
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Message sent successfully',
      })
    );
  }),

  // Newsletter API
  rest.post('/api/newsletter', async (req, res, ctx) => {
    const body = await req.json();

    if (!body.email) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Email is required' })
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Invalid email format' })
      );
    }

    // Simulate already subscribed
    if (body.email === 'existing@example.com') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Email already subscribed' })
      );
    }

    return res(
      ctx.delay(500),
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Subscribed successfully',
      })
    );
  }),

  // Appointment API
  rest.post('/api/appointment', async (req, res, ctx) => {
    const body = await req.json();

    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'service', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'Missing required fields',
          details: missingFields,
        })
      );
    }

    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Appointment booked successfully',
        appointmentId: 'APT-' + Date.now(),
      })
    );
  }),

  // Query API
  rest.post('/api/query', async (req, res, ctx) => {
    const body = await req.json();

    if (!body.fullName || !body.email || !body.query) {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'Missing required fields',
          details: 'fullName, email, and query are required',
        })
      );
    }

    return res(
      ctx.delay(800),
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Query submitted successfully',
        queryId: 'QRY-' + Date.now(),
      })
    );
  }),

  // Admin Blogs API
  rest.get('/api/admin/blogs', (req, res, ctx) => {
    // Simulate authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let filteredBlogs = [...mockBlogs];

    if (search) {
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredBlogs = filteredBlogs.filter(blog => blog.status === status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    return res(
      ctx.status(200),
      ctx.json({
        blogs: paginatedBlogs,
        pagination: {
          page,
          limit,
          total: filteredBlogs.length,
          totalPages: Math.ceil(filteredBlogs.length / limit),
        },
      })
    );
  }),

  rest.post('/api/admin/blogs', async (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const body = await req.json();

    if (!body.title || !body.content) {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'Missing required fields',
          details: 'title and content are required',
        })
      );
    }

    const newBlog = {
      id: String(mockBlogs.length + 1),
      ...body,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        name: 'Test Author',
        email: 'test@taxclusive.com',
      },
      tags: [],
      featured_image: body.coverImage ? {
        url: body.coverImage,
        alt: body.title + ' cover image',
      } : null,
    };

    mockBlogs.push(newBlog);

    return res(
      ctx.delay(1000),
      ctx.status(201),
      ctx.json({
        success: true,
        message: 'Blog created successfully',
        blog: newBlog,
      })
    );
  }),

  // Admin Testimonials API
  rest.get('/api/admin/testimonials', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        testimonials: mockTestimonials,
        total: mockTestimonials.length,
      })
    );
  }),

  rest.post('/api/admin/testimonials', async (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    const body = await req.json();

    const newTestimonial = {
      id: String(mockTestimonials.length + 1),
      ...body,
      status: 'PENDING',
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockTestimonials.push(newTestimonial);

    return res(
      ctx.delay(500),
      ctx.status(201),
      ctx.json({
        success: true,
        message: 'Testimonial created successfully',
        testimonial: newTestimonial,
      })
    );
  }),

  // Admin Users API
  rest.get('/api/admin/users', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        users: mockUsers,
        total: mockUsers.length,
      })
    );
  }),

  // Health Check API
  rest.get('/api/health', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
      })
    );
  }),

  // Error simulation endpoints
  rest.get('/api/test/500', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
  }),

  rest.get('/api/test/timeout', (req, res, ctx) => {
    return res(ctx.delay(30000), ctx.status(200), ctx.json({ message: 'This will timeout' }));
  }),

  rest.get('/api/test/network-error', (req, res, ctx) => {
    return res.networkError('Network error');
  }),

  // Catch-all handler for unhandled requests
  rest.all('*', (req, res, ctx) => {
    console.warn(`Unhandled ${req.method} request to ${req.url}`);
    return res(
      ctx.status(404),
      ctx.json({ error: 'Endpoint not found' })
    );
  }),
];