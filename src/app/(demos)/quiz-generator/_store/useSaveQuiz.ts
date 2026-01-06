import { useMutation } from "@tanstack/react-query";
import { quizKeys } from "./keys";
import { saveQuiz } from "../_services";

/**
 * Hook for creating a new Course Outline record, invalidating the list cache upon success.
 */
export const useSaveQuiz= () => {
  return useMutation({
    mutationKey: quizKeys.save(),
    mutationFn: saveQuiz,
  });
};
