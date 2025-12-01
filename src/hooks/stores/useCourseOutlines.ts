import { useQuery } from "@tanstack/react-query";
import { CourseOutlineRecord } from "@/types";

// Define the unique key for this query's cache
export const COURSE_OUTLINES_QUERY_KEY = ["courseOutlines"];

// Define the async function that performs the actual fetch operation
const fetchCourseOutlines = async (): Promise<CourseOutlineRecord[]> => {
  const response = await fetch("/api/demos/course-outline");

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
export const useCourseOutlines = () => {
  return useQuery({
    queryKey: COURSE_OUTLINES_QUERY_KEY, // The unique key for caching
    queryFn: fetchCourseOutlines, // The function to execute
  });
};
