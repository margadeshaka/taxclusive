import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to all main pages", async ({ page }) => {
    // Start from the home page
    await page.goto("/");

    // Verify we're on the home page
    await expect(page).toHaveTitle(/Taxclusive/);

    // Check if the header is visible
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Check if the logo is visible
    const logo = header.getByText("Taxclusive");
    await expect(logo).toBeVisible();

    // Navigate to About page
    await header.getByRole("link", { name: "About Us" }).click();
    await expect(page).toHaveURL(/.*about/);

    // Navigate to Services page
    await header.getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/.*services/);

    // Navigate to Expertise page
    await header.getByRole("link", { name: "Expertise" }).click();
    await expect(page).toHaveURL(/.*expertise/);

    // Navigate to Insights page
    await header.getByRole("link", { name: "Insights" }).click();
    await expect(page).toHaveURL(/.*insights/);

    // Navigate to Blogs page
    await header.getByRole("link", { name: "Blogs" }).click();
    await expect(page).toHaveURL(/.*blogs/);

    // Navigate to FAQ page
    await header.getByRole("link", { name: "FAQ" }).click();
    await expect(page).toHaveURL(/.*faq/);

    // Navigate to Contact page
    await header.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/.*contact/);

    // Navigate back to home page
    await header.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL(/\/$/); // Root URL
  });

  test("should toggle mobile menu on small screens", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Go to the home page
    await page.goto("/");

    // Mobile menu should not be visible initially
    const mobileMenu = page.getByRole("navigation", { name: "Mobile" });
    await expect(mobileMenu).not.toBeVisible();

    // Click the menu button
    await page.getByRole("button", { name: "Open menu" }).click();

    // Mobile menu should now be visible
    await expect(mobileMenu).toBeVisible();

    // Click a link in the mobile menu
    await mobileMenu.getByRole("link", { name: "About Us" }).click();

    // Should navigate to the About page
    await expect(page).toHaveURL(/.*about/);

    // Mobile menu should be closed after navigation
    await expect(mobileMenu).not.toBeVisible();
  });
});
