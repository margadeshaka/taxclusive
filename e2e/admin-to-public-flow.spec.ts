import { test, expect } from '@playwright/test';

test.describe('Admin to Public Content Flow', () => {
  const adminEmail = 'admin@taxclusive.com';
  const adminPassword = 'admin123';
  
  // Generate unique content for testing
  const uniqueId = Date.now().toString();
  const testBlog = {
    title: `Test Blog ${uniqueId}`,
    slug: `test-blog-${uniqueId}`,
    excerpt: `This is a test excerpt for blog ${uniqueId}`,
    content: `This is the full content of the test blog post ${uniqueId}. It contains enough text to test the reading time calculation and content display.`,
  };
  
  const testTestimonial = {
    name: `Test Client ${uniqueId}`,
    role: 'CEO',
    company: `Test Company ${uniqueId}`,
    content: `This is a test testimonial content ${uniqueId}. The service was excellent!`,
    rating: 5,
  };

  test.beforeEach(async ({ page }) => {
    // Login to admin panel
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin dashboard
    await page.waitForURL('/admin');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('Admin creates blog and it appears on public site', async ({ page }) => {
    // Navigate to blogs admin
    await page.click('text=Blogs');
    await page.waitForURL('/admin/blogs');
    
    // Click create new blog
    await page.click('text=Create New Blog');
    await page.waitForURL('/admin/blogs/new');
    
    // Fill in blog details
    await page.fill('input[name="title"]', testBlog.title);
    await page.fill('input[name="slug"]', testBlog.slug);
    await page.fill('textarea[name="excerpt"]', testBlog.excerpt);
    await page.fill('textarea[name="content"]', testBlog.content);
    
    // Set status to published
    await page.selectOption('select[name="status"]', 'PUBLISHED');
    
    // Save the blog
    await page.click('button:has-text("Create Blog")');
    
    // Wait for success message or redirect
    await page.waitForTimeout(2000);
    
    // Now visit the public blogs page
    await page.goto('/blogs');
    
    // Check if the blog appears in the list
    await expect(page.locator(`text=${testBlog.title}`)).toBeVisible();
    await expect(page.locator(`text=${testBlog.excerpt}`)).toBeVisible();
    
    // Click on the blog to view details
    await page.click(`text=${testBlog.title}`);
    
    // Verify we're on the blog detail page
    await expect(page).toHaveURL(new RegExp(`/blogs/${testBlog.slug}`));
    
    // Verify blog content is displayed
    await expect(page.locator('h1')).toContainText(testBlog.title);
    await expect(page.locator('text=' + testBlog.content)).toBeVisible();
  });

  test('Admin creates testimonial and it appears on homepage', async ({ page }) => {
    // Navigate to testimonials admin
    await page.click('text=Testimonials');
    await page.waitForURL('/admin/testimonials');
    
    // Open create testimonial dialog
    await page.click('button:has-text("Add Testimonial")');
    
    // Wait for dialog to open
    await page.waitForSelector('input[name="name"]');
    
    // Fill in testimonial details
    await page.fill('input[name="name"]', testTestimonial.name);
    await page.fill('input[name="role"]', testTestimonial.role);
    await page.fill('input[name="company"]', testTestimonial.company);
    await page.fill('textarea[name="content"]', testTestimonial.content);
    await page.fill('input[name="rating"]', testTestimonial.rating.toString());
    
    // Mark as featured and published
    const featuredSwitch = page.locator('label:has-text("Featured")').locator('button[role="switch"]');
    const publishedSwitch = page.locator('label:has-text("Published")').locator('button[role="switch"]');
    
    // Click switches if they're not already on
    const featuredState = await featuredSwitch.getAttribute('data-state');
    if (featuredState === 'unchecked') {
      await featuredSwitch.click();
    }
    
    const publishedState = await publishedSwitch.getAttribute('data-state');
    if (publishedState === 'unchecked') {
      await publishedSwitch.click();
    }
    
    // Save the testimonial
    await page.click('button:has-text("Add Testimonial"):not([disabled])');
    
    // Wait for dialog to close and data to save
    await page.waitForTimeout(2000);
    
    // Navigate to homepage
    await page.goto('/');
    
    // Scroll to testimonials section
    await page.locator('text=What Our Clients Say').scrollIntoViewIfNeeded();
    
    // Check if the testimonial appears
    await expect(page.locator(`text=${testTestimonial.content}`)).toBeVisible();
    await expect(page.locator(`text=${testTestimonial.name}`)).toBeVisible();
    await expect(page.locator(`text=${testTestimonial.role}`)).toBeVisible();
  });

  test('Admin updates blog and changes reflect on public site', async ({ page }) => {
    // First create a blog
    await page.goto('/admin/blogs/new');
    
    const originalTitle = `Original Blog ${uniqueId}`;
    const updatedTitle = `Updated Blog ${uniqueId}`;
    const blogSlug = `update-test-${uniqueId}`;
    
    // Create initial blog
    await page.fill('input[name="title"]', originalTitle);
    await page.fill('input[name="slug"]', blogSlug);
    await page.fill('textarea[name="excerpt"]', 'Original excerpt');
    await page.fill('textarea[name="content"]', 'Original content here');
    await page.selectOption('select[name="status"]', 'PUBLISHED');
    await page.click('button:has-text("Create Blog")');
    
    await page.waitForTimeout(2000);
    
    // Navigate back to blogs list
    await page.goto('/admin/blogs');
    
    // Find and edit the blog
    const blogRow = page.locator('tr', { hasText: originalTitle });
    await blogRow.locator('button:has-text("Edit")').click();
    
    // Update the title
    await page.fill('input[name="title"]', updatedTitle);
    await page.fill('textarea[name="content"]', 'Updated content here with more details');
    
    // Save changes
    await page.click('button:has-text("Update Blog")');
    
    await page.waitForTimeout(2000);
    
    // Check public site for updated content
    await page.goto('/blogs');
    
    // Updated title should be visible
    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible();
    
    // Original title should not be visible
    await expect(page.locator(`text=${originalTitle}`)).not.toBeVisible();
  });

  test('Admin deletes blog and it disappears from public site', async ({ page }) => {
    // Create a blog to delete
    await page.goto('/admin/blogs/new');
    
    const deleteTitle = `Delete Test Blog ${uniqueId}`;
    const deleteSlug = `delete-test-${uniqueId}`;
    
    await page.fill('input[name="title"]', deleteTitle);
    await page.fill('input[name="slug"]', deleteSlug);
    await page.fill('textarea[name="excerpt"]', 'This blog will be deleted');
    await page.fill('textarea[name="content"]', 'Content to be deleted');
    await page.selectOption('select[name="status"]', 'PUBLISHED');
    await page.click('button:has-text("Create Blog")');
    
    await page.waitForTimeout(2000);
    
    // Verify it appears on public site
    await page.goto('/blogs');
    await expect(page.locator(`text=${deleteTitle}`)).toBeVisible();
    
    // Go back to admin and delete it
    await page.goto('/admin/blogs');
    
    const blogRow = page.locator('tr', { hasText: deleteTitle });
    await blogRow.locator('button:has-text("Delete")').click();
    
    // Confirm deletion in dialog
    await page.click('button:has-text("Delete"):not([disabled])');
    
    await page.waitForTimeout(2000);
    
    // Check public site - blog should be gone
    await page.goto('/blogs');
    await expect(page.locator(`text=${deleteTitle}`)).not.toBeVisible();
  });

  test('Draft blogs do not appear on public site', async ({ page }) => {
    // Create a draft blog
    await page.goto('/admin/blogs/new');
    
    const draftTitle = `Draft Blog ${uniqueId}`;
    const draftSlug = `draft-blog-${uniqueId}`;
    
    await page.fill('input[name="title"]', draftTitle);
    await page.fill('input[name="slug"]', draftSlug);
    await page.fill('textarea[name="excerpt"]', 'This is a draft');
    await page.fill('textarea[name="content"]', 'Draft content');
    await page.selectOption('select[name="status"]', 'DRAFT');
    await page.click('button:has-text("Create Blog")');
    
    await page.waitForTimeout(2000);
    
    // Check public site - draft should not be visible
    await page.goto('/blogs');
    await expect(page.locator(`text=${draftTitle}`)).not.toBeVisible();
    
    // Go back and publish it
    await page.goto('/admin/blogs');
    
    const blogRow = page.locator('tr', { hasText: draftTitle });
    await blogRow.locator('button:has-text("Edit")').click();
    
    await page.selectOption('select[name="status"]', 'PUBLISHED');
    await page.click('button:has-text("Update Blog")');
    
    await page.waitForTimeout(2000);
    
    // Now it should appear on public site
    await page.goto('/blogs');
    await expect(page.locator(`text=${draftTitle}`)).toBeVisible();
  });

  test('Public API endpoints return correct data', async ({ page, request }) => {
    // Create a blog first
    await page.goto('/admin/blogs/new');
    
    const apiTestTitle = `API Test Blog ${uniqueId}`;
    const apiTestSlug = `api-test-${uniqueId}`;
    
    await page.fill('input[name="title"]', apiTestTitle);
    await page.fill('input[name="slug"]', apiTestSlug);
    await page.fill('textarea[name="excerpt"]', 'API test excerpt');
    await page.fill('textarea[name="content"]', 'API test content');
    await page.selectOption('select[name="status"]', 'PUBLISHED');
    await page.click('button:has-text("Create Blog")');
    
    await page.waitForTimeout(2000);
    
    // Test public blogs API
    const blogsResponse = await request.get('/api/public/blogs');
    expect(blogsResponse.ok()).toBeTruthy();
    
    const blogsData = await blogsResponse.json();
    expect(blogsData.success).toBe(true);
    expect(Array.isArray(blogsData.data)).toBe(true);
    
    // Check if our blog is in the response
    const ourBlog = blogsData.data.find((blog: any) => blog.title === apiTestTitle);
    expect(ourBlog).toBeDefined();
    expect(ourBlog.slug).toBe(apiTestSlug);
    
    // Test individual blog API
    const blogResponse = await request.get(`/api/public/blogs/${apiTestSlug}`);
    expect(blogResponse.ok()).toBeTruthy();
    
    const blogData = await blogResponse.json();
    expect(blogData.success).toBe(true);
    expect(blogData.data.title).toBe(apiTestTitle);
    expect(blogData.data.slug).toBe(apiTestSlug);
    
    // Test testimonials API
    const testimonialsResponse = await request.get('/api/public/testimonials');
    expect(testimonialsResponse.ok()).toBeTruthy();
    
    const testimonialsData = await testimonialsResponse.json();
    expect(testimonialsData.success).toBe(true);
    expect(Array.isArray(testimonialsData.data)).toBe(true);
  });
});