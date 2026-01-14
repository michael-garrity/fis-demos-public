import { factory } from "@/test";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Quiz } from "../../_models";
import { Question } from "@/types";
import { useEditQuiz } from "./useEditQuiz";
import { act, renderHook } from "@testing-library/react";

const question: Question = {
  question: "Example?",
  answers: [{text: "True", feedback: "", correct: true}, {text: "False", feedback: "", correct: false}]
}

const builtQuiz = new Quiz(factory.build("quiz", {
  questions: [question]
}));

const mutateFunc = vi.fn()

vi.mock("../../_store/", () => ({
  useQuiz: vi.fn(() => ({
    data: builtQuiz,
    isFetching: false,
    error: null,
    status: "success",
  })),
  useUpdateQuiz: vi.fn(() => ({
    mutate: mutateFunc,
    isPending: false,
    isSuccess: true,
  })),
}));

describe("useEditQuiz", () => {
  let hook: ReturnType<typeof renderHook>;
  const state = () => hook.result.current as ReturnType<typeof useEditQuiz>

  beforeEach(() => {
    mutateFunc.mockClear()
    hook = renderHook(() => useEditQuiz(""));
  });

  test("should start with an equivalent quiz", () => {
    const quiz = state().quiz;
    expect(quiz).toBeDefined();
    expect(quiz).toBeInstanceOf(Quiz);

    expect(quiz).toBe(builtQuiz);
  })

  test("updates isModified when modified", () => {
    const quiz = state().quiz!;
    act(() => {
      state().handleTopLevelChange("title", quiz.title + "+")
    })

    expect(state().isModified).toBe(true)
  })

  test("should cancel any changes when cancelChanges is called", () => {
    const quiz = state().quiz!;

    act(() => {
      state().handleTopLevelChange("title", quiz.title + "+")
      state().cancelChanges();
    })

    expect(state().quiz).toBe(builtQuiz);
  })

  test("updates quiz title and description", () => {
    const quiz = state().quiz!;
    const newTitle = `Changed Title: ${quiz.title}`;
    const newDescription = `Changed Description: ${quiz.description}`;

    act(() => {
      state().handleTopLevelChange("title", newTitle);
      state().handleTopLevelChange("description", newDescription);
    })

    expect(state().quiz?.title).toBe(newTitle);
    expect(state().quiz?.description).toBe(newDescription)
  })

  test("updates question", () => {
    const quiz = state().quiz!;
    const newQuestion = `Updated Question: ${quiz.questions[0].question}`;
    
    act(() => {
      state().handleQuestionChange(0)("question", newQuestion)
    })


    expect(state().quiz?.questions[0].question).toBe(newQuestion);
  })

  test("updates answer text and feedback", () => {
    const quiz = state().quiz!;
    const answer = quiz.questions[0].answers[0];
    const newAnswerText = `Updated Text: ${answer.text}`
    const newAnswerFeedback = `Updated Feedback: ${answer.feedback}`;
    
    act(() => {
      const updateAnswer = state().handleAnswerChange(0)(0)
      updateAnswer("text", newAnswerText);
      updateAnswer("feedback", newAnswerFeedback);
    })

    const updatedAnswer = state().quiz!.questions[0].answers[0];
    expect(updatedAnswer.text).toBe(newAnswerText);
    expect(updatedAnswer.feedback).toBe(newAnswerFeedback);
  })

  test("updates correct answer to the new answer", () => {
    const quiz = state().quiz!;

    const newCorrectIndex = quiz.questions[0].answers.findIndex((a) => !a.correct);

    act(() => {
      state().handleCorrectAnswerChange(0)(newCorrectIndex);
    })

    const answers = state().quiz!.questions[0].answers;

    expect(answers[newCorrectIndex].correct).toBe(true)
    expect(answers.every((answer, index) => !answer.correct || index === newCorrectIndex )).toBe(true)
      //This ensures that only the answer at newCorrectIndex is marked correct
  })

  test("calls mutate when asked to save", () => {
    act(() => {
      state().saveChanges()
    })

    expect(mutateFunc).toHaveBeenCalledOnce()
  })
});
