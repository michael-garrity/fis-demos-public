import { getCourseOutline } from "../_services";
import { CourseOutline } from "../_models";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { courseKeys } from "./keys";

/**
 * Hook to fetch an individual CourseOutline.
 */
export const useCourseOutline = (id: string) => {
  const queryClient = useQueryClient();
  const cache = queryClient.getQueryData<CourseOutline[]>(
    courseKeys.list()
  );
  const placeholderData = cache?.find((course) => course.id === id);

  return useQuery<CourseOutline, Error>({
    placeholderData,
    queryKey: courseKeys.detail(id),
    queryFn: () => getCourseOutline(id),
    enabled: !!id
  });
};
