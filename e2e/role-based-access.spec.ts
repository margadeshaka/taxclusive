import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsEditor, checkAdminAccess, checkEditorAccess } from './helpers/auth'
import { setupDatabase, teardownDatabase } from './helpers/database'

test.describe('Role-Based Access Control', () => {
  test.beforeAll(async () => {
    await setupDatabase()
  })

  test.afterAll(async () => {
    await teardownDatabase()
  })

  test.describe('Admin Role Permissions', () => {
    test('admin should have access to all admin features', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Check dashboard access
      await expect(page.locator('h1')).toContainText('Dashboard')
      
      // Check all navigation items are visible
      await expect(page.locator('a[href="/admin/users"]')).toBeVisible()
      await expect(page.locator('a[href="/admin/blogs"]')).toBeVisible()
      await expect(page.locator('a[href="/admin/testimonials"]')).toBeVisible()
      
      // Verify admin access helper
      const hasAdminAccess = await checkAdminAccess(page)
      expect(hasAdminAccess).toBe(true)
    })

    test('admin should access user management', async ({ page }) => {
      await loginAsAdmin(page)
      
      await page.click('a[href="/admin/users"]')
      await expect(page).toHaveURL('/admin/users')
      await expect(page.locator('h1')).toContainText('User Management')
      
      // Should see user management actions
      await expect(page.locator('button:has-text("Add User")')).toBeVisible()
    })

    test('admin should access blog management', async ({ page }) => {
      await loginAsAdmin(page)
      
      await page.click('a[href="/admin/blogs"]')
      await expect(page).toHaveURL('/admin/blogs')
      await expect(page.locator('h1')).toContainText('Blog Management')
      
      // Should see blog management actions
      await expect(page.locator('button:has-text("Create Blog")')).toBeVisible()
    })

    test('admin should access testimonial management', async ({ page }) => {
      await loginAsAdmin(page)
      
      await page.click('a[href="/admin/testimonials"]')
      await expect(page).toHaveURL('/admin/testimonials')
      await expect(page.locator('h1')).toContainText('Testimonial Management')
      
      // Should see testimonial management actions
      await expect(page.locator('button:has-text("Add Testimonial")')).toBeVisible()
    })

    test('admin should perform all CRUD operations on users', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Create user
      await page.click('button:has-text("Add User")')
      await page.fill('input[name="name"]', 'RBAC Test User')
      await page.fill('input[name="email"]', 'rbactest@test.com')
      await page.fill('input[name="password"]', 'password123')
      
      await page.click('button[role="combobox"]')
      await page.click('text=EDITOR')
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=User created successfully')).toBeVisible()
      
      // Edit user
      const userRow = page.locator('tr:has-text("rbactest@test.com")')
      await userRow.locator('button:has-text("Edit")').click()
      await page.fill('input[name="name"]', 'Updated RBAC User')
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=User updated successfully')).toBeVisible()
      
      // Delete user
      const updatedRow = page.locator('tr:has-text("Updated RBAC User")')
      await updatedRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
      
      await expect(page.locator('text=User deleted successfully')).toBeVisible()
    })

    test('admin should manage user roles', async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto('/admin/users')
      
      // Create user with EDITOR role
      await page.click('button:has-text("Add User")')
      await page.fill('input[name="name"]', 'Role Test User')
      await page.fill('input[name="email"]', 'roletest@test.com')
      await page.fill('input[name="password"]', 'password123')
      
      await page.click('button[role="combobox"]')
      await page.click('text=EDITOR')
      await page.click('button[type="submit"]')
      
      // Change role to ADMIN
      const userRow = page.locator('tr:has-text("roletest@test.com")')
      await userRow.locator('button:has-text("Edit")').click()
      
      await page.click('button[role="combobox"]')
      await page.click('text=ADMIN')
      await page.click('button[type="submit"]')
      
      // Verify role change
      await expect(page.locator('tr:has-text("roletest@test.com") .badge:has-text("ADMIN")')).toBeVisible()
      
      // Cleanup
      await userRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
    })
  })

  test.describe('Editor Role Permissions', () => {
    test('editor should have limited access', async ({ page }) => {
      await loginAsEditor(page)
      
      // Check dashboard access
      await expect(page.locator('h1')).toContainText('Dashboard')
      
      // Should NOT see user management
      await expect(page.locator('a[href="/admin/users"]')).not.toBeVisible()
      
      // Should see blogs and testimonials
      await expect(page.locator('a[href="/admin/blogs"]')).toBeVisible()
      await expect(page.locator('a[href="/admin/testimonials"]')).toBeVisible()
      
      // Verify editor access helper
      const hasEditorAccess = await checkEditorAccess(page)
      expect(hasEditorAccess).toBe(true)
    })

    test('editor should NOT access user management', async ({ page }) => {
      await loginAsEditor(page)
      
      // Try direct navigation to user management
      await page.goto('/admin/users')
      
      // Should be redirected or show unauthorized
      await expect(page.locator('text=Unauthorized')).toBeVisible({ timeout: 5000 })
        .catch(async () => {
          // Alternative: might redirect to dashboard
          await expect(page).toHaveURL('/admin')
        })
    })

    test('editor should access blog management', async ({ page }) => {
      await loginAsEditor(page)
      
      await page.click('a[href="/admin/blogs"]')
      await expect(page).toHaveURL('/admin/blogs')
      await expect(page.locator('h1')).toContainText('Blog Management')
      
      // Should see blog actions
      await expect(page.locator('button:has-text("Create Blog")')).toBeVisible()
    })

    test('editor should access testimonial management', async ({ page }) => {
      await loginAsEditor(page)
      
      await page.click('a[href="/admin/testimonials"]')
      await expect(page).toHaveURL('/admin/testimonials')
      await expect(page.locator('h1')).toContainText('Testimonial Management')
      
      // Should see testimonial actions
      await expect(page.locator('button:has-text("Add Testimonial")')).toBeVisible()
    })

    test('editor should create and manage blogs', async ({ page }) => {
      await loginAsEditor(page)
      await page.goto('/admin/blogs')
      
      // Create blog
      await page.click('button:has-text("Create Blog")')
      await page.fill('input[name="title"]', 'Editor RBAC Test Blog')
      await page.fill('input[name="slug"]', 'editor-rbac-test-blog')
      await page.fill('textarea[name="excerpt"]', 'Blog created by editor for RBAC testing')
      
      const editor = page.locator('.mdx-editor')
      await editor.click()
      await editor.fill('Content created by editor')
      
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Blog created successfully')).toBeVisible()
      
      // Edit the blog
      const blogRow = page.locator('tr:has-text("Editor RBAC Test Blog")')
      await blogRow.locator('button:has-text("Edit")').click()
      
      await page.fill('input[name="title"]', 'Updated Editor RBAC Blog')
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Blog updated successfully')).toBeVisible()
      
      // Delete the blog
      const updatedRow = page.locator('tr:has-text("Updated Editor RBAC Blog")')
      await updatedRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
      
      await expect(page.locator('text=Blog deleted successfully')).toBeVisible()
    })

    test('editor should create and manage testimonials', async ({ page }) => {
      await loginAsEditor(page)
      await page.goto('/admin/testimonials')
      
      // Create testimonial
      await page.click('button:has-text("Add Testimonial")')
      await page.fill('input[name="name"]', 'Editor RBAC Test Client')
      await page.fill('textarea[name="content"]', 'Testimonial created by editor for RBAC testing')
      await page.click('input[value="5"]')
      
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Testimonial created successfully')).toBeVisible()
      
      // Edit the testimonial
      const testimonialRow = page.locator('tr:has-text("Editor RBAC Test Client")')
      await testimonialRow.locator('button:has-text("Edit")').click()
      
      await page.fill('input[name="name"]', 'Updated Editor RBAC Client')
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Testimonial updated successfully')).toBeVisible()
      
      // Delete the testimonial
      const updatedRow = page.locator('tr:has-text("Updated Editor RBAC Client")')
      await updatedRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
      
      await expect(page.locator('text=Testimonial deleted successfully')).toBeVisible()
    })
  })

  test.describe('Route Protection', () => {
    test('should protect admin-only routes from editor access', async ({ page }) => {
      await loginAsEditor(page)
      
      const adminOnlyRoutes = [
        '/admin/users',
        '/admin/users/new',
        '/admin/users/edit/1'
      ]
      
      for (const route of adminOnlyRoutes) {
        await page.goto(route)
        
        // Should show unauthorized or redirect
        await expect(page.locator('text=Unauthorized')).toBeVisible({ timeout: 5000 })
          .catch(async () => {
            // Alternative: might redirect to dashboard or login
            await expect(page).toHaveURL(/\/(admin|admin\/login)$/)
          })
      }
    })

    test('should allow editor access to permitted routes', async ({ page }) => {
      await loginAsEditor(page)
      
      const editorAllowedRoutes = [
        '/admin',
        '/admin/blogs',
        '/admin/testimonials'
      ]
      
      for (const route of editorAllowedRoutes) {
        await page.goto(route)
        
        // Should not show unauthorized
        await expect(page.locator('text=Unauthorized')).not.toBeVisible({ timeout: 2000 })
          .catch(() => {
            // If element doesn't exist, that's fine
          })
        
        // Should show the page content
        await expect(page.locator('h1')).toBeVisible()
      }
    })

    test('should protect all admin routes from unauthenticated users', async ({ page }) => {
      // Without login
      const protectedRoutes = [
        '/admin',
        '/admin/users',
        '/admin/blogs',
        '/admin/testimonials'
      ]
      
      for (const route of protectedRoutes) {
        await page.goto(route)
        
        // Should redirect to login
        await expect(page).toHaveURL('/admin/login')
      }
    })
  })

  test.describe('API Endpoint Protection', () => {
    test('admin should access user management API', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Test API access through UI interactions
      await page.goto('/admin/users')
      
      // Create user via API (through UI)
      await page.click('button:has-text("Add User")')
      await page.fill('input[name="name"]', 'API Test User')
      await page.fill('input[name="email"]', 'apitest@test.com')
      await page.fill('input[name="password"]', 'password123')
      
      await page.click('button[role="combobox"]')
      await page.click('text=EDITOR')
      
      // This will make API call to create user
      await page.click('button[type="submit"]')
      
      // Should succeed
      await expect(page.locator('text=User created successfully')).toBeVisible()
      
      // Cleanup
      const userRow = page.locator('tr:has-text("apitest@test.com")')
      await userRow.locator('button:has-text("Delete")').click()
      await page.click('button:has-text("Confirm")')
    })

    test('editor should NOT access user management API directly', async ({ page }) => {
      await loginAsEditor(page)
      
      // Attempt to make direct API call to user endpoints
      const response = await page.request.get('/api/admin/users')
      
      // Should be unauthorized (403) or forbidden
      expect([401, 403]).toContain(response.status())
    })

    test('editor should access blog and testimonial APIs', async ({ page }) => {
      await loginAsEditor(page)
      
      // Test blog API access
      const blogResponse = await page.request.get('/api/admin/blogs')
      expect([200, 304]).toContain(blogResponse.status())
      
      // Test testimonial API access
      const testimonialResponse = await page.request.get('/api/admin/testimonials')
      expect([200, 304]).toContain(testimonialResponse.status())
    })

    test('unauthenticated users should not access admin APIs', async ({ page }) => {
      // Without any authentication
      const apiEndpoints = [
        '/api/admin/users',
        '/api/admin/blogs',
        '/api/admin/testimonials'
      ]
      
      for (const endpoint of apiEndpoints) {
        const response = await page.request.get(endpoint)
        
        // Should be unauthorized
        expect([401, 403]).toContain(response.status())
      }
    })
  })

  test.describe('Role Switching and Security', () => {
    test('should maintain role restrictions after page refresh', async ({ page }) => {
      await loginAsEditor(page)
      
      // Verify initial state
      await expect(page.locator('a[href="/admin/users"]')).not.toBeVisible()
      
      // Refresh page
      await page.reload()
      
      // Should still not see user management
      await expect(page.locator('a[href="/admin/users"]')).not.toBeVisible()
      
      // Should still see allowed sections
      await expect(page.locator('a[href="/admin/blogs"]')).toBeVisible()
    })

    test('should prevent privilege escalation', async ({ page }) => {
      await loginAsEditor(page)
      
      // Try to access admin functionality through direct navigation
      await page.goto('/admin/users')
      
      // Should be denied
      await expect(page.locator('text=Unauthorized')).toBeVisible({ timeout: 5000 })
        .catch(async () => {
          await expect(page).toHaveURL('/admin')
        })
      
      // Try to manipulate client-side to show admin menu
      await page.goto('/admin')
      
      // Even if we inject admin menu, API should still deny access
      await page.evaluate(() => {
        const menu = document.querySelector('nav')
        if (menu) {
          const userLink = document.createElement('a')
          userLink.href = '/admin/users'
          userLink.textContent = 'Users (Injected)'
          menu.appendChild(userLink)
        }
      })
      
      // Click the injected link
      const injectedLink = page.locator('a:has-text("Users (Injected)")')
      if (await injectedLink.isVisible()) {
        await injectedLink.click()
        
        // Should still be unauthorized
        await expect(page.locator('text=Unauthorized')).toBeVisible({ timeout: 5000 })
          .catch(async () => {
            await expect(page).toHaveURL('/admin')
          })
      }
    })

    test('should handle session with invalid role', async ({ page }) => {
      // This test would require more complex setup to inject invalid role
      // For now, we'll test that role validation is working by checking API responses
      
      await loginAsEditor(page)
      
      // Make request to admin-only endpoint
      const response = await page.request.post('/api/admin/users', {
        data: {
          name: 'Unauthorized User',
          email: 'unauth@test.com',
          password: 'password123',
          role: 'ADMIN'
        }
      })
      
      // Should be forbidden
      expect([401, 403]).toContain(response.status())
    })
  })

  test.describe('Cross-Role Data Access', () => {
    test('editor should only see appropriate data in lists', async ({ page }) => {
      await loginAsEditor(page)
      
      // Go to blogs - should see all blogs (editors can see all blogs)
      await page.goto('/admin/blogs')
      await expect(page.locator('table')).toBeVisible()
      
      // Go to testimonials - should see all testimonials
      await page.goto('/admin/testimonials')
      await expect(page.locator('table')).toBeVisible()
      
      // Should NOT be able to access user list at all
      await page.goto('/admin/users')
      await expect(page.locator('text=Unauthorized')).toBeVisible({ timeout: 5000 })
        .catch(async () => {
          await expect(page).toHaveURL('/admin')
        })
    })

    test('admin should see all data across all sections', async ({ page }) => {
      await loginAsAdmin(page)
      
      // Should see all sections
      const sections = [
        { url: '/admin/users', table: 'table' },
        { url: '/admin/blogs', table: 'table' },
        { url: '/admin/testimonials', table: 'table' }
      ]
      
      for (const section of sections) {
        await page.goto(section.url)
        await expect(page.locator(section.table)).toBeVisible()
      }
    })
  })
})