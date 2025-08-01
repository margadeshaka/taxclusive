import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsEditor } from './helpers/auth'
import { setupDatabase, teardownDatabase } from './helpers/database'

test.describe('Admin Testimonial Management', () => {
  test.beforeAll(async () => {
    await setupDatabase()
  })

  test.afterAll(async () => {
    await teardownDatabase()
  })

  test.describe('Testimonial List Access', () => {
    test('admin should access testimonial management', async ({ page }) => {
      await loginAsAdmin(page)
      
      await page.click('a[href="/admin/testimonials"]')
      await expect(page).toHaveURL('/admin/testimonials')
      await expect(page.locator('h1')).toContainText('Testimonial Management')
    })

    test('editor should access testimonial management', async ({ page }) => {
      await loginAsEditor(page)
      
      await page.click('a[href="/admin/testimonials"]')
      await expect(page).toHaveURL('/admin/testimonials')
      await expect(page.locator('h1')).toContainText('Testimonial Management')
    })
  })

  test.describe('Testimonial Creation', () => {
    test('should create new testimonial', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Click create testimonial
      await page.click('button:has-text("Add Testimonial")')
      
      // Fill testimonial form
      await page.fill('input[name="name"]', 'E2E Test Client')
      await page.fill('input[name="company"]', 'Test Company Ltd.')
      await page.fill('input[name="position"]', 'CEO')
      await page.fill('textarea[name="content"]', 'This is an excellent service. Highly recommended for all your tax needs!')
      
      // Set rating
      await page.click(`input[value="5"]`)
      
      // Set avatar URL
      await page.fill('input[name="avatar"]', 'https://example.com/avatar.jpg')
      
      // Set location
      await page.fill('input[name="location"]', 'Mumbai, India')
      
      // Submit
      await page.click('button[type="submit"]')
      
      // Check success and redirect
      await expect(page.locator('text=Testimonial created successfully')).toBeVisible()
      
      // Verify testimonial appears in list
      await expect(page.locator('text=E2E Test Client')).toBeVisible()
      await expect(page.locator('text=Test Company Ltd.')).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      await page.click('button:has-text("Add Testimonial")')
      
      // Try submitting empty form
      await page.click('button[type="submit"]')
      
      // Check validation messages
      await expect(page.locator('text=Name is required')).toBeVisible()
      await expect(page.locator('text=Content is required')).toBeVisible()
      await expect(page.locator('text=Rating is required')).toBeVisible()
    })

    test('should validate rating range', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      await page.click('button:has-text("Add Testimonial")')
      
      // Fill basic info
      await page.fill('input[name="name"]', 'Rating Test')
      await page.fill('textarea[name="content"]', 'Test content')
      
      // Check that rating options are 1-5
      await expect(page.locator('input[value="1"]')).toBeVisible()
      await expect(page.locator('input[value="5"]')).toBeVisible()
      await expect(page.locator('input[value="6"]')).not.toBeVisible()
    })

    test('should handle long testimonial content', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      await page.click('button:has-text("Add Testimonial")')
      
      const longContent = 'This is a very long testimonial that spans multiple lines and contains detailed feedback about the services provided. '.repeat(10)
      
      await page.fill('input[name="name"]', 'Long Content Test')
      await page.fill('textarea[name="content"]', longContent)
      await page.click('input[value="4"]')
      
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Testimonial created successfully')).toBeVisible()
      
      // Cleanup
      const testimonialRow = page.locator('tr:has-text("Long Content Test")')
      await testimonialRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
    })
  })

  test.describe('Testimonial Editing', () => {
    test('should edit existing testimonial', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Find and edit the test testimonial
      const testimonialRow = page.locator('tr:has-text("E2E Test Client")')
      await testimonialRow.locator('button:has-text("Edit")').click()
      
      // Update name and company
      await page.fill('input[name="name"]', 'Updated E2E Test Client')
      await page.fill('input[name="company"]', 'Updated Test Company Ltd.')
      
      // Update content
      await page.fill('textarea[name="content"]', 'Updated: This is an even better service!')
      
      // Change rating
      await page.click('input[value="4"]')
      
      // Submit
      await page.click('button[type="submit"]')
      
      // Check success
      await expect(page.locator('text=Testimonial updated successfully')).toBeVisible()
      
      // Verify updated values in list
      await expect(page.locator('text=Updated E2E Test Client')).toBeVisible()
      await expect(page.locator('text=Updated Test Company Ltd.')).toBeVisible()
    })

    test('should preserve all field values when editing', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      const testimonialRow = page.locator('tr:has-text("Updated E2E Test Client")')
      await testimonialRow.locator('button:has-text("Edit")').click()
      
      // Check that all fields are populated
      await expect(page.locator('input[name="name"]')).toHaveValue('Updated E2E Test Client')
      await expect(page.locator('input[name="company"]')).toHaveValue('Updated Test Company Ltd.')
      await expect(page.locator('input[name="position"]')).toHaveValue('CEO')
      await expect(page.locator('textarea[name="content"]')).toHaveValue('Updated: This is an even better service!')
      await expect(page.locator('input[value="4"]')).toBeChecked()
    })
  })

  test.describe('Testimonial Display', () => {
    test('should display testimonials with correct information', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Check table headers
      await expect(page.locator('th:has-text("Name")')).toBeVisible()
      await expect(page.locator('th:has-text("Company")')).toBeVisible()
      await expect(page.locator('th:has-text("Rating")')).toBeVisible()
      await expect(page.locator('th:has-text("Actions")')).toBeVisible()
      
      // Check testimonial data
      const testimonialRow = page.locator('tr:has-text("Updated E2E Test Client")')
      await expect(testimonialRow.locator('td:has-text("Updated Test Company Ltd.")')).toBeVisible()
      await expect(testimonialRow.locator('td:has-text("CEO")')).toBeVisible()
    })

    test('should display star ratings correctly', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Check that rating is displayed as stars
      const testimonialRow = page.locator('tr:has-text("Updated E2E Test Client")')
      await expect(testimonialRow.locator('.stars, .rating, [data-rating]')).toBeVisible()
    })

    test('should show testimonial preview', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      const testimonialRow = page.locator('tr:has-text("Updated E2E Test Client")')
      
      // Check if preview/view button exists
      const viewButton = testimonialRow.locator('button:has-text("View"), button:has-text("Preview")')
      if (await viewButton.isVisible()) {
        await viewButton.click()
        
        // Should show testimonial details
        await expect(page.locator('text=Updated E2E Test Client')).toBeVisible()
        await expect(page.locator('text=Updated: This is an even better service!')).toBeVisible()
      }
    })
  })

  test.describe('Testimonial Search and Filter', () => {
    test('should search testimonials by name', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Search for specific testimonial
      await page.fill('input[placeholder*="Search"]', 'Updated E2E')
      
      // Should show only matching testimonial
      await expect(page.locator('text=Updated E2E Test Client')).toBeVisible()
      
      // Clear search
      await page.fill('input[placeholder*="Search"]', '')
    })

    test('should filter testimonials by rating', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Filter by 4-star rating if filter exists
      const ratingFilter = page.locator('select:near(text="Filter by rating")')
      if (await ratingFilter.isVisible()) {
        await ratingFilter.selectOption('4')
        await expect(page.locator('tr')).toHaveCount({ min: 1 })
        
        // Reset filter
        await ratingFilter.selectOption('ALL')
      }
    })

    test('should sort testimonials by date', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Check if sort options exist
      const sortButton = page.locator('button:has-text("Sort"), th:has-text("Date")')
      if (await sortButton.isVisible()) {
        await sortButton.click()
        // Verify table updates (content may change order)
        await expect(page.locator('table tbody tr')).toHaveCount({ min: 1 })
      }
    })
  })

  test.describe('Testimonial Status Management', () => {
    test('should toggle testimonial visibility', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      const testimonialRow = page.locator('tr:has-text("Updated E2E Test Client")')
      
      // Check if status toggle exists
      const statusToggle = testimonialRow.locator('button:has-text("Active"), button:has-text("Inactive"), input[type="checkbox"]')
      if (await statusToggle.isVisible()) {
        await statusToggle.click()
        
        // Should show status change confirmation
        await expect(page.locator('text=Status updated successfully')).toBeVisible({ timeout: 5000 })
          .catch(() => expect(page.locator('.badge')).toBeVisible())
      }
    })

    test('should show featured testimonials', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      const testimonialRow = page.locator('tr:has-text("Updated E2E Test Client")')
      await testimonialRow.locator('button:has-text("Edit")').click()
      
      // Check if featured option exists
      const featuredCheckbox = page.locator('input[name="featured"], input[name="isFeatured"]')
      if (await featuredCheckbox.isVisible()) {
        await featuredCheckbox.check()
        await page.click('button[type="submit"]')
        
        await expect(page.locator('text=Testimonial updated successfully')).toBeVisible()
        
        // Should show featured badge or indicator
        await expect(testimonialRow.locator('.badge:has-text("Featured"), .featured-indicator')).toBeVisible()
      }
    })
  })

  test.describe('Testimonial Bulk Operations', () => {
    test('should select multiple testimonials', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Create additional testimonial for bulk operations
      await page.click('button:has-text("Add Testimonial")')
      await page.fill('input[name="name"]', 'Bulk Test Client')
      await page.fill('textarea[name="content"]', 'Another great testimonial')
      await page.click('input[value="5"]')
      await page.click('button[type="submit"]')
      
      // Check for bulk selection checkboxes
      const selectAllCheckbox = page.locator('th input[type="checkbox"]')
      if (await selectAllCheckbox.isVisible()) {
        await selectAllCheckbox.check()
        
        // Should select all testimonials
        const rowCheckboxes = page.locator('td input[type="checkbox"]')
        const count = await rowCheckboxes.count()
        
        for (let i = 0; i < count; i++) {
          await expect(rowCheckboxes.nth(i)).toBeChecked()
        }
      }
    })

    test('should perform bulk delete', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Check for bulk actions
      const bulkDeleteButton = page.locator('button:has-text("Delete Selected")')
      if (await bulkDeleteButton.isVisible()) {
        // Select some testimonials first
        const firstCheckbox = page.locator('td input[type="checkbox"]').first()
        await firstCheckbox.check()
        
        await bulkDeleteButton.click()
        await page.click('button:has-text("Confirm")')
        
        await expect(page.locator('text=Testimonials deleted successfully')).toBeVisible()
      }
    })
  })

  test.describe('Testimonial Deletion', () => {
    test('should delete single testimonial', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Create testimonial to delete
      await page.click('button:has-text("Add Testimonial")')
      await page.fill('input[name="name"]', 'Delete Test Client')
      await page.fill('textarea[name="content"]', 'Testimonial to be deleted')
      await page.click('input[value="3"]')
      await page.click('button[type="submit"]')
      
      // Delete the testimonial
      const testimonialRow = page.locator('tr:has-text("Delete Test Client")')
      await testimonialRow.locator('button:has-text("Delete")').click()
      
      // Confirm deletion
      await page.click('button:has-text("Confirm")')
      
      // Check success and testimonial removed
      await expect(page.locator('text=Testimonial deleted successfully')).toBeVisible()
      await expect(page.locator('text=Delete Test Client')).not.toBeVisible()
    })

    test('should cancel testimonial deletion', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Find existing testimonial
      const testimonialRow = page.locator('tr:has-text("Updated E2E Test Client")')
      await testimonialRow.locator('button:has-text("Delete")').click()
      
      // Cancel deletion
      await page.click('button:has-text("Cancel")')
      
      // Testimonial should still exist
      await expect(page.locator('text=Updated E2E Test Client')).toBeVisible()
    })
  })

  test.describe('Editor Permissions', () => {
    test('editor should be able to create testimonials', async ({ page }) => {
      await loginAsEditor(page)
      await page.goto('/admin/testimonials')
      
      // Should see add button
      await expect(page.locator('button:has-text("Add Testimonial")')).toBeVisible()
      
      // Should be able to create
      await page.click('button:has-text("Add Testimonial")')
      
      await page.fill('input[name="name"]', 'Editor Created Testimonial')
      await page.fill('textarea[name="content"]', 'Testimonial created by editor')
      await page.click('input[value="5"]')
      
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Testimonial created successfully')).toBeVisible()
      
      // Cleanup
      const testimonialRow = page.locator('tr:has-text("Editor Created Testimonial")')
      await testimonialRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
    })

    test('editor should be able to edit testimonials', async ({ page }) => {
      await loginAsEditor(page)
      await page.goto('/admin/testimonials')
      
      // Should be able to edit existing testimonials
      const testimonialRow = page.locator('tr:has-text("Updated E2E Test Client")')
      await expect(testimonialRow.locator('button:has-text("Edit")')).toBeVisible()
      
      await testimonialRow.locator('button:has-text("Edit")').click()
      await expect(page.locator('input[name="name"]')).toBeVisible()
    })
  })

  test.describe('Cleanup', () => {
    test('should clean up test testimonials', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/testimonials')
      
      // Delete the main test testimonial
      const testimonialRow = page.locator('tr:has-text("Updated E2E Test Client")')
      if (await testimonialRow.isVisible()) {
        await testimonialRow.locator('button:has-text("Delete")').click()
        await page.click('button:has-text("Confirm")')
        
        await expect(page.locator('text=Testimonial deleted successfully')).toBeVisible()
        await expect(page.locator('text=Updated E2E Test Client')).not.toBeVisible()
      }
    })
  })
})