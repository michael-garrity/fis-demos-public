"use client"

import ListView from "../_components/List";
import QuizListRecord from "./_components/QuizListRecord";
import { useQuizList } from "./_store";
import { Quiz } from "./_models";

export default function QuizGeneratorDemoPage() {
  const { data: quizzes, isLoading, isError, error } = useQuizList();
  
    if (isError) {
      return <p>Error loading quizzes: {error.message}</p>;
    }

  return (
    <ListView<Quiz>
          records={quizzes ?? []}
          title="Quiz Generator"
          createNewRoute="/quiz-generator/create"
          RenderItem={QuizListRecord}
          isLoading={isLoading}
        />
  )
}
