// Lesson Plan API Logic

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { deleteLessonPlan } from "../_services/deleteLessonPlan";
import { lessonKeys } from "./keys";

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
