import LearnerProfileChip from "@/components/learner-profile/LearnerProfileChip";
import { CourseOutlineRecord } from "@/types/demos/course-outline";
import { Button } from "@heroui/react";
import { Edit2, Eye } from "lucide-react";

export default function CourseOutlineListRecord({
  record,
}: {
  record: CourseOutlineRecord;
}) {
  return (
    <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 items-center">
      <div className="col-span-3">
        <h2
          data-testid="course-outline-list-record-title"
          className="text-lg font-semibold"
        >
          {record.title}
        </h2>
        <p
          data-testid="course-outline-list-record-description"
          className="text-sm text-gray-600 mb-4 text-justify"
        >
          {record.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <p
            data-testid="course-outline-list-time-per-lesson"
            className="flex items-center text-gray-600"
          >
            {record.durationValue}{" "}
            {record.durationValue === 1
              ? record.durationUnit.slice(0, -1)
              : record.durationUnit}{" "}
            per lesson
          </p>
          <p
            data-testid="course-outline-list-total-lessons"
            className="flex items-center gap-2 text-gray-600"
          >
            {record.numberOfLessons} total lessons
          </p>
        </div>
        <LearnerProfileChip
          data-testid="course-outline-list-learner-chip"
          learnerProfileId={record.learnerProfileId}
          className="mt-2"
        />
      </div>
      <div className="flex items-center gap-2 col-span-2 justify-self-end">
        <Button
          data-testid="course-outline-list-button-view"
          color="primary"
          startContent={<Eye />}
        >
          View
        </Button>
        <Button
          data-testid="course-outline-list-button-edit"
          variant="flat"
          startContent={<Edit2 />}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
