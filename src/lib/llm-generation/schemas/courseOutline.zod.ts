import { z } from "zod";

export const CourseOutlineSchema = z.object({
  title: z.string(),
  description: z.string(),
  lesson_outlines: z.array(
    z.object({
      title: z.string(),
      outcome: z.string(),
      description: z.string(),
      minutes: z.number().int(),
    })
  ),
});

export type CourseOutlineOutput = z.infer<typeof CourseOutlineSchema>;
