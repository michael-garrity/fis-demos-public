import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Lesson } from "../_models";
import { generateLesson } from "../_services";
import { lessonKeys } from "./keys";

export const useGenerateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: lessonKeys.generate(),
    mutationFn: generateLesson,
    onSuccess: (newLesson: Lesson) => {
      const existingLessons = queryClient.getQueryData(lessonKeys.list());

      if (existingLessons) {
        queryClient.setQueryData(
          lessonKeys.list(),
          (old: Lesson[] | undefined) => {
            if (!old) return [newLesson];
            return [newLesson, ...old];
          },
        );
      }
    },
  });
};
