import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseOutlineRecord } from "@/types";
import { courseKeys } from "./keys";
import { saveCourseOutline } from "../_services";

/**
 * Hook for saving a Course Outline record.
 * Adds the course outline to the existing list cache on success.
 */
export const useSaveCourseOutline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: courseKeys.save(),
    mutationFn: saveCourseOutline,
    onSuccess: (newCourse: CourseOutlineRecord) => {
      const existingCourses = queryClient.getQueryData(courseKeys.list());

      if (existingCourses) {
        queryClient.setQueryData(
          courseKeys.list(),
          (old: CourseOutlineRecord[]) => [newCourse, ...old]
        );
      }
    },
  });
};
