import { test, expect } from "../../base-test";

test.describe("List of generated lessons", () => {
  test.beforeEach(async ({ lessonGeneratorListPage }) => {
    await lessonGeneratorListPage.goto();

    // Wait for the records container to appear
    await expect(lessonGeneratorListPage.recordsContainer).toBeVisible();
  });

  test("should render the list title and create button", async ({
    page,
    lessonGeneratorListPage,
  }) => {
    // Verify Title
    await expect(lessonGeneratorListPage.heading).toBeVisible();

    // Verify Create Button
    const createButton = page.getByTestId("create-new-button");
    await expect(createButton).toBeVisible();
    await expect(createButton).toHaveText(/Create New/);
  });

  // TODO: this runs against the "public" schema in development. Ideally, it
  // should use the "test_public" schema or a mock.
  test("should render at least one list item", async ({
    lessonGeneratorListPage,
  }) => {
    await lessonGeneratorListPage.waitForListToResolve();
    await expect(lessonGeneratorListPage.allCards.first()).toBeVisible();
  });

  test("should display content and action buttons for the first lesson record", async ({
    lessonGeneratorListPage,
  }) => {
    await lessonGeneratorListPage.waitForListToResolve();

    // --- Content Verification ---

    // Title
    await expect(lessonGeneratorListPage.exampleRecordTitle).toBeVisible();

    // Content
    await expect(lessonGeneratorListPage.exampleRecordContent).toBeVisible();

    // Learner Chip Verification
    await expect(
      lessonGeneratorListPage.exampleRecordLearnerChip,
    ).toBeVisible();

    // --- Button Verification ---

    // View Button
    await expect(lessonGeneratorListPage.exampleRecordViewButton).toBeVisible();
  });

  test("should navigate to lesson detail page from view button", async ({
    page,
    lessonGeneratorListPage,
  }) => {
    await lessonGeneratorListPage.waitForListToResolve();

    const href =
      await lessonGeneratorListPage.exampleRecordViewButton.getAttribute(
        "href",
      );
    expect(href).toMatch(/^\/lessons\/.+/);

    const expectedTitle =
      (
        await lessonGeneratorListPage.exampleRecordTitle.textContent()
      )?.trim() ?? "";

    await Promise.all([
      page.waitForURL(new RegExp(`${href}$`)),
      lessonGeneratorListPage.exampleRecordViewButton.click(),
    ]);

    await expect(
      page.getByRole("heading", { level: 1, name: expectedTitle }),
    ).toBeVisible({ timeout: 15000 });
  });

  test("should resolve loading state on refresh", async ({
    page,
    lessonGeneratorListPage,
  }) => {
    // Reload the page to catch the initial loading state
    await page.reload();

    // Verify the list container remains visible
    await expect(lessonGeneratorListPage.recordsContainer).toBeVisible();

    // Wait for data to resolve to one of: records, empty state, or error state.
    await lessonGeneratorListPage.waitForListToResolve();
  });
});
