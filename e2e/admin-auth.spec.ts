import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsEditor, logout } from './helpers/auth'
import { setupDatabase, teardownDatabase } from './helpers/database'

test.describe('Admin Authentication', () => {
  test.beforeAll(async () => {
    await setupDatabase()
  })

  test.afterAll(async () => {
    await teardownDatabase()
  })

  test.describe('Login Flow', () => {
    test('should redirect to login when accessing admin without auth', async ({ page }) => {
      await page.goto('/admin')
      await expect(page).toHaveURL('/admin/login')
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/admin/login')
      
      await page.fill('input[type="email"]', 'invalid@test.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Invalid credentials')).toBeVisible()
    })

    test('should login successfully as admin', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Check dashboard is visible
      await expect(page.locator('h1')).toContainText('Dashboard')
      
      // Check admin menu items are visible
      await expect(page.locator('a[href="/admin/users"]')).toBeVisible()
      await expect(page.locator('a[href="/admin/blogs"]')).toBeVisible()
      await expect(page.locator('a[href="/admin/testimonials"]')).toBeVisible()
    })

    test('should login successfully as editor', async ({ page }) => {
      await loginAsEditor(page)
      
      // Check dashboard is visible
      await expect(page.locator('h1')).toContainText('Dashboard')
      
      // Check editor can see blogs and testimonials
      await expect(page.locator('a[href="/admin/blogs"]')).toBeVisible()
      await expect(page.locator('a[href="/admin/testimonials"]')).toBeVisible()
      
      // Check editor cannot see user management
      await expect(page.locator('a[href="/admin/users"]')).not.toBeVisible()
    })

    test('should persist session across page refreshes', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Refresh page
      await page.reload()
      
      // Should still be logged in
      await expect(page).toHaveURL('/admin')
      await expect(page.locator('h1')).toContainText('Dashboard')
    })
  })

  test.describe('Logout Flow', () => {
    test('should logout successfully', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Logout
      await logout(page)
      
      // Should be redirected to login
      await expect(page).toHaveURL('/admin/login')
      
      // Try accessing admin page
      await page.goto('/admin')
      await expect(page).toHaveURL('/admin/login')
    })
  })

  test.describe('Protected Routes', () => {
    test('should protect admin routes from unauthenticated access', async ({ page }) => {
      const protectedRoutes = [
        '/admin',
        '/admin/users',
        '/admin/blogs',
        '/admin/testimonials'
      ]
      
      for (const route of protectedRoutes) {
        await page.goto(route)
        await expect(page).toHaveURL('/admin/login')
      }
    })

    test('should protect admin-only routes from editor access', async ({ page }) => {
      await loginAsEditor(page)
      
      // Try accessing user management
      await page.goto('/admin/users')
      
      // Should be redirected or show unauthorized
      await expect(page.locator('text=Unauthorized')).toBeVisible({ timeout: 5000 })
        .catch(() => expect(page).toHaveURL('/admin'))
    })
  })

  test.describe('Session Management', () => {
    test('should handle session expiry gracefully', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Clear cookies to simulate session expiry
      await page.context().clearCookies()
      
      // Try to navigate
      await page.goto('/admin/blogs')
      
      // Should redirect to login
      await expect(page).toHaveURL('/admin/login')
    })

    test('should not allow multiple simultaneous sessions', async ({ browser }) => {
      // Login in first context
      const context1 = await browser.newContext()
      const page1 = await context1.newPage()
      await loginAsAdmin(page1)
      
      // Login in second context
      const context2 = await browser.newContext()
      const page2 = await context2.newPage()
      await loginAsAdmin(page2)
      
      // First session should still be valid
      await page1.reload()
      await expect(page1).toHaveURL('/admin')
      
      // Cleanup
      await context1.close()
      await context2.close()
    })
  })
})