import { Locator, Page } from "@playwright/test";
import { expect } from "../../../base-test";

export class QuizCreatePage {
  readonly heading: Locator;

  // Form Fields
  readonly titleField: Locator;
  readonly descriptionField: Locator;
  readonly numberOfQuestionsField: Locator;
  readonly sourceLessonSelector: Locator;
  readonly learnerProfileSelect: Locator;
  readonly customizationField: Locator;

  // Buttons
  readonly submitButton: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", {
      name: "Create New Quiz",
    });

    // --- Locators for Form Fields ---
    this.titleField = page.getByTestId("quiz-create-title");
    this.descriptionField = page.getByTestId("quiz-create-description");
    this.numberOfQuestionsField = page.getByLabel("Number of Questions");

    this.sourceLessonSelector = page.getByTestId("quiz-create-lesson-selector");
    this.learnerProfileSelect = page.getByTestId("quiz-create-learner-profile");

    this.customizationField = page.getByLabel("Customization");

    // --- Locator for Submit Button ---
    this.submitButton = page.getByTestId("quiz-create-submit");
  }

  async goto() {
    await this.page.goto("/quiz-generator/create");
  }

  async submitCreateForm() {
    await this.submitButton.click();
  }

  /**
   * Fills the form with valid data necessary for submission.
   * NOTE: Assumes Learner Profiles are loaded, selects the first one.
   */
  async fillRequiredFields(data?: {
    title?: string;
    description?: string;
    durationUnit?: "minutes" | "hours";
  }) {
    await expect(this.learnerProfileSelect).toHaveText(
      "Select existing profile"
    );
    await expect(this.learnerProfileSelect).not.toBeDisabled();

    // 1. Fill Text/Number fields
    await this.titleField.fill(data?.title ?? "Advanced Playwright Testing");
    await this.descriptionField.fill(
      data?.description ?? "A quiz on end-to-end testing strategies."
    );

    // 2. Select Source Lesson (Selects the first available option)
    await this.sourceLessonSelector.click();

    const sourceList = this.page.getByRole("listbox").first();
    await expect(sourceList).toBeVisible();

    const firstSourceOption = sourceList.getByRole("option").first();
    await expect(firstSourceOption).toBeVisible();
    await firstSourceOption.click();

    // 3. Select Learner Profile (Selects the first available option)
    await this.learnerProfileSelect.click();

    const profileList = this.page.getByRole("listbox").first();
    await expect(profileList).toBeVisible();

    const firstOption = profileList.getByRole("option").first();
    await firstOption.waitFor({ state: "visible" });
    await firstOption.click({ force: true });

  }
}
