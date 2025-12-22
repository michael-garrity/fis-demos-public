import { useQuery } from "@tanstack/react-query";
import { getLearnerProfiles } from "@/lib/learner-profiles";

/**
 * Custom hook to fetch and manage the cache of learner profiles.
 * Provides data, loading, and error states directly to any component that calls it.
 */
export const useLearnerProfiles = () => {
  return useQuery({
    queryKey: ["learnerProfiles"],
    queryFn: getLearnerProfiles,
  });
};
