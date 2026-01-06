import { QuizFormSubmission, QuizRow } from "@/types";
import { Quiz } from "../_models";

export async function saveQuiz (formData: QuizFormSubmission): Promise<Quiz> {
  const response = await fetch("/api/quizzes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create quiz: ${errorText}`);
  }

  const json: QuizRow = await response.json();

  return new Quiz(json)
};
