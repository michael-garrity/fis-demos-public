"use client";

import { Button, Chip } from "@heroui/react";
import { Eye } from "lucide-react";

import { LearnerProfileChip } from "@/lib/learner-profiles";
import { Lesson } from "../_models";

interface LessonListRecordProps {
  record: Lesson;
}

export default function LessonListRecord({ record }: LessonListRecordProps) {
  return (
    <div className="">
      <h2
        data-testid="lesson-list-record-title"
        className="text-2xl font-semibold"
      >
        {record.title}
      </h2>

      <p
        data-testid="lesson-list-record-content"
        className="mb-4 text-sm text-gray-600 text-justify"
      >
        {record.content}
      </p>

      <div className="flex justify-between">
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
