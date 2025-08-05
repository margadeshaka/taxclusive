/**
 * Test data factories for generating consistent test data
 */

import { faker } from '@faker-js/faker';

// Types
interface BlogData {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured?: boolean;
  coverImage?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  author?: {
    name: string;
    email: string;
  };
  tags?: Array<{ name: string; slug: string }>;
}

interface TestimonialData {
  id?: string;
  name?: string;
  designation?: string;
  company?: string;
  location?: string;
  content?: string;
  rating?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'EDITOR';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContactFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

// Blog Factory
export const createMockBlog = (overrides: BlogData = {}): BlogData => {
  const title = overrides.title || faker.lorem.sentence({ min: 3, max: 8 });
  const slug = overrides.slug || faker.helpers.slugify(title).toLowerCase();
  
  return {
    id: overrides.id || faker.string.uuid(),
    title,
    slug,
    excerpt: overrides.excerpt || faker.lorem.paragraph({ min: 1, max: 3 }),
    content: overrides.content || generateMarkdownContent(),
    status: overrides.status || faker.helpers.arrayElement(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    featured: overrides.featured ?? faker.datatype.boolean(),
    coverImage: overrides.coverImage || faker.image.url({ width: 800, height: 400 }),
    publishedAt: overrides.publishedAt || faker.date.past(),
    createdAt: overrides.createdAt || faker.date.past(),
    updatedAt: overrides.updatedAt || faker.date.recent(),
    author: overrides.author || {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
    tags: overrides.tags || generateTags(),
    ...overrides,
  };
};

// Testimonial Factory
export const createMockTestimonial = (overrides: TestimonialData = {}): TestimonialData => {
  return {
    id: overrides.id || faker.string.uuid(),
    name: overrides.name || faker.person.fullName(),
    designation: overrides.designation || faker.person.jobTitle(),
    company: overrides.company || faker.company.name(),
    location: overrides.location || faker.location.city(),
    content: overrides.content || faker.lorem.paragraph({ min: 2, max: 4 }),
    rating: overrides.rating || faker.number.int({ min: 4, max: 5 }),
    status: overrides.status || faker.helpers.arrayElement(['PENDING', 'APPROVED', 'REJECTED']),
    featured: overrides.featured ?? faker.datatype.boolean(),
    createdAt: overrides.createdAt || faker.date.past(),
    updatedAt: overrides.updatedAt || faker.date.recent(),
    ...overrides,
  };
};

// User Factory
export const createMockUser = (overrides: UserData = {}): UserData => {
  return {
    id: overrides.id || faker.string.uuid(),
    name: overrides.name || faker.person.fullName(),
    email: overrides.email || faker.internet.email(),
    password: overrides.password || faker.internet.password({ length: 12 }),
    role: overrides.role || faker.helpers.arrayElement(['ADMIN', 'EDITOR']),
    createdAt: overrides.createdAt || faker.date.past(),
    updatedAt: overrides.updatedAt || faker.date.recent(),
    ...overrides,
  };
};

// Contact Form Factory
export const createMockContactForm = (overrides: ContactFormData = {}): ContactFormData => {
  return {
    firstName: overrides.firstName || faker.person.firstName(),
    lastName: overrides.lastName || faker.person.lastName(),
    email: overrides.email || faker.internet.email(),
    phone: overrides.phone || faker.phone.number(),
    subject: overrides.subject || faker.lorem.sentence({ min: 3, max: 6 }),
    message: overrides.message || faker.lorem.paragraph({ min: 2, max: 4 }),
    ...overrides,
  };
};

// Helper Functions
function generateMarkdownContent(): string {
  const sections = [
    `# ${faker.lorem.sentence({ min: 2, max: 5 })}`,
    '',
    faker.lorem.paragraph({ min: 2, max: 4 }),
    '',
    `## ${faker.lorem.sentence({ min: 2, max: 4 })}`,
    '',
    faker.lorem.paragraph({ min: 2, max: 3 }),
    '',
    '### Key Points:',
    '',
    ...Array.from({ length: 3 }, () => `- ${faker.lorem.sentence({ min: 4, max: 8 })}`),
    '',
    faker.lorem.paragraph({ min: 2, max: 3 }),
    '',
    `## ${faker.lorem.sentence({ min: 2, max: 4 })}`,
    '',
    faker.lorem.paragraph({ min: 3, max: 5 }),
  ];
  
  return sections.join('\n');
}

function generateTags(): Array<{ name: string; slug: string }> {
  const tagNames = [
    'Tax Planning', 'GST', 'Income Tax', 'Corporate Tax', 'Financial Advisory',
    'Small Business', 'Startup', 'Compliance', 'Audit', 'Investment',
    'Accounting', 'Bookkeeping', 'Financial Planning', 'Business Registration',
  ];
  
  const selectedTags = faker.helpers.arrayElements(tagNames, { min: 1, max: 4 });
  
  return selectedTags.map(name => ({
    name,
    slug: faker.helpers.slugify(name).toLowerCase(),
  }));
}

// Batch Creation Functions
export const createMockBlogs = (count: number, overrides: BlogData = {}): BlogData[] => {
  return Array.from({ length: count }, () => createMockBlog(overrides));
};

export const createMockTestimonials = (count: number, overrides: TestimonialData = {}): TestimonialData[] => {
  return Array.from({ length: count }, () => createMockTestimonial(overrides));
};

export const createMockUsers = (count: number, overrides: UserData = {}): UserData[] => {
  return Array.from({ length: count }, () => createMockUser(overrides));
};

// Predefined Test Data
export const testUsers = {
  admin: createMockUser({
    id: 'admin-user-id',
    name: 'Test Admin',
    email: 'admin@taxclusive.com',
    password: 'TestAdmin123!',
    role: 'ADMIN',
  }),
  editor: createMockUser({
    id: 'editor-user-id',
    name: 'Test Editor',
    email: 'editor@taxclusive.com',
    password: 'TestEditor123!',
    role: 'EDITOR',
  }),
};

export const testBlogs = {
  published: createMockBlog({
    id: 'published-blog-id',
    title: 'GST Compliance Guide for Small Businesses',
    status: 'PUBLISHED',
    featured: true,
  }),
  draft: createMockBlog({
    id: 'draft-blog-id',
    title: 'Draft Blog Post',
    status: 'DRAFT',
    featured: false,
  }),
  archived: createMockBlog({
    id: 'archived-blog-id',
    title: 'Archived Blog Post',
    status: 'ARCHIVED',
    featured: false,
  }),
};

export const testTestimonials = {
  approved: createMockTestimonial({
    id: 'approved-testimonial-id',
    name: 'Happy Client',
    status: 'APPROVED',
    featured: true,
    rating: 5,
  }),
  pending: createMockTestimonial({
    id: 'pending-testimonial-id',
    name: 'Pending Client',
    status: 'PENDING',
    featured: false,
    rating: 4,
  }),
  rejected: createMockTestimonial({
    id: 'rejected-testimonial-id',
    name: 'Rejected Client',
    status: 'REJECTED',
    featured: false,
    rating: 2,
  }),
};

// Database Seeding Data
export const seedData = {
  blogs: createMockBlogs(20, { status: 'PUBLISHED' }),
  testimonials: createMockTestimonials(15, { status: 'APPROVED' }),
  users: [testUsers.admin, testUsers.editor],
};

// API Response Factories
export const createApiResponse = <T>(data: T, success = true, message?: string) => ({
  success,
  message: message || (success ? 'Operation successful' : 'Operation failed'),
  data,
  timestamp: new Date().toISOString(),
});

export const createPaginatedResponse = <T>(
  items: T[],
  page = 1,
  limit = 10,
  total?: number
) => ({
  items: items.slice((page - 1) * limit, page * limit),
  pagination: {
    page,
    limit,
    total: total || items.length,
    totalPages: Math.ceil((total || items.length) / limit),
    hasNext: page * limit < (total || items.length),
    hasPrev: page > 1,
  },
});

// Error Response Factory
export const createErrorResponse = (message: string, code?: string, status = 400) => ({
  success: false,
  error: {
    message,
    code,
    status,
    timestamp: new Date().toISOString(),
  },
});

// Form Validation Helpers
export const createValidationErrors = (fields: string[]) => ({
  success: false,
  error: 'Validation failed',
  details: fields.reduce((acc, field) => ({
    ...acc,
    [field]: `${field} is required`,
  }), {}),
});

// File Upload Mock Data
export const createMockFile = (
  name = 'test-image.jpg',
  type = 'image/jpeg',
  size = 1024 * 1024 // 1MB
) => {
  const content = 'mock file content';
  return new File([content], name, { type, lastModified: Date.now() });
};

// Email Template Data
export const createEmailTemplateData = (type: 'contact' | 'appointment' | 'newsletter' | 'query') => {
  const baseData = {
    fromName: 'Taxclusive',
    fromEmail: 'noreply@taxclusive.com',
    timestamp: new Date().toISOString(),
  };

  switch (type) {
    case 'contact':
      return {
        ...baseData,
        subject: 'New Contact Form Submission',
        template: 'contact-form',
        data: createMockContactForm(),
      };
    case 'appointment':
      return {
        ...baseData,
        subject: 'New Appointment Request',
        template: 'appointment-booking',
        data: {
          ...createMockContactForm(),
          service: 'Tax Consultation',
          date: faker.date.future().toISOString().split('T')[0],
          time: '10:00 AM',
          meetingType: 'online',
        },
      };
    case 'newsletter':
      return {
        ...baseData,
        subject: 'Newsletter Subscription Confirmation',
        template: 'newsletter-subscription',
        data: {
          email: faker.internet.email(),
        },
      };
    case 'query':
      return {
        ...baseData,
        subject: 'New Query Submission',
        template: 'query-form',
        data: {
          ...createMockContactForm(),
          category: faker.helpers.arrayElement(['tax', 'gst', 'compliance', 'audit']),
          priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
          query: faker.lorem.paragraph({ min: 2, max: 4 }),
        },
      };
    default:
      return baseData;
  }
};