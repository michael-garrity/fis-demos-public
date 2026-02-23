import { Lesson } from "../_models";
import { lessonKeys } from "./keys";
import { getLessons } from "../_services";
import { useQuery } from "@tanstack/react-query";

export const useLessons = () => {
  const query = useQuery<Lesson[], Error>({
    queryKey: lessonKeys.list(),
    queryFn: getLessons,
  });

  return query;
};
