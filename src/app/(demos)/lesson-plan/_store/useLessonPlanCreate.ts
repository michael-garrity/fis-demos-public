import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { createLessonPlan } from "../_services/createLessonPlan";
import { lessonKeys } from "./keys";

/**
 * Hook for creating a new Lesson Plan record, invalidating the list cache upon success.
 */
export const useCreateLessonPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: lessonKeys.create(),
    mutationFn: createLessonPlan,
    onSuccess: (newCourse: LessonPlanRecord) => {
      const existingContent = queryClient.getQueryData(lessonKeys.list());

      if (existingContent) {
        queryClient.setQueryData(
          lessonKeys.list(),
          (old: LessonPlanRecord[] = []) => [newCourse, ...(old ?? [])]
        );
      }
    },
  });
};
