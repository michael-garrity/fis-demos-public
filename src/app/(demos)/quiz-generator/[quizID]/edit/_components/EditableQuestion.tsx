import { ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  RadioGroup
} from "@heroui/react";
import { Answer, Question } from "@/types";
import EditableAnswer from "./EditableAnswer";

type EditableQuestionProps = {
    question: Question,
    handleQuestionChange: <K extends keyof Question>(field: K, value: Question[K]) => void
    handleAnswerChange: (answerIndex: number) => <K extends keyof Answer>(field: K, value: Answer[K]) => void
    handleCorrectAnswerChange: (answerIndex: number) => void
}

export default function EditableQuestion({
    question,
    handleQuestionChange,
    handleAnswerChange,
    handleCorrectAnswerChange
}: EditableQuestionProps) {
  return (
  <Card className="shadow-lg overflow-hidden border border-indigo-100 bg-white">
    {/* Question Header */}
    <CardHeader className="flex flex-col gap-3 bg-indigo-50/60 border-b border-indigo-100">
      <Input
        label="Question"
        labelPlacement="outside"
        size="lg"
        fullWidth
        classNames={{
          input: "text-2xl font-semibold text-gray-900",
          label: "text-sm font-medium text-gray-600",
        }}
        value={question.question}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleQuestionChange("question", e.target.value)
        }
      />
    </CardHeader>

    {/* Answers */}
    <CardBody className="p-6 space-y-6 bg-gray-50">
      <p className="w-full text-left text-small text-default-800">Select the correct answer</p>
      <RadioGroup 
        value={String(question.answers.findIndex(a => a.correct))}
        onValueChange={idx => handleCorrectAnswerChange(Number(idx))}
      >
        {question.answers.map((answer, index) =>
          <EditableAnswer 
            key={index}
            index={index}
            answer={answer} 
            handleAnswerChange={handleAnswerChange(index)}
          />
        )}
      </RadioGroup>
    </CardBody>
  </Card>
);

}
