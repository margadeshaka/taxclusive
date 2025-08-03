import { test, expect, Page } from '@playwright/test';
import { testUsers, contactFormData, appointmentFormData, queryFormData } from './fixtures/test-data';

test.describe('Comprehensive User Journeys', () => {
  test.describe('Public User Journey', () => {
    test('complete visitor experience from landing to contact', async ({ page }) => {
      // 1. Land on homepage
      await page.goto('/');
      await expect(page).toHaveTitle(/Taxclusive/);
      
      // Check hero section
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByText(/chartered accountancy/i)).toBeVisible();

      // 2. Navigate through services
      await page.getByRole('link', { name: /services/i }).click();
      await expect(page).toHaveURL('/services');
      await expect(page.getByRole('heading', { name: /our services/i })).toBeVisible();

      // Check service cards are loaded
      await expect(page.locator('.service-card').first()).toBeVisible();

      // 3. Check expertise page
      await page.getByRole('link', { name: /expertise/i }).click();
      await expect(page).toHaveURL('/expertise');
      
      // 4. Visit insights/blogs
      await page.getByRole('link', { name: /insights/i }).click();
      await expect(page).toHaveURL('/insights');
      
      // Navigate to blogs
      await page.getByRole('link', { name: /view all blogs/i }).click();
      await expect(page).toHaveURL('/blogs');
      
      // Check if blogs are loaded
      const blogCount = await page.locator('.blog-card').count();
      if (blogCount > 0) {
        // Read a blog post
        await page.locator('.blog-card').first().click();
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        
        // Go back to blogs
        await page.goBack();
      }

      // 5. Check about page
      await page.getByRole('link', { name: /about/i }).click();
      await expect(page).toHaveURL('/about');
      await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();

      // 6. Check FAQ
      await page.getByRole('link', { name: /faq/i }).click();
      await expect(page).toHaveURL('/faq');
      
      // Interact with FAQ accordion
      const faqItem = page.locator('[data-testid="faq-item"]').first();
      if (await faqItem.isVisible()) {
        await faqItem.click();
        await expect(faqItem.locator('.faq-answer')).toBeVisible();
      }

      // 7. Fill contact form
      await page.getByRole('link', { name: /contact/i }).click();
      await expect(page).toHaveURL('/contact');
      
      await page.fill('[name="firstName"]', contactFormData.firstName);
      await page.fill('[name="lastName"]', contactFormData.lastName);
      await page.fill('[name="email"]', contactFormData.email);
      await page.fill('[name="phone"]', contactFormData.phone);
      await page.fill('[name="subject"]', contactFormData.subject);
      await page.fill('[name="message"]', contactFormData.message);
      
      await page.getByRole('button', { name: /send message/i }).click();
      
      // Check for success message
      await expect(page.getByText(/message sent successfully/i)).toBeVisible({ timeout: 10000 });
    });

    test('appointment booking flow', async ({ page }) => {
      await page.goto('/appointment');
      
      // Fill appointment form
      await page.fill('[name="firstName"]', appointmentFormData.firstName);
      await page.fill('[name="lastName"]', appointmentFormData.lastName);
      await page.fill('[name="email"]', appointmentFormData.email);
      await page.fill('[name="phone"]', appointmentFormData.phone);
      
      // Select service
      await page.selectOption('[name="service"]', appointmentFormData.service);
      
      // Select date and time
      await page.fill('[name="date"]', appointmentFormData.date);
      await page.selectOption('[name="time"]', appointmentFormData.time);
      
      // Select meeting type
      await page.check(`[value="${appointmentFormData.meetingType}"]`);
      
      // Add message
      await page.fill('[name="message"]', appointmentFormData.message);
      
      // Submit appointment
      await page.getByRole('button', { name: /book appointment/i }).click();
      
      // Verify success
      await expect(page.getByText(/appointment booked successfully/i)).toBeVisible({ timeout: 10000 });
    });

    test('query submission flow', async ({ page }) => {
      await page.goto('/ask-query');
      
      // Fill query form
      await page.fill('[name="fullName"]', queryFormData.fullName);
      await page.fill('[name="email"]', queryFormData.email);
      await page.fill('[name="phone"]', queryFormData.phone);
      
      // Select category and priority
      await page.selectOption('[name="category"]', queryFormData.category);
      await page.selectOption('[name="priority"]', queryFormData.priority);
      
      await page.fill('[name="subject"]', queryFormData.subject);
      await page.fill('[name="query"]', queryFormData.query);
      
      // Submit query
      await page.getByRole('button', { name: /submit query/i }).click();
      
      // Verify success
      await expect(page.getByText(/query submitted successfully/i)).toBeVisible({ timeout: 10000 });
    });

    test('newsletter subscription', async ({ page }) => {
      await page.goto('/');
      
      // Find newsletter subscription section
      const newsletterSection = page.locator('[data-testid="newsletter-subscription"]').first();
      await newsletterSection.scrollIntoViewIfNeeded();
      
      // Fill email and subscribe
      await newsletterSection.getByPlaceholder(/email/i).fill('newsletter-test@example.com');
      await newsletterSection.getByRole('button', { name: /subscribe/i }).click();
      
      // Verify success
      await expect(page.getByText(/subscribed successfully/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Admin User Journey', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/admin/login');
      await page.fill('[name="email"]', testUsers.admin.email);
      await page.fill('[name="password"]', testUsers.admin.password);
      await page.getByRole('button', { name: /sign in/i }).click();
      await expect(page).toHaveURL('/admin');
    });

    test('complete blog management workflow', async ({ page }) => {
      // Navigate to blogs
      await page.getByRole('link', { name: /blogs/i }).click();
      await expect(page).toHaveURL('/admin/blogs');
      
      // Create new blog
      await page.getByRole('link', { name: /new blog/i }).click();
      await expect(page).toHaveURL('/admin/blogs/new');
      
      // Fill blog form
      await page.fill('[name="title"]', 'E2E Test Blog Post');
      await page.fill('[name="excerpt"]', 'This is a test blog post created during E2E testing');
      
      // Use rich text editor
      const contentEditor = page.locator('[data-testid="rich-text-editor"]');
      await contentEditor.fill('# Test Blog Content\n\nThis is the main content of the test blog post.');
      
      // Set status and save as draft first
      await page.selectOption('[name="status"]', 'DRAFT');
      await page.getByRole('button', { name: /save draft/i }).click();
      
      // Verify draft saved
      await expect(page.getByText(/draft saved/i)).toBeVisible();
      
      // Now publish the blog
      await page.selectOption('[name="status"]', 'PUBLISHED');
      await page.check('[name="featured"]'); // Make it featured
      await page.getByRole('button', { name: /publish/i }).click();
      
      // Verify published
      await expect(page.getByText(/blog published/i)).toBeVisible();
      
      // Go back to blogs list
      await page.getByRole('link', { name: /back to blogs/i }).click();
      await expect(page).toHaveURL('/admin/blogs');
      
      // Verify blog appears in list
      await expect(page.getByText('E2E Test Blog Post')).toBeVisible();
      
      // Edit the blog
      await page.getByText('E2E Test Blog Post').click();
      await page.getByRole('button', { name: /edit/i }).click();
      
      // Update title
      await page.fill('[name="title"]', 'Updated E2E Test Blog Post');
      await page.getByRole('button', { name: /update/i }).click();
      
      // Verify update
      await expect(page.getByText(/blog updated/i)).toBeVisible();
      
      // Delete the blog (cleanup)
      await page.getByRole('button', { name: /delete/i }).click();
      await page.getByRole('button', { name: /confirm delete/i }).click();
      
      // Verify deletion
      await expect(page.getByText(/blog deleted/i)).toBeVisible();
    });

    test('testimonial management workflow', async ({ page }) => {
      // Navigate to testimonials
      await page.getByRole('link', { name: /testimonials/i }).click();
      await expect(page).toHaveURL('/admin/testimonials');
      
      // Add new testimonial
      await page.getByRole('button', { name: /add testimonial/i }).click();
      
      // Fill testimonial form
      await page.fill('[name="name"]', 'Test Client');
      await page.fill('[name="designation"]', 'CEO');
      await page.fill('[name="company"]', 'Test Company Ltd');
      await page.fill('[name="location"]', 'Test City');
      await page.fill('[name="content"]', 'This is an excellent service provided by Taxclusive.');
      await page.selectOption('[name="rating"]', '5');
      
      // Save testimonial
      await page.getByRole('button', { name: /save testimonial/i }).click();
      
      // Verify saved
      await expect(page.getByText(/testimonial saved/i)).toBeVisible();
      
      // Approve testimonial
      await page.getByRole('button', { name: /approve/i }).first().click();
      await expect(page.getByText(/testimonial approved/i)).toBeVisible();
      
      // Feature testimonial
      await page.getByRole('button', { name: /feature/i }).first().click();
      await expect(page.getByText(/testimonial featured/i)).toBeVisible();
    });

    test('user management workflow (admin only)', async ({ page }) => {
      // Navigate to users
      await page.getByRole('link', { name: /users/i }).click();
      await expect(page).toHaveURL('/admin/users');
      
      // Add new user
      await page.getByRole('button', { name: /add user/i }).click();
      
      // Fill user form
      await page.fill('[name="name"]', 'Test Editor');
      await page.fill('[name="email"]', 'test-editor@taxclusive.com');
      await page.fill('[name="password"]', 'TestPassword123!');
      await page.selectOption('[name="role"]', 'EDITOR');
      
      // Save user
      await page.getByRole('button', { name: /create user/i }).click();
      
      // Verify user created
      await expect(page.getByText(/user created/i)).toBeVisible();
      await expect(page.getByText('test-editor@taxclusive.com')).toBeVisible();
      
      // Edit user
      await page.getByText('test-editor@taxclusive.com').locator('..').getByRole('button', { name: /edit/i }).click();
      await page.fill('[name="name"]', 'Updated Test Editor');
      await page.getByRole('button', { name: /update user/i }).click();
      
      // Verify update
      await expect(page.getByText(/user updated/i)).toBeVisible();
      
      // Delete user (cleanup)
      await page.getByText('test-editor@taxclusive.com').locator('..').getByRole('button', { name: /delete/i }).click();
      await page.getByRole('button', { name: /confirm delete/i }).click();
      
      // Verify deletion
      await expect(page.getByText(/user deleted/i)).toBeVisible();
    });

    test('dashboard overview and navigation', async ({ page }) => {
      // Should be on dashboard
      await expect(page).toHaveURL('/admin');
      
      // Check dashboard stats
      await expect(page.getByText(/total blogs/i)).toBeVisible();
      await expect(page.getByText(/published blogs/i)).toBeVisible();
      await expect(page.getByText(/total testimonials/i)).toBeVisible();
      await expect(page.getByText(/total users/i)).toBeVisible();
      
      // Check recent activity
      await expect(page.getByText(/recent activity/i)).toBeVisible();
      
      // Check quick actions
      await expect(page.getByText(/quick actions/i)).toBeVisible();
      await expect(page.getByRole('link', { name: /create new blog/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /add testimonial/i })).toBeVisible();
      
      // Test navigation between sections
      const navItems = [
        { name: /blogs/i, url: '/admin/blogs' },
        { name: /testimonials/i, url: '/admin/testimonials' },
        { name: /users/i, url: '/admin/users' },
      ];
      
      for (const item of navItems) {
        await page.getByRole('link', { name: item.name }).click();
        await expect(page).toHaveURL(item.url);
        
        // Go back to dashboard
        await page.getByRole('link', { name: /dashboard/i }).click();
        await expect(page).toHaveURL('/admin');
      }
    });

    test('admin logout flow', async ({ page }) => {
      // Logout
      await page.getByRole('button', { name: /logout/i }).click();
      
      // Should redirect to login
      await expect(page).toHaveURL('/admin/login');
      
      // Try to access admin page (should redirect to login)
      await page.goto('/admin');
      await expect(page).toHaveURL('/admin/login');
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('handles 404 pages gracefully', async ({ page }) => {
      await page.goto('/nonexistent-page');
      await expect(page.getByText(/page not found/i)).toBeVisible();
      await expect(page.getByRole('link', { name: /go home/i })).toBeVisible();
    });

    test('handles network errors gracefully', async ({ page }) => {
      // Simulate offline scenario
      await page.context().setOffline(true);
      
      await page.goto('/');
      await page.fill('[name="firstName"]', 'Test');
      await page.fill('[name="email"]', 'test@example.com');
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Should show network error message
      await expect(page.getByText(/network error/i)).toBeVisible();
      
      // Restore connection
      await page.context().setOffline(false);
    });

    test('handles form validation errors', async ({ page }) => {
      await page.goto('/contact');
      
      // Submit empty form
      await page.getByRole('button', { name: /send message/i }).click();
      
      // Check validation errors
      await expect(page.getByText(/name is required/i)).toBeVisible();
      await expect(page.getByText(/email is required/i)).toBeVisible();
      
      // Fill invalid email
      await page.fill('[name="email"]', 'invalid-email');
      await page.getByRole('button', { name: /send message/i }).click();
      
      await expect(page.getByText(/invalid email format/i)).toBeVisible();
    });

    test('handles slow loading states', async ({ page }) => {
      // Navigate to blogs page
      await page.goto('/blogs');
      
      // Should show loading skeleton initially
      await expect(page.locator('.loading-skeleton')).toBeVisible();
      
      // Wait for content to load
      await expect(page.locator('.blog-card').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Mobile Responsive Experience', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE
    
    test('mobile navigation works correctly', async ({ page }) => {
      await page.goto('/');
      
      // Mobile menu should be closed initially
      await expect(page.getByRole('navigation', { name: /mobile/i })).toBeHidden();
      
      // Open mobile menu
      await page.getByRole('button', { name: /open menu/i }).click();
      await expect(page.getByRole('navigation', { name: /mobile/i })).toBeVisible();
      
      // Navigate using mobile menu
      await page.getByRole('link', { name: /services/i }).click();
      await expect(page).toHaveURL('/services');
      
      // Menu should close after navigation
      await expect(page.getByRole('navigation', { name: /mobile/i })).toBeHidden();
    });

    test('forms are usable on mobile', async ({ page }) => {
      await page.goto('/contact');
      
      // Form should be responsive
      await expect(page.locator('form')).toBeVisible();
      
      // Fill and submit form
      await page.fill('[name="firstName"]', contactFormData.firstName);
      await page.fill('[name="lastName"]', contactFormData.lastName);
      await page.fill('[name="email"]', contactFormData.email);
      await page.fill('[name="phone"]', contactFormData.phone);
      await page.fill('[name="subject"]', contactFormData.subject);
      await page.fill('[name="message"]', contactFormData.message);
      
      await page.getByRole('button', { name: /send message/i }).click();
      await expect(page.getByText(/message sent successfully/i)).toBeVisible({ timeout: 10000 });
    });
  });
});