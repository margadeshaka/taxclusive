import { test, expect } from "@playwright/test";

test.describe("Blogs Feature", () => {
  test("should display list of blogs and navigate to blog detail", async ({ page }) => {
    // Go to the blogs page
    await page.goto("/blogs");

    // Verify we're on the blogs page
    await expect(page).toHaveTitle(/Blogs/i);

    // Wait for blogs to load (this might take some time if fetching from API)
    await page.waitForSelector('h1:has-text("Blogs")');

    // Check if at least one blog post is visible
    // Note: This test assumes there are blog posts available
    const blogPosts = page.locator('a[href^="/blogs?id="]');
    await expect(blogPosts).toHaveCount({ min: 1 });

    // Get the title of the first blog post for later comparison
    const firstBlogTitle = await blogPosts.first().locator("h3").textContent();

    // Click on the first blog post
    await blogPosts.first().click();

    // Verify we're on the blog detail page
    await expect(page).toHaveURL(/\/blogs\?id=\d+/);

    // Verify the blog title is displayed on the detail page
    const detailTitle = page.locator("h1");
    await expect(detailTitle).toBeVisible();

    // Verify it's the same blog we clicked on
    if (firstBlogTitle) {
      await expect(detailTitle).toHaveText(firstBlogTitle);
    }

    // Check if the blog content is displayed
    const blogContent = page.locator("article");
    await expect(blogContent).toBeVisible();

    // Check if the back to blogs link is available
    const backLink = page.getByRole("link", { name: "Back to Blogs" });
    await expect(backLink).toBeVisible();

    // Navigate back to the blogs list
    await backLink.click();

    // Verify we're back on the blogs page
    await expect(page).toHaveURL("/blogs");
    await expect(blogPosts).toBeVisible();
  });

  test("should handle empty blog list gracefully", async ({ page, context }) => {
    // Intercept API requests to blogs and return empty array
    await context.route("**/api/articles**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [] }),
      });
    });

    // Go to the blogs page
    await page.goto("/blogs");

    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Blogs")');

    // Check if the empty state message is displayed
    const emptyState = page.getByText("No blogs found");
    await expect(emptyState).toBeVisible();

    // Check if the "Check back later" message is displayed
    await expect(page.getByText("Check back later for new content")).toBeVisible();
  });

  test("should handle API errors gracefully", async ({ page, context }) => {
    // Intercept API requests to blogs and return an error
    await context.route("**/api/articles**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // Go to the blogs page
    await page.goto("/blogs");

    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Blogs")');

    // Check if the error message is displayed
    const errorMessage = page.getByText("Error loading blogs");
    await expect(errorMessage).toBeVisible();

    // Check if the error description is displayed
    await expect(page.getByText("Please try again later or contact support")).toBeVisible();
  });
});
