import { CourseOutlineRow, CourseOutline } from "../_models";

export async function getCourseOutlines() {
  const res = await fetch("/api/course-outlines");
  if (!res.ok) throw new Error("Failed to fetch course outlines list");

  const rows: CourseOutlineRow[] = await res.json();
  return rows.map((row) => new CourseOutline(row));
}
