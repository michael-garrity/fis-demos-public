// Lesson Plan API Logic

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { lessonKeys } from "./keys";

/**
 * API function to delete an existing Lesson Plan record by ID.
 * @param id The ID of the course outline to delete.
 */
const deleteLessonPlan = async (id: string): Promise<string> => {
  const response = await fetch(`/api/lesson-plan/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete course (ID: ${id}): ${errorText}`);
  }

  return id;
};

/**
 * Hook for deleting an existing Lesson Plan record.
 * @returns The mutation object. The success handler receives the ID (string) of the deleted lesson.
 */
export const useDeleteLessonPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: lessonKeys.delete(),
    mutationFn: deleteLessonPlan,
    onSuccess: (deletedId: string) => {
      // 1. Manually invalidate or remove the specific detail cache entry
      // Removing is cleaner than invalidating for a deleted item:
      queryClient.removeQueries({ queryKey: lessonKeys.detail(deletedId) });

      // 2. Manually update the list cache to remove the deleted item (Optimistic/Manual Update)
      queryClient.setQueryData(
        lessonKeys.list(),
        (old: LessonPlanRecord[] | undefined) => {
          if (!old) return undefined;

          // Filter out the deleted course from the list
          return old.filter((course) => course.id !== deletedId);
        }
      );
    },
    onError: (error) => {
      // Log the error message or display a notification
      console.error("Lesson deletion failed:", error);
    },
  });
};
