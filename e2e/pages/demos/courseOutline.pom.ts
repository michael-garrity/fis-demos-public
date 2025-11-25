import { Locator, Page } from "@playwright/test";

export class CourseOutlinePage {
  readonly heading: Locator;
  constructor(readonly page: Page) {
    this.heading = page.getByText("Course Outline Demo Page");
  }
}
