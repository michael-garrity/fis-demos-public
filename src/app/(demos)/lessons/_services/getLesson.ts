import { Lesson, LessonRow } from "../_models";

export async function getLesson(id: string) {
  const res = await fetch(`/api/lessons/${id}`);
  if (!res.ok) throw new Error("Failed to fetch lesson");

  const row: LessonRow = await res.json();
  return new Lesson(row);
}
