"use client";

import { useCallback } from "react";
import LearnerProfileChip from "@/components/learner-profile/LearnerProfileChip";
import { CourseOutlineRecord } from "@/types/demos/course-outline";
import { Button, addToast, useDisclosure } from "@heroui/react";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteCourseOutline } from "../_store/useDeleteCourseOutline";
import ConfirmationDialog from "@/components/ConfirmationDialog";

interface CourseOutlineListRecordProps {
  record: CourseOutlineRecord;
}

export default function CourseOutlineListRecord({
  record,
}: CourseOutlineListRecordProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 1. Integrate the deletion hook
  const { mutate: deleteCourse, isPending: isDeleting } =
    useDeleteCourseOutline();

  const gotoView = useCallback(
    (id: string) => {
      router.push(`/course-outline/${id}`);
    },
    [router]
  );

  const gotoEdit = useCallback(
    (id: string) => {
      router.push(`/course-outline/${id}/edit`);
    },
    [router]
  );

  // 2. Handler for confirming and initiating deletion
  const handleDelete = useCallback(() => {
    // Check if mutation is running
    if (isDeleting) return;

    // Call the mutation hook with the record ID
    deleteCourse(record.id, {
      onSuccess: (deletedId) => {
        // Show success notification
        addToast({
          title: <p className="text-xl font-bold">Deleted!</p>,
          description: `Course ID ${deletedId} has been removed.`,
          color: "success",
          shouldShowTimeoutProgress: true,
        });
        onClose(); // Close the confirmation modal
      },
      onError: (error) => {
        addToast({
          title: <p className="text-xl font-bold">Error</p>,
          description: `Failed to delete course: ${error.message}`,
          color: "danger",
          shouldShowTimeoutProgress: true,
        });
        onClose(); // Close the modal even on error
      },
    });
  }, [isDeleting, record.id, deleteCourse, onClose]);

  return (
    <>
      {/* Content: Use a plain div for the grid layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 items-center">
        <div className="col-span-3">
          <h2
            data-testid="course-outline-list-record-title"
            className="text-lg font-semibold"
          >
            {record.title}
          </h2>
          <p
            data-testid="course-outline-list-record-description"
            className="text-sm text-gray-600 mb-4 text-justify line-clamp-2"
          >
            {record.description}
          </p>

          <div className="flex justify-between items-center mb-4 text-xs">
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
          {/* View Button */}
          <Button
            data-testid="course-outline-list-button-view"
            color="primary"
            startContent={<Eye />}
            onPress={() => gotoView(record.id)}
          >
            View
          </Button>

          {/* Edit Button */}
          <Button
            data-testid="course-outline-list-button-edit"
            variant="flat"
            startContent={<Edit2 />}
            onPress={() => gotoEdit(record.id)}
          >
            Edit
          </Button>

          {/* 3. Delete Button (Triggers Modal) */}
          <Button
            data-testid="course-outline-list-button-delete"
            color="danger"
            isIconOnly
            onPress={onOpen}
            isDisabled={isDeleting}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        isExecuting={isDeleting}
        title={"Confirm Deletion"}
        message={
          <p className="text-gray-700">
            Are you sure you want to permanently delete the course:
            <span className="font-semibold block mt-1">
              &quot;{record.title}&quot; (ID: {record.id})?
            </span>
            This action cannot be undone.
          </p>
        }
        confirmButtonColor="danger"
        confirmButtonText="Delete"
      />
    </>
  );
}
