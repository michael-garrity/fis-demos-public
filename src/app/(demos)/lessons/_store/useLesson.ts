import { useQuery } from "@tanstack/react-query";
import { getLesson } from "../_services";
import { lessonKeys } from "./keys";

export const useLesson = (id: string) => {
  const query = useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: () => getLesson(id),
    enabled: Boolean(id),
  });

  return query;
};
