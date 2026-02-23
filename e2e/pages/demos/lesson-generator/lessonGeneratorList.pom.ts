import { Locator, Page } from "@playwright/test";

export class LessonGeneratorListPage {
  readonly heading: Locator;

  readonly loadingText: Locator;
  readonly recordsContainer: Locator;
  readonly allCards: Locator;
  readonly emptyStateText: Locator;
  readonly errorText: Locator;

  readonly exampleRecordCard: Locator;
  readonly exampleRecordTitle: Locator;
  readonly exampleRecordContent: Locator;
  readonly exampleRecordLearnerChip: Locator;
  readonly exampleRecordViewButton: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Generated Lessons" });

    this.loadingText = page.getByText("Loading...");
    this.recordsContainer = page.getByTestId("record-list-container");
    this.allCards = page.getByTestId("list-item-card");
    this.emptyStateText = page.getByText(
      "No records found. Click 'Create New' to get started!",
    );
    this.errorText = page.getByText("Error loading lessons:");

    this.exampleRecordCard = page.getByTestId("list-item-card").first();
    this.exampleRecordTitle = this.exampleRecordCard.getByTestId(
      "lesson-list-record-title",
    );
    this.exampleRecordContent = this.exampleRecordCard.getByTestId(
      "lesson-list-record-content",
    );
    this.exampleRecordLearnerChip = this.exampleRecordCard.getByTestId(
      "lesson-list-learner-chip",
    );
    this.exampleRecordViewButton = this.exampleRecordCard.getByTestId(
      "lesson-list-button-view",
    );
  }

  async goto() {
    await this.page.goto("/lesson-generator");
  }

  async waitForListToResolve() {
    await Promise.race([
      this.allCards.first().waitFor({ state: "visible", timeout: 15000 }),
      this.emptyStateText.waitFor({ state: "visible", timeout: 15000 }),
      this.errorText.waitFor({ state: "visible", timeout: 15000 }),
    ]);
  }

  async getNumberOfRecords() {
    const records = await this.allCards.all();

    return records.length;
  }
}
