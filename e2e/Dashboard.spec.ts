import { test, expect } from "./base-test";
import { ROUTES } from "./routes";

test("1. Renders the main Adaptive Learning headline and intro text", async ({
  dashboardPage,
}) => {
  // 1. Verify the main structural headline
  await expect(dashboardPage.heading).toBeVisible();

  // 2. Verify the presence of the descriptive text
  await expect(dashboardPage.introText).toBeVisible();
});

test("2. Renders all three Demo Cards with correct titles and links", async ({
  page,
  dashboardPage,
}) => {
  // Test 1: Verify all three demo card titles are visible
  await expect(dashboardPage.quizGeneratorCardButton).toBeVisible();
  await expect(dashboardPage.contentMappingCardButton).toBeVisible();
  await expect(dashboardPage.personalizedContentCardButton).toBeVisible();

  // Test 2: Verify the Quiz Generator card is linked correctly and has the description
  const quizCardButton = dashboardPage.quizGeneratorCardButton;

  // ACT: Click the Quiz Generator's View Demo button
  await quizCardButton.click();

  // ASSERTION: Verify the resulting URL matches the expected href
  await expect(page).toHaveURL("/quiz-generator");
});

test("3. Shows the correct description for each tool", async ({ page }) => {
  // Test 3: Check for the descriptions (verifies data integrity)
  await expect(
    page.getByText(/Transform any content into a personalized, adaptive/i)
  ).toBeVisible();

  await expect(
    page.getByText(/Quickly generate a full, adaptable course outline./i)
  ).toBeVisible();

  await expect(
    page.getByText(
      /Instantly rewrite any text or document into a format, tone/i
    )
  ).toBeVisible();
});

// --- Test Group 1: Demo Card Navigation ---

test("4. Quiz Generator card navigates to /quiz-generator and verifies the heading", async ({
  page,
}) => {
  // Find the button inside the Quiz Generator card (first button on the page)
  const quizCardButton = page.getByRole("button", { name: "View Demo" }).nth(0);

  await quizCardButton.click();

  // ASSERTION: Verify URL change
  await expect(page).toHaveURL(ROUTES.quizGenerator);

  // ASSERTION: Verify the content on the new page
  await expect(
    page.getByRole("heading", { name: "Quiz Generator Demo" })
  ).toBeVisible();
});

test("5. Content Mapping card navigates to /course-outline and verifies the heading", async ({
  page,
  courseOutlinePage,
}) => {
  // Find the button inside the Content Mapping card (second button on the page)
  const contentCardButton = page
    .getByRole("button", { name: "View Demo" })
    .nth(1);

  await contentCardButton.click();

  // ASSERTION: Verify URL change
  await expect(page).toHaveURL(ROUTES.courseOutline);

  // ASSERTION: Verify the content on the new page
  await expect(courseOutlinePage.heading).toBeVisible();
});

test("6. Personalized Content card navigates to /personalized-content and verifies the heading", async ({
  page,
}) => {
  // Find the button inside the Personalized Content card (third button on the page)
  const personalizedCardButton = page
    .getByRole("button", { name: "View Demo" })
    .nth(2);

  await personalizedCardButton.click();

  // ASSERTION: Verify URL change
  await expect(page).toHaveURL(ROUTES.personalizedContent);

  // ASSERTION: Verify the content on the new page
  await expect(
    page.getByRole("heading", { name: "Personalized Content Demo" })
  ).toBeVisible();
});
