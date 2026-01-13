import { useQuery } from "@tanstack/react-query";
import { personalizedContentKeys } from "./keys";
import { getPersonalizedContentList } from "../services/getPersonalizedContentList";
import { PersonalizedContent } from "../models/PersonalizedContent";
/**
 * Hook to fetch the list of Personalized Content.
 */
export const usePersonalizedContentList = () => {
  const query = useQuery<PersonalizedContent[], Error>({
    queryKey: personalizedContentKeys.list(),
    queryFn: getPersonalizedContentList,
  });

  return query;
};

