import { test, expect } from "../../base-test";

test.describe("List of generated course outlines", () => {
  test.beforeEach(async ({ courseOutlineListPage: courseOutlinePage }) => {
    await courseOutlinePage.goto();

    // Wait for the simulated loading state to clear (100ms delay in React component)
    await expect(courseOutlinePage.skeletonWrapper).not.toBeVisible();

    // Wait for the records container to appear
    await expect(courseOutlinePage.recordsContainer).toBeVisible();
  });

  test("should render the list title and create button", async ({
    page,
    courseOutlineListPage,
  }) => {
    // Verify Title
    await expect(courseOutlineListPage.heading).toBeVisible();

    // Verify Create Button
    const createButton = page.getByTestId("create-new-button");
    await expect(createButton).toBeVisible();
    await expect(createButton).toHaveText(/Create New/);
  });

  test("should render the correct number of list items", async ({ page }) => {
    // Verify exactly two list items are present based on mock data
    const listItems = page.getByTestId("list-item-card");
    await expect(listItems).toHaveCount(3);
  });

  test("should display content and action buttons for the first course record", async ({
    courseOutlineListPage,
  }) => {
    // --- Content Verification ---

    // Title
    await expect(courseOutlineListPage.exampleRecordTitle).toBeVisible();

    // Description
    await expect(courseOutlineListPage.exampleRecordDescription).toBeVisible();

    // Details (Time/Lessons)
    await expect(
      courseOutlineListPage.exampleRecordTimePerLesson
    ).toBeVisible();
    await expect(courseOutlineListPage.exampleRecordTotalLessons).toBeVisible();

    // Learner Chip Verification
    await expect(courseOutlineListPage.exampleRecordLearnerChip).toBeVisible();

    // --- Button Verification ---

    // View Button
    await expect(courseOutlineListPage.exampleRecordViewButton).toBeVisible();

    // Edit Button
    await expect(courseOutlineListPage.exampleRecordEditButton).toBeVisible();
  });

  test("should show loading skeleton initially", async ({
    page,
    courseOutlineListPage,
  }) => {
    // Reload the page to catch the initial loading state
    await page.reload();

    // Verify the skeleton is visible immediately
    await expect(courseOutlineListPage.skeletonWrapper).toBeVisible();

    // Wait for loading to complete and verify the data appears
    await expect(courseOutlineListPage.recordsContainer).toBeVisible();
  });
});
