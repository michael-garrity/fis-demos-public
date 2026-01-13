import { useMutation } from "@tanstack/react-query";
import { personalizedContentKeys } from "./keys";
import { generatePersonalizedContent } from "../services/generatePersonalizedContent";

/**
 * Hook for generating a new Personalized Content record
 */
export const useGeneratePersonalizedContent = () => {
  return useMutation({
    mutationKey: personalizedContentKeys.create(),
    mutationFn: generatePersonalizedContent,
  });
};
