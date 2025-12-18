import { Locator, Page } from "@playwright/test";

export class NavigationPage {
  // Top-Level Navigation Elements
  readonly dashboardButton: Locator;
  readonly learnerProfilesButton: Locator;

  readonly accountButton: Locator;

  constructor(readonly page: Page) {
    // Top-Level Navigation Elements
    this.dashboardButton = page.getByRole("link", { name: "Dashboard" });
    this.learnerProfilesButton = page.getByRole("link", {
      name: "Learner Profiles",
    });

    this.accountButton = page.getByTestId("account");
  }
}
