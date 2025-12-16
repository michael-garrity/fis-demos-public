import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonalizedContentRecord, PersonalizedContentFormState} from "@/types";
import { personalizedContentKeys } from "./keys";

const createPersonalizedContent = async (
  newContentData: PersonalizedContentFormState
): Promise<PersonalizedContentRecord> => {
    // change api later
  const response = await fetch("/api/personalized-content/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newContentData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create personalized content: ${errorText}`);
  }
  return response.json();
};

/**
 * Hook for creating a new Personalized Content record, invalidating the list cache upon success.
 */
export const useCreatePersonalizedContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: personalizedContentKeys.create(),
    mutationFn: createPersonalizedContent,
    onSuccess: (newContent: PersonalizedContentRecord) => {
      // 1. Manually retrieve the old list data from the cache
      const existingContent = queryClient.getQueryData(personalizedContentKeys.list());

      // 2. If the data exists, update it by prepending the new content
      if (existingContent) {
        queryClient.setQueryData(
          personalizedContentKeys.list(),
          (oldContent: PersonalizedContentRecord[]) => [newContent, ...oldContent]
        );
      }
    },
  });
};
