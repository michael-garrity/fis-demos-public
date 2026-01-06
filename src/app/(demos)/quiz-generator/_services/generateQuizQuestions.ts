import { QuestionOutput } from "@/lib/llm-generation/schemas/quiz.zod";
import { QuizGenerationState } from "@/types";

export const generateQuizQuestions = async (
  newQuizData: QuizGenerationState
): Promise<QuestionOutput> => {
  const response = await fetch("/api/quizzes/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newQuizData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create questions: ${errorText}`);
  }

  return response.json();
};
