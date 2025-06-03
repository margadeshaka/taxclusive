# End-to-End Tests

This directory contains end-to-end tests for the TaxExclusive application using Playwright.

## Setup

The tests use Playwright, which is already configured in the project. If you haven't installed Playwright browsers yet, run:

```bash
npx playwright install
```

## Running Tests

To run all end-to-end tests:

```bash
pnpm test:e2e
```

To run a specific test file:

```bash
pnpm test:e2e e2e/navigation.spec.ts
```

To run tests in UI mode (with visual test runner):

```bash
pnpm test:e2e --ui
```

## Test Structure

The tests are organized by feature:

- **navigation.spec.ts**: Tests for navigation across the site, including:

  - Navigation between all main pages
  - Mobile menu functionality

- **blogs.spec.ts**: Tests for the blogs feature, including:
  - Displaying the list of blogs
  - Navigating to blog detail pages
  - Handling empty blog lists
  - Handling API errors

## Test Environment

Tests run against a local development server, which is automatically started when running the tests. The server runs on port 3000.

## Mocking

Some tests use request interception to mock API responses, allowing us to test error states and edge cases without relying on the actual API state.

## Browsers

Tests are configured to run on multiple browsers:

- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## CI Integration

In CI environments, tests will run with additional retries and generate HTML reports. Screenshots are captured on test failures.
