import { CourseOutlineOutput } from "@/lib/llm-generation/schemas/courseOutline.zod";
import { CourseOutlineRecord } from "@/types";

export const saveCourseOutline = async (
  generatedCourseOutlineOutput: CourseOutlineOutput & {
    creation_meta: Record<string, unknown>;
  }
): Promise<CourseOutlineRecord> => {
  const response = await fetch("/api/course-outlines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(generatedCourseOutlineOutput),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save course: ${errorText}`);
  }

  return response.json();
};
