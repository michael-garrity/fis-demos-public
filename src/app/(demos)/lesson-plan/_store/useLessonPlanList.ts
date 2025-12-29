import { useQuery } from "@tanstack/react-query";
import { lessonKeys } from "./keys";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { getLessonPlanList } from "../_services/getLessonPlanList";

/**
 * Hook to fetch the list of LessonPlanRecord summaries.
 */
export const useListLessonPlan = () => {
  const query = useQuery<LessonPlanRecord[], Error>({
    queryKey: lessonKeys.list(),
    queryFn: getLessonPlanList,
  });

  return query;
};
