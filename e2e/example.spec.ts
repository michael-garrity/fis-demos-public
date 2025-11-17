import { test, expect } from "@playwright/test";

// Run all tests in this file against the homepage
test.beforeEach(async ({ page }) => {
  // Go to the homepage (baseURL is in playwright.config.ts)
  await page.goto("/");
});

test("should load the homepage and see the main heading", async ({ page }) => {
  // Wait for the heading to appear (due to framer-motion)
  await expect(
    page.getByRole("heading", { name: "Next.js App" })
  ).toBeVisible();
});

test("should increment the counter when the button is clicked", async ({
  page,
}) => {
  // 1. Find the elements on the page
  // This text is in `src/app/page.tsx`
  const countDisplay = page.getByText("Count: 0");

  // This button is in `src/app/components/Counter.tsx`
  const incrementButton = page.getByRole("button", { name: "Increment" });

  // 2. Assert initial state
  await expect(countDisplay).toBeVisible();

  // 3. Act
  await incrementButton.click();

  // 4. Assert final state
  // The old text should be gone
  await expect(countDisplay).not.toBeVisible();
  // The new text should be visible
  await expect(page.getByText("Count: 1")).toBeVisible();
});
