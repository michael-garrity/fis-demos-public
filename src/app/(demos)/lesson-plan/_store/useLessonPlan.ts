import { getLessonPlan } from "../_services/getLessonPlan";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { lessonKeys } from "./keys";

/**
 * Hook to fetch an individual CourseOutline.
 */
export const useLessonPlan = (id: string) => {
  const queryClient = useQueryClient();
  const cache = queryClient.getQueryData<LessonPlanRecord[]>(lessonKeys.list());
  const placeholderData = cache?.find((lesson) => lesson.id === id);

  return useQuery<LessonPlanRecord, Error>({
    placeholderData,
    queryKey: lessonKeys.detail(id),
    queryFn: () => getLessonPlan(id),
    enabled: !!id,
  });
};
