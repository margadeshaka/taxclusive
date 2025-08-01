import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsEditor } from './helpers/auth'
import { setupDatabase, teardownDatabase } from './helpers/database'

test.describe('Admin Blog Management', () => {
  test.beforeAll(async () => {
    await setupDatabase()
  })

  test.afterAll(async () => {
    await teardownDatabase()
  })

  test.describe('Blog List Access', () => {
    test('admin should access blog management', async ({ page }) => {
      await loginAsAdmin(page)
      
      await page.click('a[href="/admin/blogs"]')
      await expect(page).toHaveURL('/admin/blogs')
      await expect(page.locator('h1')).toContainText('Blog Management')
    })

    test('editor should access blog management', async ({ page }) => {
      await loginAsEditor(page)
      
      await page.click('a[href="/admin/blogs"]')
      await expect(page).toHaveURL('/admin/blogs')
      await expect(page.locator('h1')).toContainText('Blog Management')
    })
  })

  test.describe('Blog Creation', () => {
    test('should create new blog post', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      // Click create blog
      await page.click('button:has-text("Create Blog")')
      await expect(page).toHaveURL('/admin/blogs/new')
      
      // Fill blog form
      await page.fill('input[name="title"]', 'E2E Test Blog Post')
      await page.fill('input[name="slug"]', 'e2e-test-blog-post')
      await page.fill('textarea[name="excerpt"]', 'This is a test blog post created during E2E testing.')
      
      // Use MDX editor
      const editor = page.locator('.mdx-editor')
      await editor.click()
      await editor.fill('# E2E Test Blog\n\nThis is the content of our test blog post.\n\n## Section 1\n\nSome content here.')
      
      // Set featured image URL
      await page.fill('input[name="featuredImage"]', 'https://example.com/test-image.jpg')
      
      // Set meta description
      await page.fill('textarea[name="metaDescription"]', 'Test blog post for E2E testing')
      
      // Select category
      await page.click('button[role="combobox"]:near(text="Category")')
      await page.click('text=Tax Planning')
      
      // Add tags
      await page.fill('input[placeholder*="tags"]', 'e2e,testing,blog')
      await page.press('input[placeholder*="tags"]', 'Enter')
      
      // Set status
      await page.click('button[role="combobox"]:near(text="Status")')
      await page.click('text=Published')
      
      // Submit
      await page.click('button[type="submit"]')
      
      // Check success and redirect
      await expect(page.locator('text=Blog created successfully')).toBeVisible()
      await expect(page).toHaveURL('/admin/blogs')
      
      // Verify blog appears in list
      await expect(page.locator('text=E2E Test Blog Post')).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs/new')
      
      // Try submitting empty form
      await page.click('button[type="submit"]')
      
      // Check validation messages
      await expect(page.locator('text=Title is required')).toBeVisible()
      await expect(page.locator('text=Slug is required')).toBeVisible()
      await expect(page.locator('text=Excerpt is required')).toBeVisible()
      await expect(page.locator('text=Content is required')).toBeVisible()
    })

    test('should auto-generate slug from title', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs/new')
      
      // Fill title
      await page.fill('input[name="title"]', 'Auto Generated Slug Test')
      
      // Click elsewhere to trigger slug generation
      await page.click('textarea[name="excerpt"]')
      
      // Check slug is generated
      const slugValue = await page.inputValue('input[name="slug"]')
      expect(slugValue).toBe('auto-generated-slug-test')
    })

    test('should prevent duplicate slugs', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs/new')
      
      // Try to create blog with existing slug
      await page.fill('input[name="title"]', 'Duplicate Slug Test')
      await page.fill('input[name="slug"]', 'e2e-test-blog-post')
      await page.fill('textarea[name="excerpt"]', 'Test excerpt')
      
      const editor = page.locator('.mdx-editor')
      await editor.click()
      await editor.fill('Test content')
      
      await page.click('button[type="submit"]')
      
      // Check error message
      await expect(page.locator('text=Slug already exists')).toBeVisible()
    })
  })

  test.describe('Blog Editing', () => {
    test('should edit existing blog post', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      // Find and edit the test blog
      const blogRow = page.locator('tr:has-text("E2E Test Blog Post")')
      await blogRow.locator('button:has-text("Edit")').click()
      
      // Update title
      await page.fill('input[name="title"]', 'Updated E2E Test Blog Post')
      
      // Update content
      const editor = page.locator('.mdx-editor')
      await editor.click()
      await editor.fill('# Updated E2E Test Blog\n\nThis content has been updated.')
      
      // Submit
      await page.click('button[type="submit"]')
      
      // Check success
      await expect(page.locator('text=Blog updated successfully')).toBeVisible()
      await expect(page).toHaveURL('/admin/blogs')
      
      // Verify updated title in list
      await expect(page.locator('text=Updated E2E Test Blog Post')).toBeVisible()
    })

    test('should preserve MDX content formatting', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      const blogRow = page.locator('tr:has-text("Updated E2E Test Blog Post")')
      await blogRow.locator('button:has-text("Edit")').click()
      
      // Check that MDX content is preserved
      const editorContent = await page.locator('.mdx-editor').textContent()
      expect(editorContent).toContain('Updated E2E Test Blog')
    })
  })

  test.describe('Blog Status Management', () => {
    test('should change blog status', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      const blogRow = page.locator('tr:has-text("Updated E2E Test Blog Post")')
      await blogRow.locator('button:has-text("Edit")').click()
      
      // Change status to draft
      await page.click('button[role="combobox"]:near(text="Status")')
      await page.click('text=Draft')
      
      await page.click('button[type="submit"]')
      
      // Verify status change in list
      await expect(page.locator('tr:has-text("Updated E2E Test Blog Post") .badge:has-text("DRAFT")')).toBeVisible()
    })

    test('should display status badges correctly', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      // Check status badges exist
      await expect(page.locator('.badge')).toBeVisible()
    })
  })

  test.describe('Blog Search and Filter', () => {
    test('should search blogs by title', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      // Search for test blog
      await page.fill('input[placeholder*="Search"]', 'Updated E2E')
      
      // Should show only matching blog
      await expect(page.locator('text=Updated E2E Test Blog Post')).toBeVisible()
      
      // Clear search
      await page.fill('input[placeholder*="Search"]', '')
    })

    test('should filter blogs by status', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      // Filter by draft status
      await page.selectOption('select:near(text="Filter by status")', 'DRAFT')
      
      // Should show only draft blogs
      await expect(page.locator('tr:has(.badge:has-text("DRAFT"))')).toBeVisible()
      
      // Reset filter
      await page.selectOption('select:near(text="Filter by status")', 'ALL')
    })

    test('should filter blogs by category', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      // Filter by category if dropdown exists
      const categoryFilter = page.locator('select:near(text="Filter by category")')
      if (await categoryFilter.isVisible()) {
        await categoryFilter.selectOption('Tax Planning')
        await expect(page.locator('tr')).toHaveCount({ min: 1 })
      }
    })
  })

  test.describe('Blog Preview and Publishing', () => {
    test('should preview blog before publishing', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      const blogRow = page.locator('tr:has-text("Updated E2E Test Blog Post")')
      
      // Check if preview button exists
      const previewButton = blogRow.locator('button:has-text("Preview")')
      if (await previewButton.isVisible()) {
        await previewButton.click()
        
        // Should open preview in new tab/window
        const [previewPage] = await Promise.all([
          page.waitForEvent('popup'),
          previewButton.click()
        ])
        
        // Check preview content
        await expect(previewPage.locator('h1')).toContainText('Updated E2E Test Blog Post')
        await previewPage.close()
      }
    })

    test('should publish blog from draft', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      const blogRow = page.locator('tr:has-text("Updated E2E Test Blog Post")')
      await blogRow.locator('button:has-text("Edit")').click()
      
      // Change to published
      await page.click('button[role="combobox"]:near(text="Status")')
      await page.click('text=Published')
      
      await page.click('button[type="submit"]')
      
      // Verify published status
      await expect(page.locator('tr:has-text("Updated E2E Test Blog Post") .badge:has-text("PUBLISHED")')).toBeVisible()
    })
  })

  test.describe('Blog Deletion', () => {
    test('should delete blog post', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      const blogRow = page.locator('tr:has-text("Updated E2E Test Blog Post")')
      await blogRow.locator('button:has-text("Delete")').click()
      
      // Confirm deletion
      await page.click('button:has-text("Confirm")')
      
      // Check success and blog removed
      await expect(page.locator('text=Blog deleted successfully')).toBeVisible()
      await expect(page.locator('text=Updated E2E Test Blog Post')).not.toBeVisible()
    })

    test('should prevent deletion without confirmation', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/blogs')
      
      // Create a blog to test deletion
      await page.click('button:has-text("Create Blog")')
      await page.fill('input[name="title"]', 'Blog to Delete')
      await page.fill('input[name="slug"]', 'blog-to-delete')
      await page.fill('textarea[name="excerpt"]', 'Test')
      
      const editor = page.locator('.mdx-editor')
      await editor.click()
      await editor.fill('Test content')
      
      await page.click('button[type="submit"]')
      
      // Try to delete but cancel
      const blogRow = page.locator('tr:has-text("Blog to Delete")')
      await blogRow.locator('button:has-text("Delete")').click()
      
      // Cancel deletion
      await page.click('button:has-text("Cancel")')
      
      // Blog should still exist
      await expect(page.locator('text=Blog to Delete')).toBeVisible()
      
      // Actually delete for cleanup
      await blogRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
    })
  })

  test.describe('Editor Permissions', () => {
    test('editor should be able to create blogs', async ({ page }) => {
      await loginAsEditor(page)
      await page.goto('/admin/blogs')
      
      // Should see create button
      await expect(page.locator('button:has-text("Create Blog")')).toBeVisible()
      
      // Should be able to create
      await page.click('button:has-text("Create Blog")')
      await expect(page).toHaveURL('/admin/blogs/new')
    })

    test('editor should be able to edit own blogs', async ({ page }) => {
      await loginAsEditor(page)
      await page.goto('/admin/blogs/new')
      
      // Create blog as editor
      await page.fill('input[name="title"]', 'Editor Created Blog')
      await page.fill('input[name="slug"]', 'editor-created-blog')
      await page.fill('textarea[name="excerpt"]', 'Blog created by editor')
      
      const editor = page.locator('.mdx-editor')
      await editor.click()
      await editor.fill('Content by editor')
      
      await page.click('button[type="submit"]')
      
      // Should be able to edit
      const blogRow = page.locator('tr:has-text("Editor Created Blog")')
      await blogRow.locator('button:has-text("Edit")').click()
      
      await page.fill('input[name="title"]', 'Updated by Editor')
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Blog updated successfully')).toBeVisible()
      
      // Cleanup
      const updatedRow = page.locator('tr:has-text("Updated by Editor")')
      await updatedRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
    })
  })
})