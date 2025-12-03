import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseOutlineRecord, CourseOutlineFormState } from "@/types";
import { courseKeys } from "./keys";

const createCourseOutline = async (
  newCourseData: CourseOutlineFormState
): Promise<CourseOutlineRecord> => {
  const response = await fetch("/api/course-outlines/create", {
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

/**
 * Hook for creating a new Course Outline record, invalidating the list cache upon success.
 */
export const useCreateCourseOutline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: courseKeys.create(),
    mutationFn: createCourseOutline,
    onSuccess: (newCourse: CourseOutlineRecord) => {
      // 1. Manually retrieve the old list data from the cache
      const existingCourses = queryClient.getQueryData(courseKeys.list());

      // 2. If the data exists, update it by prepending the new course
      if (existingCourses) {
        queryClient.setQueryData(
          courseKeys.list(),
          (old: CourseOutlineRecord[]) => [newCourse, ...old]
        );
      }
    },
  });
};
