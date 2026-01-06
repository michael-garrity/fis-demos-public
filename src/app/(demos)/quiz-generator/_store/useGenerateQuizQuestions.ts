import { useMutation } from "@tanstack/react-query";
import { quizKeys } from "./keys";
import { generateQuizQuestions } from "../_services";

/**
 * Hook for generating a new set of questions
 */
export const useGenerateQuizQuestions = () => {
  return useMutation({
    mutationKey: quizKeys.generate(),
    mutationFn: generateQuizQuestions,
  });
};
