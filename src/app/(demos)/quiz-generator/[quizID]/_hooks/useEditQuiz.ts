import { SetStateAction, useState } from "react";
import { Quiz } from "@demos/quiz-generator/_models";
import { useQuiz, useUpdateQuiz } from "../../_store";
import { Answer, Question } from "@/types";

const isEqual = (
  a?: Quiz,
  b?: Quiz
): boolean => JSON.stringify(a) !== JSON.stringify(b)


export const useEditQuiz = (id: string) => {
  const { data, isFetching, error, status, } = useQuiz(id);
  const { mutate, isPending, isSuccess, } = useUpdateQuiz();

  const [state, setState] = useState<{
    quiz: Quiz | undefined;
    originalQuiz: Quiz | undefined;
    lastFetchedData: Quiz | undefined;
  }>({
    quiz: data,
    originalQuiz: data,
    lastFetchedData: data,
  });

  if (data !== state.lastFetchedData) {
    setState({
      quiz: data,
      originalQuiz: state.originalQuiz ?? data,
      lastFetchedData: data,
    });
  }

  const isModified = isEqual(state.quiz, state.originalQuiz);

  const setQuiz = (quiz: SetStateAction<Quiz | undefined>) => {
    setState(prev => ({
      ...prev,
      quiz: typeof quiz === 'function' ?
        quiz(prev.quiz) : quiz,
    }));
  };

  const handleTopLevelChange = (name: "title" | "description", value: string) => {
    setQuiz((prev) => {
      if (!prev) return undefined;

      return prev.with(name, value);
    });
  }

  const handleQuestionChange = (index: number) => 
    <K extends keyof Question>(field: K, value: Question[K]) => { //May de-partial application this
      setQuiz((prev) => {
        if (!prev) return undefined;

        return prev.withQuestion(index, { [field]: value });
      });
  }

  const handleAnswerChange = (questionIndex: number) => (answerIndex: number) =>
    <K extends keyof Answer>(field: K, value: Answer[K]) => { //See above
      setQuiz((previous) => {
        if (!previous) return undefined;
        return previous.withAnswer(questionIndex, answerIndex, { [field]: value })
      })
  }

  const handleCorrectAnswerChange = (questionIndex: number) => (correctAnswerIndex: number) => {
    setQuiz((previous) => {
      if (!previous) return undefined;
      return previous.withCorrectAnswer(questionIndex, correctAnswerIndex)
    })
  }

  const saveChanges = () => {
    if (!state.quiz) return;

    mutate(state.quiz, {
      onSuccess: (updatedData) => {
        setState({
          quiz: updatedData,
          originalQuiz: updatedData,
          lastFetchedData: updatedData,
        })
      },
      onError: (err) => {
        console.error("Save failed:", err);
      },
    });
  }

  const cancelChanges = () => {
    if (state.originalQuiz) {
      setQuiz(state.originalQuiz);
    }
  };

  return {
    quiz: state.quiz,
    isModified,
    isPending,
    isFetching,
    error,
    isSuccess,
    status,
    handleTopLevelChange,
    handleQuestionChange,
    handleAnswerChange,
    handleCorrectAnswerChange,
    saveChanges,
    cancelChanges,
  };
};
