import { BaseListRecord, Database } from "@/types";

export interface QuizRecord extends BaseListRecord {
  title: string;
  description: string;
  numberOfQuestions: number;
  learnerProfileId: string;
  sourceLessonId: string
}

export interface QuizDetail extends QuizRecord {
  questions: Question[];
}

export interface QuizFormState extends QuizRecord {
  customization: string;
}

export type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"]

export interface Answer {
  text: string;
  feedback: string; 
}

export interface Question {
  question:  string;
  answer: Answer;
  distractors: Answer[];
}
