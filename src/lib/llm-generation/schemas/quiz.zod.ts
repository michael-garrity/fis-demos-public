import { z } from "zod";

export const AnswerSchema = z.object({
  text: z.string().min(1),
  feedback: z.string(),
  correct: z.boolean()
})

export const QuestionSchema = z.object({
  question: z.string().min(1),
  answers: z.array(AnswerSchema).min(1)
})

export function generationSchema(questionCount: number) {
    return z.object({
        questions: z.array(QuestionSchema).length(questionCount)
    });
}

export type QuestionOutput = z.infer<ReturnType<typeof generationSchema>>
