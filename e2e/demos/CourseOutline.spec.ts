import { test, expect } from "../base-test";

test.describe("", () => {
  test.beforeEach(async ({ courseOutlinePage }) => {
    await courseOutlinePage.goto();

    // Wait for the simulated loading state to clear (100ms delay in React component)
    await expect(courseOutlinePage.skeletonWrapper).not.toBeVisible();

    // Wait for the records container to appear
    await expect(courseOutlinePage.recordsContainer).toBeVisible();
  });

  test("should render the list title and create button", async ({
    page,
    courseOutlinePage,
  }) => {
    // Verify Title
    await expect(courseOutlinePage.heading).toBeVisible();

    // Verify Create Button
    const createButton = page.getByTestId("create-new-button");
    await expect(createButton).toBeVisible();
    await expect(createButton).toHaveText(/Create New/);
    await expect(createButton).toHaveAttribute("href", "/course-outline/new");
  });

  test("should render the correct number of list items", async ({ page }) => {
    // Verify exactly two list items are present based on mock data
    const listItems = page.getByTestId("list-item-card");
    await expect(listItems).toHaveCount(3);
  });

  test("should display content and action buttons for the first course record", async ({
    courseOutlinePage,
  }) => {
    // --- Content Verification ---

    // Title
    await expect(courseOutlinePage.exampleRecordTitle).toBeVisible();

    // Description
    await expect(courseOutlinePage.exampleRecordDescription).toBeVisible();

    // Details (Time/Lessons)
    await expect(courseOutlinePage.exampleRecordTimePerLesson).toBeVisible();
    await expect(courseOutlinePage.exampleRecordTotalLessons).toBeVisible();

    // Learner Chip Verification
    await expect(courseOutlinePage.exampleRecordLearnerChip).toBeVisible();

    // --- Button Verification ---

    // View Button
    await expect(courseOutlinePage.exampleRecordViewButton).toBeVisible();

    // Edit Button
    await expect(courseOutlinePage.exampleRecordEditButton).toBeVisible();
  });

  test("should show loading skeleton initially", async ({
    page,
    courseOutlinePage,
  }) => {
    // Reload the page to catch the initial loading state
    await page.reload();

    // Verify the skeleton is visible immediately
    await expect(courseOutlinePage.skeletonWrapper).toBeVisible();

    // Wait for loading to complete and verify the data appears
    await expect(courseOutlinePage.recordsContainer).toBeVisible();
  });
});
