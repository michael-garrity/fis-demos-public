/* eslint-disable react-hooks/rules-of-hooks */

import { test as base } from "@playwright/test";
import { DashboardPage } from "./pages/dashboard.pom";
import { ROUTES } from "./routes";
import { NavigationPage } from "./pages/navigation.pom";
import { ManagePersonasPage } from "./pages/managePersonas.pom";
import { QuizGeneratorPage } from "./pages/demos/quizGenerator.pom";
import { CourseOutlineListPage } from "./pages/demos/course-outline/courseOutlineList.pom";
import { PersonalizedContentPage } from "./pages/demos/personalizedContent.pom";
import { AccountPage } from "./pages/account.pom";
import { MobileNavigationPage } from "./pages/mobileNavigation.pom";
import { CourseOutlineCreatePage } from "./pages/demos/course-outline/courseOutlineCreate.pom";
import { LessonPlanPage } from "./pages/demos/lesson-plan/lessonPlan.pom";
import { LessonPlanCreatePage } from "./pages/demos/lesson-plan/lessonPlanCreate.pom";

type CustomFixtures = {
  // Dashboard
  dashboardPage: DashboardPage;

  // Navigation
  navigationPage: NavigationPage;
  managePersonasPage: ManagePersonasPage;
  accountPage: AccountPage;
  mobileNavigationPage: MobileNavigationPage;

  // Demos
  quizGeneratorPage: QuizGeneratorPage;
  personalizedContentPage: PersonalizedContentPage;
  lessonPlanPage: LessonPlanPage;
  lessonPlanCreatePage: LessonPlanCreatePage;

  // Course Outline Generator
  courseOutlineListPage: CourseOutlineListPage;
  courseOutlineCreatePage: CourseOutlineCreatePage;
};

// 📝 Define the global setup here
export const test = base.extend<CustomFixtures>({
  // Dashboard
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  // Navigation
  navigationPage: async ({ page }, use) => {
    const navigationPage = new NavigationPage(page);
    await use(navigationPage);
  },
  managePersonasPage: async ({ page }, use) => {
    const managePersonasPage = new ManagePersonasPage(page);
    await use(managePersonasPage);
  },
  accountPage: async ({ page }, use) => {
    const accountPage = new AccountPage(page);
    await use(accountPage);
  },
  mobileNavigationPage: async ({ page }, use) => {
    const mobileNavigationPage = new MobileNavigationPage(page);
    await use(mobileNavigationPage);
  },

  // Demos
  quizGeneratorPage: async ({ page }, use) => {
    const quizPage = new QuizGeneratorPage(page);
    await use(quizPage);
  },
  personalizedContentPage: async ({ page }, use) => {
    const personalizedContentPage = new PersonalizedContentPage(page);
    await use(personalizedContentPage);
  },
  lessonPlanPage: async ({ page }, use) => {
    const lessonPlanPage = new LessonPlanPage(page);
    await use(lessonPlanPage);
  },
  lessonPlanCreatePage: async ({ page }, use) => {
    const lessonPlanCreatePage = new LessonPlanCreatePage(page);
    await use(lessonPlanCreatePage);
  },

  // Course Outline Generator
  courseOutlineListPage: async ({ page }, use) => {
    const courseOutlineListPage = new CourseOutlineListPage(page);
    await use(courseOutlineListPage);
  },
  courseOutlineCreatePage: async ({ page }, use) => {
    const courseOutlineCreatePage = new CourseOutlineCreatePage(page);
    await use(courseOutlineCreatePage);
  },

  // Global/Default Page Setup
  page: async ({ page }, use) => {
    // Navigate to the dashboard before each test
    await page.goto(ROUTES.dashboard);
    await use(page);
  },
});

// Re-export the expect function
export { expect } from "@playwright/test";
