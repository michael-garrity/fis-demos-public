import { Locator, Page } from "@playwright/test";

export class NavigationPage {
  // Top-Level Navigation Elements
  readonly dashboardButton: Locator;
  readonly managePersonasButton: Locator;

  readonly accountButton: Locator;

  constructor(readonly page: Page) {
    // Top-Level Navigation Elements
    this.dashboardButton = page.getByRole("link", { name: "Dashboard" });
    this.managePersonasButton = page.getByRole("link", {
      name: "Manage Personas",
    });

    this.accountButton = page.getByTestId("account");
  }
}
