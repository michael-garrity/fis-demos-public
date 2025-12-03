import { useQuery } from "@tanstack/react-query";
import { CourseOutlineRecord } from "@/types"; // Assuming CourseOutlineRecord is defined here
import { courseKeys } from "./keys";

const fetchCourseOutlines = async (): Promise<CourseOutlineRecord[]> => {
  const response = await fetch("/api/course-outlines");

  if (!response.ok) {
    throw new Error("Failed to fetch course outlines");
  }

  return response.json();
};

export const useCourseOutlines = () => {
  return useQuery({
    queryKey: courseKeys.list(),
    queryFn: fetchCourseOutlines,
  });
};
