import { test, expect } from "../../base-test";

test.describe("Creation of a new Quiz", () => {
  test.beforeEach(async ({ quizCreatePage }) => {
    // Navigate to the creation page before each test
    await quizCreatePage.goto();
    // Wait for the heading to ensure the page has loaded
    await expect(quizCreatePage.heading).toBeVisible();
  });

  test("Submit button is enabled when all required fields are filled", async ({
    quizCreatePage,
  }) => {
    // Fill all required fields using the helper function
    await quizCreatePage.fillRequiredNonSourceFields();
    await quizCreatePage.selectSource();

    // The submit button should now be enabled
    await expect(quizCreatePage.submitButton).toBeEnabled();
  });
});
