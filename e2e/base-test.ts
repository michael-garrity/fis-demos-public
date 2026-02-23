/* eslint-disable react-hooks/rules-of-hooks */

import { test as base } from "@playwright/test";
import { DashboardPage } from "./pages/dashboard.pom";
import { ROUTES } from "./routes";
import { NavigationPage } from "./pages/navigation.pom";
import { QuizListPage } from "./pages/demos/quiz-generator/quizList.pom";
import { LearnerProfilesPage } from "./pages/learnerProfiles.pom";
import { CourseOutlineListPage } from "./pages/demos/course-outline/courseOutlineList.pom";
import { PersonalizedContentPage } from "./pages/demos/personalizedContent.pom";
import { AccountPage } from "./pages/account.pom";
import { MobileNavigationPage } from "./pages/mobileNavigation.pom";
import { CourseOutlineCreatePage } from "./pages/demos/course-outline/courseOutlineCreate.pom";
import { LessonPlanPage } from "./pages/demos/lesson-plan/lessonPlan.pom";
import { LessonPlanCreatePage } from "./pages/demos/lesson-plan/lessonPlanCreate.pom";
import { QuizCreatePage } from "./pages/demos/quiz-generator/quizCreate.pom";
import { LessonGeneratorListPage } from "./pages/demos/lesson-generator/lessonGeneratorList.pom";

type CustomFixtures = {
  // Dashboard
  dashboardPage: DashboardPage;

  // Navigation
  navigationPage: NavigationPage;
  accountPage: AccountPage;
  learnerProfilesPage: LearnerProfilesPage;
  mobileNavigationPage: MobileNavigationPage;

  // Demos
  personalizedContentPage: PersonalizedContentPage;

  // Course Outline Generator
  courseOutlineListPage: CourseOutlineListPage;
  courseOutlineCreatePage: CourseOutlineCreatePage;

  // Lesson Plan Generator
  lessonPlanPage: LessonPlanPage;
  lessonPlanCreatePage: LessonPlanCreatePage;

  // Quiz Generator
  quizListPage: QuizListPage;
  quizCreatePage: QuizCreatePage;

  // Lesson Generator
  lessonGeneratorListPage: LessonGeneratorListPage;
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
  learnerProfilesPage: async ({ page }, use) => {
    const learnerProfilesPage = new LearnerProfilesPage(page);
    await use(learnerProfilesPage);
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
  personalizedContentPage: async ({ page }, use) => {
    const personalizedContentPage = new PersonalizedContentPage(page);
    await use(personalizedContentPage);
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

  //Lesson Plan Generator
  lessonPlanPage: async ({ page }, use) => {
    const lessonPlanPage = new LessonPlanPage(page);
    await use(lessonPlanPage);
  },
  lessonPlanCreatePage: async ({ page }, use) => {
    const lessonPlanCreatePage = new LessonPlanCreatePage(page);
    await use(lessonPlanCreatePage);
  },

  //Quiz Generator
  quizListPage: async ({ page }, use) => {
    const quizListPage = new QuizListPage(page);
    await use(quizListPage);
  },

  quizCreatePage: async ({ page }, use) => {
    const quizCreatePage = new QuizCreatePage(page);
    await use(quizCreatePage);
  },

  // Lesson Generator
  lessonGeneratorListPage: async ({ page }, use) => {
    const lessonGeneratorListPage = new LessonGeneratorListPage(page);
    await use(lessonGeneratorListPage);
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
