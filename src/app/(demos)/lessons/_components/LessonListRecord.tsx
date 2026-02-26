"use client";

import { Button } from "@heroui/react";
import { Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LearnerProfileChip } from "@/lib/learner-profiles";
import { Lesson } from "../_models";

interface LessonListRecordProps {
  record: Lesson;
}

export default function LessonListRecord({ record }: LessonListRecordProps) {
  return (
    <div className="w-full">
      <h2
        data-testid="lesson-list-record-title"
        className="text-2xl font-semibold"
      >
        {record.title}
      </h2>

      <div
        data-testid="lesson-list-record-content"
        className="mb-4 prose prose-base max-w-none prose-headings:font-bold prose-h2:mt-6 prose-h3:mt-4 text-gray-600"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {record.introduction}
        </ReactMarkdown>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex gap-4 items-center">
          <LearnerProfileChip
            data-testid="lesson-list-learner-chip"
            learnerProfile={record.learnerProfile}
            color="default"
            variant="faded"
          />
        </div>
        <div className="flex gap-2 items-center justify-self-end">
          <Button
            data-testid="lesson-list-button-view"
            color="primary"
            startContent={<Eye />}
            as="a"
            href="#"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
