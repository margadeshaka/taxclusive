import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsEditor } from './helpers/auth'
import { setupDatabase, teardownDatabase } from './helpers/database'

test.describe('Admin User Management', () => {
  test.beforeAll(async () => {
    await setupDatabase()
  })

  test.afterAll(async () => {
    await teardownDatabase()
  })

  test.describe('User List Access', () => {
    test('admin should access user management', async ({ page }) => {
      await loginAsAdmin(page)
      
      await page.click('a[href="/admin/users"]')
      await expect(page).toHaveURL('/admin/users')
      await expect(page.locator('h1')).toContainText('User Management')
    })

    test('editor should not access user management', async ({ page }) => {
      await loginAsEditor(page)
      
      // Try direct navigation
      await page.goto('/admin/users')
      
      // Should show unauthorized or redirect
      await expect(page.locator('text=Unauthorized')).toBeVisible({ timeout: 5000 })
        .catch(() => expect(page).toHaveURL('/admin'))
    })
  })

  test.describe('User CRUD Operations', () => {
    test('should display existing users', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Check user table exists
      await expect(page.locator('table')).toBeVisible()
      await expect(page.locator('th:has-text("Name")')).toBeVisible()
      await expect(page.locator('th:has-text("Email")')).toBeVisible()
      await expect(page.locator('th:has-text("Role")')).toBeVisible()
      
      // Check existing test users
      await expect(page.locator('text=admin@taxclusive.com')).toBeVisible()
      await expect(page.locator('text=editor@taxclusive.com')).toBeVisible()
    })

    test('should create new user', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Click add user button
      await page.click('button:has-text("Add User")')
      
      // Fill form
      await page.fill('input[name="name"]', 'E2E Test User')
      await page.fill('input[name="email"]', 'e2etest@test.com')
      await page.fill('input[name="password"]', 'testpass123')
      
      // Select role
      await page.click('button[role="combobox"]')
      await page.click('text=EDITOR')
      
      // Submit
      await page.click('button[type="submit"]')
      
      // Check success and user appears in list
      await expect(page.locator('text=User created successfully')).toBeVisible()
      await expect(page.locator('text=e2etest@test.com')).toBeVisible()
    })

    test('should validate user creation form', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      await page.click('button:has-text("Add User")')
      
      // Try submitting empty form
      await page.click('button[type="submit"]')
      
      // Check validation messages
      await expect(page.locator('text=Name is required')).toBeVisible()
      await expect(page.locator('text=Email is required')).toBeVisible()
      await expect(page.locator('text=Password is required')).toBeVisible()
    })

    test('should edit existing user', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Find user row and click edit
      const userRow = page.locator('tr:has-text("e2etest@test.com")')
      await userRow.locator('button:has-text("Edit")').click()
      
      // Update name
      await page.fill('input[name="name"]', 'Updated E2E User')
      
      // Submit
      await page.click('button[type="submit"]')
      
      // Check success and updated name
      await expect(page.locator('text=User updated successfully')).toBeVisible()
      await expect(page.locator('text=Updated E2E User')).toBeVisible()
    })

    test('should delete user', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Find user row and click delete
      const userRow = page.locator('tr:has-text("e2etest@test.com")')
      await userRow.locator('button:has-text("Delete")').click()
      
      // Confirm deletion
      await page.click('button:has-text("Confirm")')
      
      // Check success and user removed
      await expect(page.locator('text=User deleted successfully')).toBeVisible()
      await expect(page.locator('text=e2etest@test.com')).not.toBeVisible()
    })

    test('should prevent duplicate email addresses', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      await page.click('button:has-text("Add User")')
      
      // Try to create user with existing email
      await page.fill('input[name="name"]', 'Duplicate User')
      await page.fill('input[name="email"]', 'admin@taxclusive.com')
      await page.fill('input[name="password"]', 'password123')
      
      await page.click('button[role="combobox"]')
      await page.click('text=EDITOR')
      
      await page.click('button[type="submit"]')
      
      // Check error message
      await expect(page.locator('text=Email already exists')).toBeVisible()
    })
  })

  test.describe('Role Management', () => {
    test('should change user role', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Create test user first
      await page.click('button:has-text("Add User")')
      await page.fill('input[name="name"]', 'Role Test User')
      await page.fill('input[name="email"]', 'roletest@test.com')
      await page.fill('input[name="password"]', 'password123')
      
      await page.click('button[role="combobox"]')
      await page.click('text=EDITOR')
      await page.click('button[type="submit"]')
      
      // Edit the user to change role
      const userRow = page.locator('tr:has-text("roletest@test.com")')
      await userRow.locator('button:has-text("Edit")').click()
      
      await page.click('button[role="combobox"]')
      await page.click('text=ADMIN')
      await page.click('button[type="submit"]')
      
      // Verify role change
      await expect(page.locator('tr:has-text("roletest@test.com") td:has-text("ADMIN")')).toBeVisible()
      
      // Cleanup
      await userRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
    })

    test('should display role badges correctly', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Check admin badge
      await expect(page.locator('tr:has-text("admin@taxclusive.com") .badge:has-text("ADMIN")')).toBeVisible()
      
      // Check editor badge
      await expect(page.locator('tr:has-text("editor@taxclusive.com") .badge:has-text("EDITOR")')).toBeVisible()
    })
  })

  test.describe('User Search and Filter', () => {
    test('should search users by name', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Search for admin user
      await page.fill('input[placeholder*="Search"]', 'Admin')
      
      // Should show only admin user
      await expect(page.locator('text=admin@taxclusive.com')).toBeVisible()
      await expect(page.locator('text=editor@taxclusive.com')).not.toBeVisible()
      
      // Clear search
      await page.fill('input[placeholder*="Search"]', '')
      
      // Should show all users again
      await expect(page.locator('text=editor@taxclusive.com')).toBeVisible()
    })

    test('should filter users by role', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Filter by ADMIN role
      await page.selectOption('select:near(text="Filter by role")', 'ADMIN')
      
      // Should show only admin users
      await expect(page.locator('tr:has(.badge:has-text("ADMIN"))')).toBeVisible()
      await expect(page.locator('tr:has(.badge:has-text("EDITOR"))')).not.toBeVisible()
      
      // Reset filter
      await page.selectOption('select:near(text="Filter by role")', 'ALL')
      
      // Should show all users
      await expect(page.locator('tr:has(.badge:has-text("EDITOR"))')).toBeVisible()
    })
  })

  test.describe('Password Management', () => {
    test('should validate password strength', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      await page.click('button:has-text("Add User")')
      
      // Try weak password
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'testuser@test.com')
      await page.fill('input[name="password"]', '123')
      
      await page.click('button[type="submit"]')
      
      // Check password validation
      await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible()
    })

    test('should allow password reset for existing users', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Create test user first
      await page.click('button:has-text("Add User")')
      await page.fill('input[name="name"]', 'Password Test User')
      await page.fill('input[name="email"]', 'passwordtest@test.com')
      await page.fill('input[name="password"]', 'oldpassword123')
      
      await page.click('button[role="combobox"]')
      await page.click('text=EDITOR')
      await page.click('button[type="submit"]')
      
      // Edit user to change password
      const userRow = page.locator('tr:has-text("passwordtest@test.com")')
      await userRow.locator('button:has-text("Edit")').click()
      
      // Update password
      await page.fill('input[name="password"]', 'newpassword123')
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=User updated successfully')).toBeVisible()
      
      // Cleanup
      await userRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
    })
  })
})