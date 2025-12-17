import { test, expect } from "../../base-test";

test.describe("Creation of a new Lesson Plan", () => {
  test.beforeEach(async ({ lessonPlanCreatePage }) => {
    // Navigate to the creation page before each test
    await lessonPlanCreatePage.goto();
    // Wait for the heading to ensure the page has loaded
    await expect(lessonPlanCreatePage.heading).toBeVisible();
  });

  test("Submit button is enabled when all required fields are filled", async ({
    lessonPlanCreatePage,
  }) => {
    // Fill all required fields using the helper function
    await lessonPlanCreatePage.fillRequiredFields();

    // The submit button should now be enabled
    await expect(lessonPlanCreatePage.submitButton).toBeEnabled();
  });
});
