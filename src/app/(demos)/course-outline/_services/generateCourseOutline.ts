import { CourseOutlineOutput } from "@/lib/llm-generation/schemas/courseOutline.zod";
import { CourseOutlineFormState } from "@/types";

export const generateCourseOutline = async (
  newCourseData: CourseOutlineFormState
): Promise<CourseOutlineOutput> => {
  const response = await fetch("/api/course-outlines/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCourseData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create course: ${errorText}`);
  }

  return response.json();
};
