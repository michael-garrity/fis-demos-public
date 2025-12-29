import { PersonalizedContent } from "../_models";
import { personalizedContentKeys } from "./keys";
import { deletePersonalizedContent } from "../_services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for deleting an existing Personalized Content record.
 * @returns The mutation object. The success handler receives the the personalized content
 * object that was deleted.
 */
export const useDeletePersonalizedContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: personalizedContentKeys.delete(),
    mutationFn: deletePersonalizedContent,
    onSuccess: (deleted: PersonalizedContent) => {
      // 1. Manually invalidate or remove the specific detail cache entry
      // Removing is cleaner than invalidating for a deleted item:
      queryClient.removeQueries({ queryKey: personalizedContentKeys.detail(deleted.id) });

      // 2. Manually update the list cache to remove the deleted item (Optimistic/Manual Update)
      queryClient.setQueryData(
        personalizedContentKeys.list(),
        (cache: PersonalizedContent[] | undefined) => {
          if (!cache) return undefined;

          return cache.filter((cached) => cached.id !== deleted.id);
        }
      );
    },
    onError: (error) => {
      // Log the error message or display a notification
      console.error("Personalized content deletion failed:", error);
    },
  });
};
