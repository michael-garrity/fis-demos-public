import { CourseOutlineRow, CourseOutline } from "../_models";

/**
 * API function to update an existing Course Outline record.
 */
export async function putCourseOutline(courseOutline: CourseOutline) {
  const res = await fetch(`/api/course-outlines/${courseOutline.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseOutline.asUpdate()),
  });

  if (!res.ok) {
    const { error }: { error: string } = await res.json();
    throw new Error(
      `Failed to update course outline '${courseOutline.id}': ${error}`
    );
  }

  const row: CourseOutlineRow = await res.json();
  return new CourseOutline(row);
};


