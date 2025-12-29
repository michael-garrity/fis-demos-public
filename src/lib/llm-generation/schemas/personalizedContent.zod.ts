import { z } from "zod";

export const PersonalizedContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string(),
});

export type PersonalizedContentOutput = z.infer<typeof PersonalizedContentSchema>;
