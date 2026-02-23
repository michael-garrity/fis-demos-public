import { Lesson, LessonRow } from "../_models";

export async function getLessons() {
  const res = await fetch("/api/lessons");
  if (!res.ok) throw new Error("Failed to fetch lessons list");

  const rows: LessonRow[] = await res.json();
  return rows.map((row) => new Lesson(row));
}
