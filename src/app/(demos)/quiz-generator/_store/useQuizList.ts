import { useQuery } from "@tanstack/react-query";
import { quizKeys } from "./keys";
import { getQuizzes } from "../_fetchers";
import { Quiz } from "../_models";

/**
 * Hook to fetch the list of QuizRecord summaries.
 */
export const useQuizList = () => {
  const query = useQuery<Quiz[], Error>({
    queryKey: quizKeys.list(),
    queryFn: getQuizzes,
  });

  return query;
};
