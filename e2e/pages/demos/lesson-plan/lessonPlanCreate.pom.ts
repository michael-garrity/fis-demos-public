import { Locator, Page } from "@playwright/test";
import { expect } from "../../../base-test";

export class LessonPlanCreatePage {
  readonly heading: Locator;

  // Form Fields
  readonly titleField: Locator;
  readonly descriptionField: Locator;
  readonly durationValueField: Locator;
  readonly durationUnitSelect: Locator;
  readonly learnerProfileSelect: Locator;

  // Buttons
  readonly submitButton: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", {
      name: "Create New Lesson Plan",
    });

    // --- Locators for Form Fields ---
    this.titleField = page.getByTestId("lesson-plan-create-title");
    this.descriptionField = page.getByTestId("lesson-plan-create-description");
    this.durationValueField = page.getByLabel("Time").first(); // Target the input for the value
    this.durationUnitSelect = page.getByRole("combobox", {
      name: "Time Per Lesson Unit",
    });
    this.learnerProfileSelect = page.getByTestId(
      "lesson-plan-create-learner-profile"
    );

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
  async fillRequiredFields(data?: {
    title?: string;
    description?: string;
    durationValue?: number;
    durationUnit?: "minutes" | "hours";
  }) {
    await expect(this.learnerProfileSelect).toHaveText(
      "Select existing profile"
    );
    await expect(this.learnerProfileSelect).not.toBeDisabled();

    // 1. Fill Text/Number fields
    await this.titleField.fill(data?.title ?? "Advanced Playwright Testing");
    await this.descriptionField.fill(
      data?.description ?? "A lesson on end-to-end testing strategies."
    );
    await this.durationValueField.fill(String(data?.durationValue ?? 30));

    // 2. Select Duration Unit (Default is 'minutes')
    if (data?.durationUnit && data.durationUnit !== "minutes") {
      await this.durationUnitSelect.click();
      await this.page.getByRole("option", { name: data.durationUnit }).click();
    }

    // 3. Select Learner Profile (Selects the first available option)
    await this.learnerProfileSelect.click();

    // 4. Wait for a visible, standard dropdown item and select it.
    const firstOption = this.page.getByRole("option").first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();
  }
}
