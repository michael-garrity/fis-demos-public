import { QuizRow } from "@/types";
import { Quiz } from "../_models";

export async function getQuizzes() {
  const res = await fetch("/api/quizzes");
  if (!res.ok) throw new Error("Failed to fetch course outlines list");

  const rows: QuizRow[] = await res.json();
  return rows.map((row) => new Quiz(row));
}
