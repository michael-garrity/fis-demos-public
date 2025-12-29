import { Locator, Page } from "@playwright/test";
import { expect } from "../../../base-test";

export class LessonPlanCreatePage {
  readonly heading: Locator;

  // Form Fields
  readonly sourceMaterialTitleField: Locator;
  readonly sourceMaterialContentField: Locator;
  readonly learnerProfileSelect: Locator;

  readonly introductionField: Locator;
  readonly contextField: Locator;
  readonly exampleField: Locator;
  readonly practiceField: Locator;
  readonly assessmentField: Locator;
  readonly reflectionField: Locator;

  // Buttons
  readonly submitButton: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", {
      name: "Create New Lesson Plan",
    });

    // --- Locators for Form Fields ---
    this.sourceMaterialTitleField = page.getByTestId(
      "lesson-plan-create-source-material-title"
    );
    this.sourceMaterialContentField = page.getByTestId(
      "lesson-plan-create-source-material-content"
    );

    this.learnerProfileSelect = page.getByTestId(
      "lesson-plan-create-learner-profile"
    );

    this.introductionField = page.getByTestId(
      "lesson-plan-create-introduction"
    );
    this.contextField = page.getByTestId("lesson-plan-create-context");
    this.exampleField = page.getByTestId("lesson-plan-create-example");
    this.practiceField = page.getByTestId("lesson-plan-create-practice");
    this.assessmentField = page.getByTestId("lesson-plan-create-assessment");
    this.reflectionField = page.getByTestId("lesson-plan-create-reflection");

    // --- Locator for Submit Button ---
    this.submitButton = page.getByTestId("lesson-plan-create-submit");
  }

  async goto() {
    await this.page.goto("/lesson-plan/create");
  }

  async submitCreateForm() {
    await this.submitButton.click();
  }

  /**
   * Fills the form with valid data necessary for submission.
   * NOTE: Assumes Learner Profiles are loaded, selects the first one.
   */
  async fillRequiredFields() {
    await expect(this.learnerProfileSelect).toBeEnabled();

    await expect(this.learnerProfileSelect).toHaveText(
      "Select existing profile"
    );
    // await expect(this.learnerProfileSelect).not.toBeDisabled();

    // Select Learner Profile (Selects the first available option)
    await this.learnerProfileSelect.click();
    const firstOption = this.page.getByRole("option").first();
    await firstOption.click();

    // 1. Source material
    await this.sourceMaterialTitleField.fill(
      "Introduction to Atomic Structure"
    );
    await this.sourceMaterialContentField.fill(
      "Atoms are the basic building blocks of matter..."
    );

    // 2. Lesson content
    await this.introductionField.fill("This lesson introduces atoms.");
    await this.contextField.fill(
      "Atoms are essential to understanding chemistry and physics."
    );
    await this.exampleField.fill(
      "For example, water is made of hydrogen and oxygen atoms."
    );
    await this.practiceField.fill(
      "Have students identify atoms in common substances."
    );
    await this.assessmentField.fill("Quiz students on atomic structure.");
    await this.reflectionField.fill("Students reflect on why atoms matter.");
  }
}
