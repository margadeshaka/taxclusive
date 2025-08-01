import { test, expect } from '@playwright/test'
import { contactFormData, appointmentFormData, newsletterEmail, queryFormData } from './fixtures/test-data'

test.describe('Form Submissions', () => {
  test.describe('Contact Form', () => {
    test('should submit contact form successfully', async ({ page }) => {
      await page.goto('/contact')
      
      // Fill form
      await page.fill('input[name="firstName"]', contactFormData.firstName)
      await page.fill('input[name="lastName"]', contactFormData.lastName)
      await page.fill('input[name="email"]', contactFormData.email)
      await page.fill('input[name="phone"]', contactFormData.phone)
      await page.fill('input[name="subject"]', contactFormData.subject)
      await page.fill('textarea[name="message"]', contactFormData.message)
      
      // Submit form
      await page.click('button[type="submit"]')
      
      // Check success message
      await expect(page.locator('text=Your message has been sent successfully')).toBeVisible({
        timeout: 10000
      })
    })

    test('should show validation errors for empty required fields', async ({ page }) => {
      await page.goto('/contact')
      
      // Try to submit empty form
      await page.click('button[type="submit"]')
      
      // Check validation messages
      await expect(page.locator('text=First name is required')).toBeVisible()
      await expect(page.locator('text=Last name is required')).toBeVisible()
      await expect(page.locator('text=Email is required')).toBeVisible()
      await expect(page.locator('text=Subject is required')).toBeVisible()
      await expect(page.locator('text=Message is required')).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
      await page.goto('/contact')
      
      // Fill form with invalid email
      await page.fill('input[name="firstName"]', 'Test')
      await page.fill('input[name="lastName"]', 'User')
      await page.fill('input[name="email"]', 'invalidemail')
      await page.fill('input[name="subject"]', 'Test')
      await page.fill('textarea[name="message"]', 'Test message')
      
      await page.click('button[type="submit"]')
      
      // Check email validation
      await expect(page.locator('text=Please enter a valid email')).toBeVisible()
    })
  })

  test.describe('Appointment Form', () => {
    test('should book appointment successfully', async ({ page }) => {
      await page.goto('/appointment')
      
      // Fill form
      await page.fill('input[name="firstName"]', appointmentFormData.firstName)
      await page.fill('input[name="lastName"]', appointmentFormData.lastName)
      await page.fill('input[name="email"]', appointmentFormData.email)
      await page.fill('input[name="phone"]', appointmentFormData.phone)
      
      // Select service
      await page.click('button[role="combobox"]')
      await page.click(`text=${appointmentFormData.service}`)
      
      // Set date and time
      await page.fill('input[type="date"]', appointmentFormData.date)
      await page.fill('input[type="time"]', appointmentFormData.time)
      
      // Select meeting type
      await page.click(`input[value="${appointmentFormData.meetingType}"]`)
      
      // Add message
      await page.fill('textarea[name="message"]', appointmentFormData.message)
      
      // Submit
      await page.click('button[type="submit"]')
      
      // Check success
      await expect(page.locator('text=Appointment booked successfully')).toBeVisible({
        timeout: 10000
      })
    })

    test('should show calendar for date selection', async ({ page }) => {
      await page.goto('/appointment')
      
      // Click on date input to open calendar
      await page.click('button:has-text("Pick a date")')
      
      // Check calendar is visible
      await expect(page.locator('.calendar')).toBeVisible()
      
      // Select a date
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      await page.click(`button[aria-label*="${tomorrow.getDate()}"]`)
    })
  })

  test.describe('Newsletter Subscription', () => {
    test('should subscribe to newsletter', async ({ page }) => {
      await page.goto('/')
      
      // Scroll to newsletter section
      await page.evaluate(() => {
        document.querySelector('input[placeholder*="email"]')?.scrollIntoView()
      })
      
      // Find newsletter input and submit
      const newsletterInput = page.locator('input[placeholder*="email"]').last()
      await newsletterInput.fill(newsletterEmail)
      
      // Submit newsletter form
      await page.click('button:near(input[placeholder*="email"]):has-text("Subscribe")')
      
      // Check success message
      await expect(page.locator('text=Successfully subscribed')).toBeVisible({
        timeout: 10000
      })
    })

    test('should show error for duplicate subscription', async ({ page }) => {
      await page.goto('/')
      
      // Try to subscribe with same email twice
      await page.evaluate(() => {
        document.querySelector('input[placeholder*="email"]')?.scrollIntoView()
      })
      
      const newsletterInput = page.locator('input[placeholder*="email"]').last()
      await newsletterInput.fill(newsletterEmail)
      await page.click('button:near(input[placeholder*="email"]):has-text("Subscribe")')
      
      // Should show already subscribed message
      await expect(page.locator('text=already subscribed')).toBeVisible({
        timeout: 10000
      })
    })
  })

  test.describe('Query Form', () => {
    test('should submit query successfully', async ({ page }) => {
      await page.goto('/ask-query')
      
      // Fill form
      await page.fill('input[name="fullName"]', queryFormData.fullName)
      await page.fill('input[name="email"]', queryFormData.email)
      await page.fill('input[name="phone"]', queryFormData.phone)
      
      // Select category
      await page.selectOption('select[name="category"]', queryFormData.category)
      
      // Select priority
      await page.click(`input[value="${queryFormData.priority}"]`)
      
      // Fill subject and query
      await page.fill('input[name="subject"]', queryFormData.subject)
      await page.fill('textarea[name="query"]', queryFormData.query)
      
      // Submit
      await page.click('button[type="submit"]')
      
      // Check success
      await expect(page.locator('text=Query submitted successfully')).toBeVisible({
        timeout: 10000
      })
    })

    test('should handle file uploads in query form', async ({ page }) => {
      await page.goto('/ask-query')
      
      // Fill basic info
      await page.fill('input[name="fullName"]', 'File Test User')
      await page.fill('input[name="email"]', 'filetest@test.com')
      await page.fill('input[name="subject"]', 'File Upload Test')
      await page.fill('textarea[name="query"]', 'Testing file upload')
      
      // Upload file (if file input exists)
      const fileInput = page.locator('input[type="file"]')
      if (await fileInput.isVisible()) {
        // Create a test file
        await fileInput.setInputFiles({
          name: 'test-document.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('Test PDF content')
        })
        
        // Check file is selected
        await expect(page.locator('text=test-document.pdf')).toBeVisible()
      }
    })
  })
})