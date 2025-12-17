import { useMutation } from "@tanstack/react-query";
import { courseKeys } from "./keys";
import { generateCourseOutline } from "../_services";

/**
 * Hook for generating a new Course Outline record
 */
export const useGenerateCourseOutline = () => {
  return useMutation({
    mutationKey: courseKeys.create(),
    mutationFn: generateCourseOutline,
  });
};
