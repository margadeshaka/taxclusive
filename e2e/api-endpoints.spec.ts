import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsEditor } from './helpers/auth'
import { setupDatabase, teardownDatabase } from './helpers/database'

test.describe('API Endpoints', () => {
  test.beforeAll(async () => {
    await setupDatabase()
  })

  test.afterAll(async () => {
    await teardownDatabase()
  })

  test.describe('Public API Endpoints', () => {
    test('should handle contact form submission', async ({ page }) => {
      const response = await page.request.post('/api/contact', {
        data: {
          firstName: 'API Test',
          lastName: 'User',
          email: 'apitest@test.com',
          phone: '+1234567890',
          subject: 'API Test Contact',
          message: 'This is a test message from API endpoint test'
        }
      })
      
      expect(response.status()).toBe(200)
      
      const responseData = await response.json()
      expect(responseData.success).toBe(true)
    })

    test('should validate contact form data', async ({ page }) => {
      const response = await page.request.post('/api/contact', {
        data: {
          firstName: '',
          lastName: '',
          email: 'invalid-email',
          subject: '',
          message: ''
        }
      })
      
      expect(response.status()).toBe(400)
      
      const responseData = await response.json()
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('validation')
    })

    test('should handle appointment booking', async ({ page }) => {
      const response = await page.request.post('/api/appointment', {
        data: {
          firstName: 'API Appointment',
          lastName: 'Test',
          email: 'appointment@test.com',
          phone: '+1234567890',
          service: 'Tax Planning',
          date: '2024-12-31',
          time: '10:00',
          meetingType: 'online',
          message: 'API test appointment booking'
        }
      })
      
      expect(response.status()).toBe(200)
      
      const responseData = await response.json()
      expect(responseData.success).toBe(true)
    })

    test('should handle newsletter subscription', async ({ page }) => {
      const response = await page.request.post('/api/newsletter', {
        data: {
          email: `newsletter-${Date.now()}@test.com`
        }
      })
      
      expect(response.status()).toBe(200)
      
      const responseData = await response.json()
      expect(responseData.success).toBe(true)
    })

    test('should prevent duplicate newsletter subscription', async ({ page }) => {
      const email = 'duplicate@test.com'
      
      // First subscription
      await page.request.post('/api/newsletter', {
        data: { email }
      })
      
      // Duplicate subscription
      const response = await page.request.post('/api/newsletter', {
        data: { email }
      })
      
      expect(response.status()).toBe(409)
      
      const responseData = await response.json()
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('already subscribed')
    })

    test('should handle query submission', async ({ page }) => {
      const response = await page.request.post('/api/query', {
        data: {
          fullName: 'API Query Test',
          email: 'query@test.com',
          phone: '+1234567890',
          category: 'tax-planning',
          priority: 'medium',
          subject: 'API Test Query',
          query: 'This is a test query from API endpoint test'
        }
      })
      
      expect(response.status()).toBe(200)
      
      const responseData = await response.json()
      expect(responseData.success).toBe(true)
    })

    test('should handle message submission', async ({ page }) => {
      const response = await page.request.post('/api/message', {
        data: {
          name: 'API Message Test',
          email: 'message@test.com',
          message: 'This is a test message from API endpoint test'
        }
      })
      
      expect(response.status()).toBe(200)
      
      const responseData = await response.json()
      expect(responseData.success).toBe(true)
    })
  })

  test.describe('Admin API Endpoints - Authentication', () => {
    test('should require authentication for admin endpoints', async ({ page }) => {
      const adminEndpoints = [
        '/api/admin/users',
        '/api/admin/blogs',
        '/api/admin/testimonials'
      ]
      
      for (const endpoint of adminEndpoints) {
        const response = await page.request.get(endpoint)
        expect([401, 403]).toContain(response.status())
      }
    })

    test('should authenticate valid admin credentials', async ({ page }) => {
      const response = await page.request.post('/api/auth/signin', {
        data: {
          email: 'admin@taxclusive.com',
          password: 'admin123'
        }
      })
      
      expect([200, 302]).toContain(response.status())
    })

    test('should reject invalid credentials', async ({ page }) => {
      const response = await page.request.post('/api/auth/signin', {
        data: {
          email: 'invalid@test.com',
          password: 'wrongpassword'
        }
      })
      
      expect([401, 400]).toContain(response.status())
    })
  })

  test.describe('Admin API Endpoints - Users', () => {
    test('admin should access user API endpoints', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Get users
      const getUsersResponse = await page.request.get('/api/admin/users')
      expect(getUsersResponse.status()).toBe(200)
      
      const users = await getUsersResponse.json()
      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBeGreaterThan(0)
      
      // Create user
      const createResponse = await page.request.post('/api/admin/users', {
        data: {
          name: 'API Created User',
          email: 'apicreated@test.com',
          password: 'password123',
          role: 'EDITOR'
        }
      })
      
      expect(createResponse.status()).toBe(201)
      
      const createdUser = await createResponse.json()
      expect(createdUser.email).toBe('apicreated@test.com')
      expect(createdUser.role).toBe('EDITOR')
      
      // Update user
      const updateResponse = await page.request.put(`/api/admin/users/${createdUser.id}`, {
        data: {
          name: 'Updated API User',
          email: 'apicreated@test.com',
          role: 'ADMIN'
        }
      })
      
      expect(updateResponse.status()).toBe(200)
      
      const updatedUser = await updateResponse.json()
      expect(updatedUser.name).toBe('Updated API User')
      expect(updatedUser.role).toBe('ADMIN')
      
      // Delete user
      const deleteResponse = await page.request.delete(`/api/admin/users/${createdUser.id}`)
      expect(deleteResponse.status()).toBe(200)
    })

    test('editor should NOT access user API endpoints', async ({ page }) => {
      await loginAsEditor(page)
      
      const userEndpoints = [
        { method: 'GET', url: '/api/admin/users' },
        { method: 'POST', url: '/api/admin/users' },
        { method: 'PUT', url: '/api/admin/users/1' },
        { method: 'DELETE', url: '/api/admin/users/1' }
      ]
      
      for (const endpoint of userEndpoints) {
        let response
        
        switch (endpoint.method) {
          case 'GET':
            response = await page.request.get(endpoint.url)
            break
          case 'POST':
            response = await page.request.post(endpoint.url, { data: {} })
            break
          case 'PUT':
            response = await page.request.put(endpoint.url, { data: {} })
            break
          case 'DELETE':
            response = await page.request.delete(endpoint.url)
            break
        }
        
        expect([401, 403]).toContain(response.status())
      }
    })
  })

  test.describe('Admin API Endpoints - Blogs', () => {
    test('should handle blog CRUD operations', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Get blogs
      const getBlogsResponse = await page.request.get('/api/admin/blogs')
      expect(getBlogsResponse.status()).toBe(200)
      
      // Create blog
      const createResponse = await page.request.post('/api/admin/blogs', {
        data: {
          title: 'API Test Blog',
          slug: 'api-test-blog',
          excerpt: 'Test blog created via API',
          content: '# API Test Blog\n\nThis is a test blog created via API.',
          status: 'PUBLISHED',
          featuredImage: 'https://example.com/image.jpg',
          metaDescription: 'API test blog meta description',
          category: 'Tax Planning',
          tags: ['api', 'test']
        }
      })
      
      expect(createResponse.status()).toBe(201)
      
      const createdBlog = await createResponse.json()
      expect(createdBlog.title).toBe('API Test Blog')
      expect(createdBlog.slug).toBe('api-test-blog')
      expect(createdBlog.status).toBe('PUBLISHED')
      
      // Update blog
      const updateResponse = await page.request.put(`/api/admin/blogs/${createdBlog.id}`, {
        data: {
          title: 'Updated API Test Blog',
          slug: 'api-test-blog',
          excerpt: 'Updated test blog',
          content: '# Updated API Test Blog\n\nThis blog has been updated.',
          status: 'DRAFT'
        }
      })
      
      expect(updateResponse.status()).toBe(200)
      
      const updatedBlog = await updateResponse.json()
      expect(updatedBlog.title).toBe('Updated API Test Blog')
      expect(updatedBlog.status).toBe('DRAFT')
      
      // Get single blog
      const getSingleResponse = await page.request.get(`/api/admin/blogs/${createdBlog.id}`)
      expect(getSingleResponse.status()).toBe(200)
      
      const singleBlog = await getSingleResponse.json()
      expect(singleBlog.id).toBe(createdBlog.id)
      
      // Delete blog
      const deleteResponse = await page.request.delete(`/api/admin/blogs/${createdBlog.id}`)
      expect(deleteResponse.status()).toBe(200)
    })

    test('should validate blog data', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Try creating blog with missing required fields
      const response = await page.request.post('/api/admin/blogs', {
        data: {
          title: '',
          slug: '',
          excerpt: '',
          content: ''
        }
      })
      
      expect(response.status()).toBe(400)
      
      const responseData = await response.json()
      expect(responseData.success).toBe(false)
    })

    test('should prevent duplicate blog slugs', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Create first blog
      await page.request.post('/api/admin/blogs', {
        data: {
          title: 'Duplicate Slug Test 1',
          slug: 'duplicate-slug-test',
          excerpt: 'First blog',
          content: 'Content 1'
        }
      })
      
      // Try creating second blog with same slug
      const response = await page.request.post('/api/admin/blogs', {
        data: {
          title: 'Duplicate Slug Test 2',
          slug: 'duplicate-slug-test',
          excerpt: 'Second blog',
          content: 'Content 2'
        }
      })
      
      expect(response.status()).toBe(409)
      
      const responseData = await response.json()
      expect(responseData.error).toContain('slug')
    })

    test('editor should access blog API endpoints', async ({ page }) => {
      await loginAsEditor(page)
      
      // Get blogs
      const getBlogsResponse = await page.request.get('/api/admin/blogs')
      expect(getBlogsResponse.status()).toBe(200)
      
      // Create blog
      const createResponse = await page.request.post('/api/admin/blogs', {
        data: {
          title: 'Editor API Blog',
          slug: 'editor-api-blog',
          excerpt: 'Blog created by editor via API',
          content: '# Editor Blog\n\nCreated by editor.',
          status: 'DRAFT'
        }
      })
      
      expect(createResponse.status()).toBe(201)
      
      const createdBlog = await createResponse.json()
      
      // Cleanup
      await page.request.delete(`/api/admin/blogs/${createdBlog.id}`)
    })
  })

  test.describe('Admin API Endpoints - Testimonials', () => {
    test('should handle testimonial CRUD operations', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Get testimonials
      const getTestimonialsResponse = await page.request.get('/api/admin/testimonials')
      expect(getTestimonialsResponse.status()).toBe(200)
      
      // Create testimonial
      const createResponse = await page.request.post('/api/admin/testimonials', {
        data: {
          name: 'API Test Client',
          company: 'API Test Company',
          position: 'CTO',
          content: 'Excellent service! Highly recommend for API testing.',
          rating: 5,
          avatar: 'https://example.com/avatar.jpg',
          location: 'API City',
          featured: true
        }
      })
      
      expect(createResponse.status()).toBe(201)
      
      const createdTestimonial = await createResponse.json()
      expect(createdTestimonial.name).toBe('API Test Client')
      expect(createdTestimonial.rating).toBe(5)
      expect(createdTestimonial.featured).toBe(true)
      
      // Update testimonial
      const updateResponse = await page.request.put(`/api/admin/testimonials/${createdTestimonial.id}`, {
        data: {
          name: 'Updated API Client',
          company: 'Updated API Company',
          content: 'Updated testimonial content',
          rating: 4,
          featured: false
        }
      })
      
      expect(updateResponse.status()).toBe(200)
      
      const updatedTestimonial = await updateResponse.json()
      expect(updatedTestimonial.name).toBe('Updated API Client')
      expect(updatedTestimonial.rating).toBe(4)
      expect(updatedTestimonial.featured).toBe(false)
      
      // Get single testimonial
      const getSingleResponse = await page.request.get(`/api/admin/testimonials/${createdTestimonial.id}`)
      expect(getSingleResponse.status()).toBe(200)
      
      // Delete testimonial
      const deleteResponse = await page.request.delete(`/api/admin/testimonials/${createdTestimonial.id}`)
      expect(deleteResponse.status()).toBe(200)
    })

    test('should validate testimonial data', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Try creating testimonial with invalid rating
      const response = await page.request.post('/api/admin/testimonials', {
        data: {
          name: 'Invalid Rating Test',
          content: 'Test content',
          rating: 6 // Invalid rating > 5
        }
      })
      
      expect(response.status()).toBe(400)
    })

    test('editor should access testimonial API endpoints', async ({ page }) => {
      await loginAsEditor(page)
      
      // Get testimonials
      const getTestimonialsResponse = await page.request.get('/api/admin/testimonials')
      expect(getTestimonialsResponse.status()).toBe(200)
      
      // Create testimonial
      const createResponse = await page.request.post('/api/admin/testimonials', {
        data: {
          name: 'Editor API Client',
          content: 'Testimonial created by editor via API',
          rating: 4
        }
      })
      
      expect(createResponse.status()).toBe(201)
      
      const createdTestimonial = await createResponse.json()
      
      // Cleanup
      await page.request.delete(`/api/admin/testimonials/${createdTestimonial.id}`)
    })
  })

  test.describe('API Error Handling', () => {
    test('should handle 404 for non-existent resources', async ({ page }) => {
      await loginAsAdmin(page)
      
      const response = await page.request.get('/api/admin/blogs/99999')
      expect(response.status()).toBe(404)
    })

    test('should handle malformed JSON requests', async ({ page }) => {
      await loginAsAdmin(page)
      
      const response = await page.request.post('/api/admin/blogs', {
        data: 'invalid json string'
      })
      
      expect([400, 500]).toContain(response.status())
    })

    test('should handle CORS for valid origins', async ({ page }) => {
      const response = await page.request.get('/api/contact', {
        headers: {
          'Origin': 'http://localhost:3000'
        }
      })
      
      // Should include CORS headers
      const corsHeader = response.headers()['access-control-allow-origin']
      expect(corsHeader).toBeDefined()
    })

    test('should handle rate limiting', async ({ page }) => {
      // Make multiple rapid requests to test rate limiting
      const promises = []
      
      for (let i = 0; i < 20; i++) {
        promises.push(
          page.request.post('/api/contact', {
            data: {
              firstName: `RateLimit${i}`,
              lastName: 'Test',
              email: `ratelimit${i}@test.com`,
              subject: 'Rate Limit Test',
              message: 'Testing rate limiting'
            }
          })
        )
      }
      
      const responses = await Promise.all(promises)
      
      // Some requests should succeed, some might be rate limited
      const statusCodes = responses.map(r => r.status())
      const successCount = statusCodes.filter(code => code === 200).length
      const rateLimitedCount = statusCodes.filter(code => code === 429).length
      
      // At least some should succeed
      expect(successCount).toBeGreaterThan(0)
      
      // If rate limiting is implemented, some should be limited
      // If not implemented, all should succeed (that's also valid)
      expect(successCount + rateLimitedCount).toBe(20)
    })
  })

  test.describe('API Response Format', () => {
    test('should return consistent response format', async ({ page }) => {
      const response = await page.request.post('/api/contact', {
        data: {
          firstName: 'Format Test',
          lastName: 'User',
          email: 'format@test.com',
          subject: 'Test Subject',
          message: 'Test message'
        }
      })
      
      expect(response.status()).toBe(200)
      
      const responseData = await response.json()
      expect(responseData).toHaveProperty('success')
      expect(typeof responseData.success).toBe('boolean')
      
      if (responseData.success) {
        expect(responseData).toHaveProperty('message')
      } else {
        expect(responseData).toHaveProperty('error')
      }
    })

    test('should return proper content-type headers', async ({ page }) => {
      await loginAsAdmin(page)
      
      const response = await page.request.get('/api/admin/blogs')
      
      const contentType = response.headers()['content-type']
      expect(contentType).toContain('application/json')
    })

    test('should include proper cache headers for static data', async ({ page }) => {
      const response = await page.request.get('/api/blogs') // Public blogs endpoint
      
      // Should have appropriate cache headers for public data
      const headers = response.headers()
      expect(headers).toHaveProperty('cache-control')
    })
  })
})