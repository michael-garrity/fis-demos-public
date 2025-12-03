import { Locator, Page } from "@playwright/test";

export class CourseOutlineListPage {
  readonly heading: Locator;

  readonly skeletonWrapper: Locator;
  readonly recordsContainer: Locator;
  readonly allCards: Locator;

  readonly exampleRecordCard: Locator;
  readonly exampleRecordTitle: Locator;
  readonly exampleRecordDescription: Locator;
  readonly exampleRecordTimePerLesson: Locator;
  readonly exampleRecordTotalLessons: Locator;
  readonly exampleRecordLearnerChip: Locator;
  readonly exampleRecordViewButton: Locator;
  readonly exampleRecordEditButton: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Course Outlines" });

    this.skeletonWrapper = page.getByTestId("list-skeleton-wrapper");
    this.recordsContainer = page.getByTestId("record-list-container");
    this.allCards = page.getByTestId("list-item-card");

    this.exampleRecordCard = page.getByTestId("list-item-card").first();
    this.exampleRecordTitle = this.exampleRecordCard.getByTestId(
      "course-outline-list-record-title"
    );
    this.exampleRecordDescription = this.exampleRecordCard.getByTestId(
      "course-outline-list-record-description"
    );
    this.exampleRecordTimePerLesson = this.exampleRecordCard.getByTestId(
      "course-outline-list-time-per-lesson"
    );
    this.exampleRecordTotalLessons = this.exampleRecordCard.getByTestId(
      "course-outline-list-total-lessons"
    );
    this.exampleRecordLearnerChip = this.exampleRecordCard.getByTestId(
      "course-outline-list-learner-chip"
    );
    this.exampleRecordViewButton = this.exampleRecordCard.getByTestId(
      "course-outline-list-button-view"
    );
    this.exampleRecordEditButton = this.exampleRecordCard.getByTestId(
      "course-outline-list-button-edit"
    );
  }

  async goto() {
    await this.page.goto("/course-outline");
  }

  async getNumberOfRecords() {
    const records = await this.allCards.all();

    return records.length;
  }
}
