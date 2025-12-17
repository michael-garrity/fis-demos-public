import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { lessonKeys } from "./keys";

const createLessonPlan= async (
  newLessonData: LessonPlanRecord
): Promise<LessonPlanRecord> => {
  const response = await fetch("/api/lesson-plan/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newLessonData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create course: ${errorText}`);
  }
  return response.json();
};

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
