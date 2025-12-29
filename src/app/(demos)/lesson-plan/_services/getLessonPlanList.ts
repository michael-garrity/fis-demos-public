import { LessonPlanRecord } from "@/types/demos/lesson-plan";

/**
 * Fetches the list of lesson plan (LessonPlanRecord array).
 * Corresponds to: GET /lesson-plan
 */
export const getLessonPlanList = async (): Promise<LessonPlanRecord[]> => {
  const response = await fetch("/api/lesson-plan");
  if (!response.ok) {
    throw new Error("Failed to fetch lesson plan list.");
  }
  return await response.json();
};
