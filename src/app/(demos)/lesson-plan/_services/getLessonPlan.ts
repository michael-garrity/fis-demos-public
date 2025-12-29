import { LessonPlanRecord } from "@/types/demos/lesson-plan";

/**
 * Fetches specific lesson plan (LessonPlanRecord).
 * Corresponds to: GET /lesson-plan/[id]
 */
export async function getLessonPlan(id: string) {
  const res = await fetch(`/api/lesson-plan/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch lesson plan '${id}'`);

  const row: LessonPlanRecord = await res.json();
  return row;
}
