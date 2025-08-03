import { test, expect } from '@playwright/test';

test.describe('Simple Integration Tests', () => {
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Taxclusive/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Blogs page displays content', async ({ page }) => {
    await page.goto('/blogs');
    await expect(page).toHaveTitle(/Blog/);
    
    // Check for either blog posts or empty state
    const blogPosts = page.locator('article');
    const emptyState = page.locator('text=No blogs available');
    
    const hasPosts = await blogPosts.count() > 0;
    const isEmpty = await emptyState.isVisible().catch(() => false);
    
    expect(hasPosts || isEmpty).toBeTruthy();
  });

  test('Admin login works', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Fill login form
    await page.fill('input[type="email"]', 'admin@taxclusive.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Should redirect to admin dashboard
    await page.waitForURL('/admin', { timeout: 10000 });
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('Public API endpoints are accessible', async ({ request }) => {
    // Test blogs API
    const blogsResponse = await request.get('/api/public/blogs');
    expect(blogsResponse.status()).toBe(200);
    
    const blogsData = await blogsResponse.json();
    expect(blogsData).toHaveProperty('success');
    expect(blogsData).toHaveProperty('data');
    expect(Array.isArray(blogsData.data)).toBeTruthy();
    
    // Test testimonials API
    const testimonialsResponse = await request.get('/api/public/testimonials');
    expect(testimonialsResponse.status()).toBe(200);
    
    const testimonialsData = await testimonialsResponse.json();
    expect(testimonialsData).toHaveProperty('success');
    expect(testimonialsData).toHaveProperty('data');
    expect(Array.isArray(testimonialsData.data)).toBeTruthy();
  });

  test('Admin can access blogs management', async ({ page }) => {
    // Login first
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@taxclusive.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL('/admin');
    
    // Navigate to blogs
    await page.click('a[href="/admin/blogs"]');
    await page.waitForURL('/admin/blogs');
    
    // Check page loaded
    await expect(page.locator('h1')).toContainText('Blogs');
    
    // Check for create button
    await expect(page.locator('text=Create New Blog')).toBeVisible();
  });

  test('Admin can access testimonials management', async ({ page }) => {
    // Login first
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@taxclusive.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL('/admin');
    
    // Navigate to testimonials
    await page.click('a[href="/admin/testimonials"]');
    await page.waitForURL('/admin/testimonials');
    
    // Check page loaded
    await expect(page.locator('h1')).toContainText('Testimonials');
    
    // Check for add button
    await expect(page.locator('text=Add Testimonial')).toBeVisible();
  });

  test('Contact form is accessible', async ({ page }) => {
    await page.goto('/contact');
    
    // Check form elements exist
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Services page loads', async ({ page }) => {
    await page.goto('/services');
    await expect(page).toHaveTitle(/Services/);
    await expect(page.locator('h1')).toContainText(/Services/);
  });

  test('About page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation menu works', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const navLinks = [
      { text: 'About', url: '/about' },
      { text: 'Services', url: '/services' },
      { text: 'Blogs', url: '/blogs' },
      { text: 'Contact', url: '/contact' }
    ];
    
    for (const link of navLinks) {
      const navLink = page.locator(`nav a:has-text("${link.text}")`).first();
      await expect(navLink).toBeVisible();
      
      // Check href attribute
      const href = await navLink.getAttribute('href');
      expect(href).toBe(link.url);
    }
  });
});