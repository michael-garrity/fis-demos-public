import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { LessonPlanUpdate } from "@/types/demos/lesson-plan";

/**
 * API function to update an existing Lesson Plan record
 */
export async function putLessonPlan(lessonPlan: LessonPlanUpdate) {
  const res = await fetch(`/api/lesson-plan/${lessonPlan.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lessonPlan),
  });

  if (!res.ok) {
    const { error }: { error: string } = await res.json();
    throw new Error(
      `Failed to update lesson plan '${lessonPlan.id}': ${error}`
    );
  }

  const row: LessonPlanRecord = await res.json();
  return row;
}
