import { Locator, Page } from "@playwright/test";

export class LearnerProfilesPage {
  readonly heading: Locator;
  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Learner Profiles" });
  }
}
