import { useQuery } from "@tanstack/react-query";
import { LearnerProfile } from "@/types";

// Define the unique key for this query's cache
export const LEARNER_PROFILES_QUERY_KEY = ["learnerProfiles"];

// Define the async function that performs the actual fetch operation
const fetchCourseOutlines = async (): Promise<LearnerProfile[]> => {
  const response = await fetch("/api/learner-profiles");

  if (!response.ok) {
    // Throwing an error here ensures useQuery correctly enters the 'isError' state
    throw new Error("Failed to fetch course outlines");
  }

  return response.json();
};

/**
 * Custom hook to fetch and manage the cache state for Course Outline Records.
 * Provides data, loading, and error states directly to any component that calls it.
 */
export const useLearnerProfiles = () => {
  return useQuery({
    queryKey: LEARNER_PROFILES_QUERY_KEY, // The unique key for caching
    queryFn: fetchCourseOutlines, // The function to execute
  });
};
