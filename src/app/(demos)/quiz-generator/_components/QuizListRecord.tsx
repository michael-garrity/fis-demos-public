"use client";

import { useCallback } from "react";
import { Button, addToast, useDisclosure } from "@heroui/react";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDeleteQuiz } from "../_store";
import { Quiz } from "../_models";
import { LearnerProfileChip } from "@/lib/learner-profiles";

interface QuizListRecordProps {
  record: Quiz;
}

export default function QuizListRecord({ record }: QuizListRecordProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 1. Integrate the deletion hook
  const { mutate: deleteQuiz, isPending: isDeleting } = useDeleteQuiz();

  const gotoView = useCallback(
    (id: string) => {
      router.push(`/quiz-generator/${id}`);
    },
    [router]
  );

  const gotoEdit = useCallback(
    (id: string) => {
      router.push(`/quiz-generator/${id}/edit`);
    },
    [router]
  );

  // 2. Handler for confirming and initiating deletion
  const handleDelete = useCallback(() => {
    // Check if mutation is running
    if (isDeleting) return;

    // Call the mutation hook with the record ID
    deleteQuiz(record.id, {
      onSuccess: (deletedId) => {
        // Show success notification
        addToast({
          title: <p className="text-xl font-bold">Deleted!</p>,
          description: `Quiz ID ${deletedId} has been removed.`,
          color: "success",
          shouldShowTimeoutProgress: true,
        });
        onClose(); // Close the confirmation modal
      },
      onError: (error) => {
        addToast({
          title: <p className="text-xl font-bold">Error</p>,
          description: `Failed to delete quiz: ${error.message}`,
          color: "danger",
          shouldShowTimeoutProgress: true,
        });
        onClose(); // Close the modal even on error
      },
    });
  }, [isDeleting, record.id, deleteQuiz, onClose]);

  return (
    <>
      {/* Content: Use a plain div for the grid layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 items-center w-full">
        <div className="col-span-3">
          <h2
            data-testid="quiz-list-record-title"
            className="text-lg font-semibold"
          >
            {record.title}
          </h2>
          <p
            data-testid="quiz-list-record-description"
            className="text-sm text-gray-600 mb-4 text-justify line-clamp-2"
          >
            {record.description}
          </p>

          <div className="flex justify-between items-center mb-4 text-xs">
            <p
              data-testid="quiz-list-total-lessons"
              className="flex items-center gap-2 text-gray-600"
            >
              `{record.questionCount} question
              {record.questionCount === 1 ? "" : "s"}
            </p>
          </div>
          <LearnerProfileChip
            data-testid="quiz-list-learner-chip"
            learnerProfile={record.learnerProfile}
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-2 col-span-2 justify-self-end">
          {/* View Button */}
          <Button
            data-testid="quiz-list-button-view"
            color="primary"
            startContent={<Eye />}
            onPress={() => gotoView(record.id)}
          >
            View
          </Button>

          {/* Edit Button */}
          <Button
            data-testid="quiz-list-button-edit"
            variant="flat"
            startContent={<Edit2 />}
            onPress={() => gotoEdit(record.id)}
          >
            Edit
          </Button>

          {/* 3. Delete Button (Triggers Modal) */}
          <Button
            data-testid="quiz-list-button-delete"
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
            Are you sure you want to permanently delete the quiz:
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
