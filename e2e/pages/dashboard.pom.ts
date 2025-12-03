import { Locator, Page } from "@playwright/test";

export class DashboardPage {
  // Page Hero Elements
  readonly heading: Locator;
  readonly introText: Locator;

  // Quiz Generator Card Elements
  readonly quizGeneratorCardButton: Locator;
  readonly quizGeneratorDescription: Locator;

  // Content Mapping Card Elements
  readonly courseOutlineCardButton: Locator;
  readonly courseOutlineDescription: Locator;

  // Personalized Content Card Elements
  readonly personalizedContentCardButton: Locator;
  readonly personalizedContentDescription: Locator;

  constructor(readonly page: Page) {
    // Page Hero Elements
    this.heading = page.getByRole("heading", {
      name: "Adaptive Learning",
    });
    this.introText = page.getByText(
      /Experience the future of creation. Our adaptive content generation tools intelligently tailor output to fit any need, making content unique and relevant every time./i
    );

    // Quiz Generator Card Elements
    this.quizGeneratorCardButton = page
      .getByRole("button", { name: "View Demo" })
      .nth(0);
    this.quizGeneratorDescription = page.getByText(
      /Transform any content into a personalized, adaptive/i
    );

    // Content Mapping (Lesson Planning) Card Elements
    this.courseOutlineCardButton = page
      .getByRole("button", { name: "View Demo" })
      .nth(1);
    this.courseOutlineDescription = page.getByText(
      /Quickly generate a full, adaptable course outline/i
    );

    // Personalized Content Card Elements
    this.personalizedContentCardButton = page
      .getByRole("button", { name: "View Demo" })
      .nth(2);
    this.personalizedContentDescription = page.getByText(
      /Instantly rewrite any text or document into a format, tone/i
    );
  }

  public async visitQuizGeneratorDemo(): Promise<void> {
    return await this.quizGeneratorCardButton.click();
  }

  public async visitLessonPlannerDemo(): Promise<void> {
    return await this.courseOutlineCardButton.click();
  }

  public async visitPersonalizedContentDemo(): Promise<void> {
    return await this.personalizedContentCardButton.click();
  }
}
