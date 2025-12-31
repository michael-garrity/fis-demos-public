import { LessonPlanRecord } from "@/types/demos/lesson-plan";

export const createLessonPlan = async (
  newLessonData: LessonPlanRecord
): Promise<LessonPlanRecord> => {
  const response = await fetch("/api/lesson-plan/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newLessonData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create course: ${errorText}`);
  }
  return response.json();
};
