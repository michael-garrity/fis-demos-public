import { CourseOutline } from "../_models";
import { courseKeys } from "./keys";
import { getCourseOutlines } from "../_services";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch the list of CourseOutlines
 */
export const useCourseOutlines = () => {
  const query = useQuery<CourseOutline[], Error>({
    queryKey: courseKeys.list(),
    queryFn: getCourseOutlines,
  });

  return query;
};
