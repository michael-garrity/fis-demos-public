import { test, expect } from "../../base-test";

test.describe("Creation of a new Course Outline", () => {
  test.beforeEach(async ({ courseOutlineCreatePage }) => {
    // Navigate to the creation page before each test
    await courseOutlineCreatePage.goto();
    // Wait for the heading to ensure the page has loaded
    await expect(courseOutlineCreatePage.heading).toBeVisible();
  });

  test("Submit button is enabled when all required fields are filled", async ({
    courseOutlineCreatePage,
  }) => {
    // Fill all required fields using the helper function
    await courseOutlineCreatePage.fillRequiredFields();

    // The submit button should now be enabled
    await expect(courseOutlineCreatePage.submitButton).toBeEnabled();
  });
});
