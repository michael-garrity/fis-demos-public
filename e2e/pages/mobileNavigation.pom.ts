import { Locator, Page } from "@playwright/test";

export class MobileNavigationPage {
  // Open/Close Button
  readonly openMenuButton: Locator;
  readonly closeMenuButton: Locator;

  // Menu Buttons/Links
  readonly dashboardLink: Locator;
  readonly learnerProfilesLink: Locator;

  constructor(readonly page: Page) {
    // Open/Close Button
    this.openMenuButton = page.getByRole("button", {
      name: /open menu/i,
    });
    this.closeMenuButton = page.getByRole("button", {
      name: /close menu/i,
    });

    // Menu Buttons/Links
    this.dashboardLink = page.getByTestId("mobile-navigation-link-dashboard");
    this.learnerProfilesLink = page.getByTestId(
      "mobile-navigation-link-learner-profiles"
    );
  }
}
