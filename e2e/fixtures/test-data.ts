export const testUsers = {
  admin: {
    email: 'admin@taxclusive.com',
    password: 'admin123',
    role: 'ADMIN'
  },
  editor: {
    email: 'editor@taxclusive.com',
    password: 'editor123',
    role: 'EDITOR'
  },
  newAdmin: {
    email: 'newadmin@test.com',
    password: 'TestPassword123!',
    name: 'New Admin User',
    role: 'ADMIN'
  },
  newEditor: {
    email: 'neweditor@test.com',
    password: 'TestPassword123!',
    name: 'New Editor User',
    role: 'EDITOR'
  }
}

export const testBlog = {
  title: 'E2E Test Blog Post',
  excerpt: 'This is a test blog post created by E2E tests',
  content: `# Test Blog Content

This is a test blog post with **bold text** and *italic text*.

## Test Section

- List item 1
- List item 2
- List item 3

[Test Link](https://example.com)`,
  tags: 'test, e2e, automation',
  coverImage: 'https://example.com/test-image.jpg'
}

export const testTestimonial = {
  name: 'Test Client',
  designation: 'CEO',
  company: 'Test Company Ltd',
  location: 'Test City',
  content: 'This is an excellent service provided by Taxclusive. Highly recommended for all tax and accounting needs.',
  rating: 5
}

export const contactFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  phone: '+1234567890',
  subject: 'E2E Test Contact',
  message: 'This is a test message from E2E tests. Please ignore.'
}

export const appointmentFormData = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@test.com',
  phone: '+0987654321',
  service: 'Tax Consultation',
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  time: '10:00',
  meetingType: 'online',
  message: 'E2E test appointment booking'
}

export const newsletterEmail = 'newsletter-test@example.com'

export const queryFormData = {
  fullName: 'Query Tester',
  email: 'query@test.com',
  phone: '+1122334455',
  category: 'tax',
  priority: 'high',
  subject: 'E2E Test Query',
  query: 'This is a test query submitted through E2E tests.'
}