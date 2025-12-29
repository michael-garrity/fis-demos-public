import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonalizedContentRecord } from "@/types";
import { personalizedContentKeys } from "./keys";
import { savePersonalizedContent } from "../_services";

/**
 * Hook for saving a Personalized Content record.
 * Adds the personalized content to the existing list cache on success.
 */
export const useSavePersonalizedContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: personalizedContentKeys.save(),
    mutationFn: savePersonalizedContent,
    onSuccess: (newPersonalizedContent: PersonalizedContentRecord) => {
      const existingContent = queryClient.getQueryData(personalizedContentKeys.list());

      if (existingContent) {
        queryClient.setQueryData(
          personalizedContentKeys.list(),
          (old: PersonalizedContentRecord[]) => [newPersonalizedContent, ...old]
        );
      }
    },
  });
};
