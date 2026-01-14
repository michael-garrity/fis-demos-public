import EditableQuestion from "./EditableQuestion";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Question } from "@/types";

describe("LearnerProfileCard (Snapshot)", () => {
  it("should match snapshot", () => {
    const question: Question = {
      question: "Example?",
      answers: [{text: "True", feedback: "", correct: true}, {text: "False", feedback: "", correct: false}]
    }

    const { container } = render(
      <EditableQuestion 
        question={question} 
        handleQuestionChange={() => {}}
        handleAnswerChange={() => () => {}} 
        handleCorrectAnswerChange={() => {}}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
