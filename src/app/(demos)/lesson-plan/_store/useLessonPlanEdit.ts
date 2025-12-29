import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { lessonKeys } from "./keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putLessonPlan } from "../_services/putLessonPlan";

/**
 * Hook for updating an existing Lesson Plan
 * updating both the specific detail cache and the list cache upon success.
 */
export const useLessonPlanEdit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: lessonKeys.update(),
    mutationFn: putLessonPlan,
    onSuccess: (updatedLesson: LessonPlanRecord) => {
      // Manually update the specific detail view cache
      // This ensures the page viewing the course details immediately reflects the change.
      queryClient.setQueryData(
        lessonKeys.detail(updatedLesson.id),
        updatedLesson
      );

      // Manually update the list cache for a faster UX (no refetch)
      queryClient.setQueryData(
        lessonKeys.list(),
        (old: LessonPlanRecord[] | undefined) => {
          if (!old) return undefined;

          // Find the index of the updated course and replace it
          return old.map((course) =>
            course.id === updatedLesson.id ? updatedLesson : course
          );
        }
      );
    },
    onError: (error) => {
      console.error("Lesson Plan edit failed:", error);
    },
  });
};
