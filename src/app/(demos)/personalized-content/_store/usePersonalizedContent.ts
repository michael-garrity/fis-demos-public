import { getPersonalizedContent } from "../_services";
import { PersonalizedContent } from "../_models";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { personalizedContentKeys } from "./keys";

/**
 * Hook to fetch an individual PersonalizedContent.
 */
export const usePersonalizedContent = (id: string) => {
  const queryClient = useQueryClient();
  const cache = queryClient.getQueryData<PersonalizedContent[]>(
    personalizedContentKeys.list()
  );
  const placeholderData = cache?.find((content) => content.id === id);

  return useQuery<PersonalizedContent, Error>({
    placeholderData,
    queryKey: personalizedContentKeys.detail(id),
    queryFn: () => getPersonalizedContent(id),
    enabled: !!id
  });
};
