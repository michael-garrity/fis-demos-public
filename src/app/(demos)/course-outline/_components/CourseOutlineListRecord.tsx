"use client";

import { useRouter } from "next/navigation";
import { Button, addToast, useDisclosure } from "@heroui/react";
import { Edit2, Eye, Trash2 } from "lucide-react";

import { LearnerProfileChip } from "@/lib/learner-profiles";
import { CourseOutline } from "../_models";
import { useDeleteCourseOutline } from "../_store/useDeleteCourseOutline";
import ConfirmationDialog from "@/components/ConfirmationDialog";

// Simple helper for pluralizing text
const formatUnit = (count: number, unit: string) =>
  `${count} ${unit}${count === 1 ? "" : "s"}`;

interface CourseOutlineListRecordProps {
  record: CourseOutline;
}

export default function CourseOutlineListRecord({
  record,
}: CourseOutlineListRecordProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate: deleteCourseOutline, isPending: isDeleting } =
    useDeleteCourseOutline();

  // --- Handlers ---

  const handleView = () => router.push(`/course-outline/${record.id}`);

  const handleEdit = () => router.push(`/course-outline/${record.id}/edit`);

  const handleConfirmDelete = () => {
    if (isDeleting) return;

    deleteCourseOutline(record, {
      onSuccess: (deleted) => {
        addToast({
          title: <span className="text-xl font-bold">Deleted!</span>,
          description: `'${deleted.title}' has been removed.`,
          color: "success",
          shouldShowTimeoutProgress: true,
        });
        onClose();
      },
      onError: (error) => {
        addToast({
          title: <span className="text-xl font-bold">Error</span>,
          description: `Failed to delete course: ${error.message}`,
          color: "danger",
          shouldShowTimeoutProgress: true,
        });
        onClose();
      },
    });
  };

  // --- Render ---

  return (
    <>
      <div className="grid grid-cols-1 gap-4 items-center md:grid-cols-5 md:gap-8 w-full">
        {/* Course Information */}
        <div className="col-span-3">
          <h2
            data-testid="course-outline-list-record-title"
            className="text-lg font-semibold"
          >
            {record.title}
          </h2>

          <p
            data-testid="course-outline-list-record-description"
            className="mb-4 text-sm text-gray-600 text-justify line-clamp-2"
          >
            {record.description}
          </p>

          <div className="flex justify-between items-center mb-4 text-xs text-gray-600">
            <p data-testid="course-outline-list-time-per-lesson">
              {formatUnit(record.totalMinutes, "minute")} total
            </p>
            <p data-testid="course-outline-list-total-lessons">
              {formatUnit(record.lessonOutlineCount, "lesson")}
            </p>
          </div>

          <LearnerProfileChip
            data-testid="course-outline-list-learner-chip"
            learnerProfile={record.learnerProfile}
            addClassName="mt-2"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex col-span-2 gap-2 items-center justify-self-end">
          <Button
            data-testid="course-outline-list-button-view"
            color="primary"
            startContent={<Eye />}
            onPress={handleView}
          >
            View
          </Button>

          <Button
            data-testid="course-outline-list-button-edit"
            variant="flat"
            startContent={<Edit2 />}
            onPress={handleEdit}
          >
            Edit
          </Button>

          <Button
            data-testid="course-outline-list-button-delete"
            color="danger"
            isIconOnly
            onPress={onOpen}
            isDisabled={isDeleting}
            aria-label="Delete course"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmDelete}
        isExecuting={isDeleting}
        title="Confirm Deletion"
        confirmButtonColor="danger"
        confirmButtonText="Delete"
        message={
          <p className="text-gray-700">
            Are you sure you want to permanently delete the course:
            <span className="block mt-1 font-semibold">
              &quot;{record.title}&quot; (ID: {record.id})?
            </span>
            This action cannot be undone.
          </p>
        }
      />
    </>
  );
}
