import { z } from "zod";

export const LessonSchema = z.object({
  introduction: z.string(),
  context: z.string(),
  example: z.string(),
  practice: z.string(),
  assessment: z.string(),
  reflection: z.string(),
});

export type LessonOutput = z.infer<typeof LessonSchema>;
