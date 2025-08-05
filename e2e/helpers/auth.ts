import { Page } from '@playwright/test'
import { testUsers } from '../fixtures/test-data'

export async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[type="email"]', testUsers.admin.email)
  await page.fill('input[type="password"]', testUsers.admin.password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')
}

export async function loginAsEditor(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[type="email"]', testUsers.editor.email)
  await page.fill('input[type="password"]', testUsers.editor.password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')
}

export async function logout(page: Page) {
  await page.click('button:has-text("Sign Out")')
  await page.waitForURL('/admin/login')
}

export async function checkAdminAccess(page: Page) {
  // Check if user management is visible (admin only)
  return await page.isVisible('a[href="/admin/users"]')
}

export async function checkEditorAccess(page: Page) {
  // Check if user management is NOT visible (editor restriction)
  const hasUserManagement = await page.isVisible('a[href="/admin/users"]')
  return !hasUserManagement
}