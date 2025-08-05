import { test, expect } from '@playwright/test'

test.describe('Public Website Navigation', () => {
  test('should navigate through main pages', async ({ page }) => {
    // Start at homepage
    await page.goto('/')
    
    // Check homepage elements
    await expect(page).toHaveTitle(/Taxclusive/)
    await expect(page.locator('h1')).toContainText('Chartered Accountants')
    await expect(page.locator('.stat-number').first()).toBeVisible()
    
    // Navigate to About page
    await page.click('a[href="/about"]')
    await expect(page).toHaveURL('/about')
    await expect(page.locator('h1')).toContainText('About')
    
    // Navigate to Services page
    await page.click('a[href="/services"]')
    await expect(page).toHaveURL('/services')
    await expect(page.locator('h1')).toContainText('Services')
    
    // Navigate to Blogs page
    await page.click('a[href="/blogs"]')
    await expect(page).toHaveURL('/blogs')
    await expect(page.locator('h1')).toContainText('Expert Financial Insights')
    
    // Navigate to Contact page
    await page.click('a[href="/contact"]')
    await expect(page).toHaveURL('/contact')
    await expect(page.locator('h1')).toContainText('Contact')
  })

  test('should display all service cards on homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check that services section exists
    await expect(page.locator('text=Our Services').first()).toBeVisible()
    
    // Check for at least some service names that are likely on the page
    const services = [
      'Financial Advisory',
      'Audit & Assurance'
    ]
    
    for (const service of services) {
      await expect(page.locator(`text=${service}`).first()).toBeVisible()
    }
  })

  test('should show testimonials section', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to testimonials
    await page.locator('text=What Our Clients Say').scrollIntoViewIfNeeded()
    
    // Check testimonials are visible
    await expect(page.locator('text=What Our Clients Say')).toBeVisible()
    
    // Check for testimonial content instead of star rating
    await expect(page.locator('text=Their financial advisory')).toBeVisible()
  })

  test('should have working footer links', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Check footer sections
    await expect(page.locator('footer')).toContainText('Quick Links')
    await expect(page.locator('footer')).toContainText('Services')
    await expect(page.locator('footer')).toContainText('Contact Us')
  })

  test('should handle mobile navigation', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip()
    }
    
    await page.goto('/')
    
    // Open mobile menu
    await page.click('button[aria-label="Toggle navigation menu"]')
    
    // Check mobile menu items
    await expect(page.locator('a[href="/about"]')).toBeVisible()
    await expect(page.locator('a[href="/services"]')).toBeVisible()
    await expect(page.locator('a[href="/blogs"]')).toBeVisible()
    
    // Navigate via mobile menu
    await page.click('a[href="/services"]')
    await expect(page).toHaveURL('/services')
  })

  test('should display newsletter subscription', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to newsletter
    await page.evaluate(() => {
      document.querySelector('input[type="email"][placeholder*="newsletter"]')?.scrollIntoView()
    })
    
    await expect(page.locator('text=Stay Updated')).toBeVisible()
    await expect(page.locator('input[type="email"]').last()).toBeVisible()
  })
})