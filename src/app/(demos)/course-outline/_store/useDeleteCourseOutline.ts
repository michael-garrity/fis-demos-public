// CourseOutline API Logic (e.g., in a file like src/api/course.ts)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseOutlineDetail } from "@/types";
import { courseKeys } from "./keys";

/**
 * API function to delete an existing Course Outline record by ID.
 * @param id The ID of the course outline to delete.
 */
const deleteCourseOutline = async (id: string): Promise<string> => {
  const response = await fetch(`/api/course-outlines/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete course (ID: ${id}): ${errorText}`);
  }

  return id;
};

/**
 * Hook for deleting an existing Course Outline record.
 * @returns The mutation object. The success handler receives the ID (string) of the deleted course.
 */
export const useDeleteCourseOutline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: courseKeys.delete(),
    mutationFn: deleteCourseOutline,
    onSuccess: (deletedId: string) => {
      // 1. Manually invalidate or remove the specific detail cache entry
      // Removing is cleaner than invalidating for a deleted item:
      queryClient.removeQueries({ queryKey: courseKeys.detail(deletedId) });

      // 2. Manually update the list cache to remove the deleted item (Optimistic/Manual Update)
      queryClient.setQueryData(
        courseKeys.list(),
        (old: CourseOutlineDetail[] | undefined) => {
          if (!old) return undefined;

          // Filter out the deleted course from the list
          return old.filter((course) => course.id !== deletedId);
        }
      );
    },
    onError: (error) => {
      // Log the error message or display a notification
      console.error("Course deletion failed:", error);
    },
  });
};
