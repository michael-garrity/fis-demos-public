import { Locator, Page } from "@playwright/test";
import { expect } from "../../../base-test";

export class LessonPlanCreatePage {
  readonly heading: Locator;

  // Form Fields
  readonly sourceMaterialSelect: Locator;
  readonly sourceMaterialTitleField: Locator;
  readonly sourceMaterialContentField: Locator;
  readonly learnerProfileSelect: Locator;

  // Buttons
  readonly submitButton: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", {
      name: "Create New Lesson Plan",
    });

    this.sourceMaterialSelect = page.getByTestId(
      "source-material-selector"
    );

    this.sourceMaterialTitleField = page.getByTestId(
      "custom-source-title"
    );
    this.sourceMaterialContentField = page.getByTestId(
      "custom-source-content"
    );

    this.learnerProfileSelect = page.getByTestId(
      "lesson-plan-create-learner-profile"
    );

    // --- Locator for Submit Button ---
    this.submitButton = page.getByTestId("lesson-plan-create-submit");
  }

  async goto() {
    await this.page.goto("/lesson-planner/create");
  }

  async submitCreateForm() {
    await this.submitButton.click();
  }

  /**
   * Fills the form with valid data necessary for submission.
   * NOTE: Assumes Learner Profiles are loaded, selects the first one.
   */
  async fillRequiredFields() {}

  async customSourceMaterialFillAll() {
    await expect(this.learnerProfileSelect).toBeEnabled();

    await expect(this.learnerProfileSelect).toHaveText(
      "Select existing profile"
    );

    await this.learnerProfileSelect.click();
    const firstOption = this.page
      .getByRole("listbox")
      .getByRole("option")
      .first();
    await firstOption.click();

    await this.sourceMaterialSelect.click();
    await this.page
      .getByRole("listbox")
      .getByTestId("select-custom-material")
      .click();

    await expect(this.sourceMaterialTitleField).toBeVisible();
    await expect(this.sourceMaterialContentField).toBeVisible();

    // Fill required fields
    await this.sourceMaterialTitleField.fill(
      "Introduction to Atomic Structure"
    );
    await this.sourceMaterialContentField.fill(
      "Atoms are the basic building blocks of matter..."
    );
  }

  async presetSourceMaterialFillAll() {
    await expect(this.learnerProfileSelect).toBeEnabled();

    await expect(this.learnerProfileSelect).toHaveText(
      "Select existing profile"
    );

    // Select Learner Profile (Selects the first available option)
    await this.learnerProfileSelect.click();
    const firstOption = this.page
      .getByRole("listbox")
      .getByRole("option")
      .first();
    await firstOption.click();

    // Source material
    await this.sourceMaterialSelect.click();
    
    const sourceList = this.page.getByRole("listbox").first();

    // Select first non-custom option
    const firstExistingMaterial = sourceList
      .getByRole("option")
      .first();
    await firstExistingMaterial.waitFor({ state: "visible" });
    await firstExistingMaterial.click();

    // Ensure textboxes are NOT visible
    await expect(this.sourceMaterialTitleField).toBeHidden();
    await expect(this.sourceMaterialContentField).toBeHidden();
  }
}
