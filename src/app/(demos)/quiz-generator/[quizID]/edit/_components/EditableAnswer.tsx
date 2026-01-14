// import { ChangeEvent } from "react";
// import { CircleX, CircleCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  // Textarea,
  Radio
} from "@heroui/react";
import { Answer } from "@/types";

type EditableAnswerProps = {
    answer: Answer,
    index: number,
    handleAnswerChange: <K extends keyof Answer>(field: K, value: Answer[K]) => void
}

export default function EditableAnswer({
  answer,
  index,
  handleAnswerChange
}: EditableAnswerProps) {
  return (
  <Card className={`flex flex-row border-gray-200 bg-white`}>
    <CardHeader className="w-min">
      <Radio
        value={String(index)}
      />
    </CardHeader>
    <CardBody className="w-full flex gap-1">
      <Input label="Answer" value={answer.text} onValueChange={(value) => handleAnswerChange("text", value)} />
      <Input label="Feedback" value={answer.feedback} onValueChange={(value) => handleAnswerChange("feedback", value)} />
    </CardBody>
  </Card>
  );
}
