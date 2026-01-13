import { PersonalizedContent } from "../models/PersonalizedContent";
import { personalizedContentKeys } from "./keys";
import { putPersonalizedContent } from "../services/putPersonalizedContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for updating an existing Personalized Content record,
 * updating both the specific detail cache and the list cache upon success.
 */
export const useUpdatePersonalizedContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: personalizedContentKeys.update(),
    mutationFn: putPersonalizedContent,
    onSuccess: (updatedPersonalizedContent: PersonalizedContent) => {
      // Manually update the specific detail view cache
      // This ensures the page viewing the personalized content details immediately reflects the change.
      queryClient.setQueryData(
        personalizedContentKeys.detail(updatedPersonalizedContent.id),
        updatedPersonalizedContent
      );

      // Manually update the list cache for a faster UX (no refetch)
      queryClient.setQueryData(
        personalizedContentKeys.list(),
        (old: PersonalizedContent[] | undefined) => {
          if (!old) return undefined;

          // Find the index of the updated personalized content and replace it
          return old.map((content) =>
            content.id === updatedPersonalizedContent.id ? updatedPersonalizedContent : content
          );
        }
      );
    },
    onError: (error) => {
      console.error("Personalized content update failed:", error);
    },
  });
};
