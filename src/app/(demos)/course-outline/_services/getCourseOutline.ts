import { CourseOutlineRow, CourseOutline } from "../_models";

export async function getCourseOutline(id: string) {
  const res = await fetch(`/api/course-outlines/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch course outline '${id}'`);

  const row: CourseOutlineRow = await res.json();
  return new CourseOutline(row);
}
