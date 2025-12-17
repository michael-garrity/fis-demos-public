// Quiz API Logic (e.g., in a file like src/api/quiz.ts)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quizKeys } from "./keys";
import { QuizRow } from "@/types/demos/quiz-generator";
import { deleteQuiz } from "../_fetchers";

/**
 * Hook for deleting an existing Quiz.
 * @returns The mutation object. The success handler receives the ID (string) of the deleted quiz.
 */
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: quizKeys.delete(),
    mutationFn: deleteQuiz,
    onSuccess: (deletedId: string) => {
      // 1. Manually invalidate or remove the specific detail cache entry
      // Removing is cleaner than invalidating for a deleted item:
      queryClient.removeQueries({ queryKey: quizKeys.detail(deletedId) });

      // 2. Manually update the list cache to remove the deleted item (Optimistic/Manual Update)
      queryClient.setQueryData(
        quizKeys.list(),
        (old: QuizRow[] | undefined) => {
          if (!old) return undefined;

          // Filter out the deleted course from the list
          return old.filter((quiz) => quiz.id !== deletedId);
        }
      );
    },
    onError: (error) => {
      // Log the error message or display a notification
      console.error("Course deletion failed:", error);
    },
  });
};
