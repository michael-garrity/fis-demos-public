import { CourseOutline } from "../_models";
import { courseKeys } from "./keys";
import { putCourseOutline } from "../_services"
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for updating an existing Course Outline record,
 * updating both the specific detail cache and the list cache upon success.
 */
export const useUpdateCourseOutline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: courseKeys.update(),
    mutationFn: putCourseOutline,
    onSuccess: (updatedCourse: CourseOutline) => {
      // Manually update the specific detail view cache
      // This ensures the page viewing the course details immediately reflects the change.
      queryClient.setQueryData(
        courseKeys.detail(updatedCourse.id),
        updatedCourse
      );

      // Manually update the list cache for a faster UX (no refetch)
      queryClient.setQueryData(
        courseKeys.list(),
        (old: CourseOutline[] | undefined) => {
          if (!old) return undefined;

          // Find the index of the updated course and replace it
          return old.map((course) =>
            course.id === updatedCourse.id ? updatedCourse : course
          );
        }
      );
    },
    onError: (error) => {
      console.error("Course update failed:", error);
    },
  });
};
