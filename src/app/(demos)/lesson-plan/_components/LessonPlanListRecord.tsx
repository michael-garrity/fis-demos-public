"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button, addToast, useDisclosure } from "@heroui/react";
import { Edit2, Eye, Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { LearnerProfileChip, LearnerProfile } from "@/lib/learner-profiles";
import type { LearnerProfileRow } from "@/lib/learner-profiles";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { useDeleteLessonPlan } from "../_store/useLessonPlanDelete";

interface LessonPlanListProps {
  record: LessonPlanRecord;
}

/**
 * Converts a plain learner_profile object from LessonPlanRecord to a LearnerProfile instance.
 * Provides default values for required database fields that aren't present in the plain object.
 */
function toLearnerProfile(
  profile: LessonPlanRecord["creation_meta"]["learner_profile"]
): LearnerProfile {
  const profileRow: LearnerProfileRow = {
    id: profile.id,
    label: profile.label,
    age: profile.age,
    reading_level: profile.reading_level,
    experience: profile.experience ?? null,
    interests: profile.interests ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return new LearnerProfile(profileRow);
}

export default function LessonPlanListRecord({ record }: LessonPlanListProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 1. Integrate the deletion hook
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteLessonPlan();

  const gotoView = useCallback(
    (id: string) => {
      router.push(`/lesson-plan/${id}`);
    },
    [router]
  );

  const gotoEdit = useCallback(
    (id: string) => {
      router.push(`/lesson-plan/${id}/edit`);
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
          description: `Lesson ID ${deletedId} has been removed.`,
          color: "success",
          shouldShowTimeoutProgress: true,
        });
        onClose(); // Close the confirmation modal
      },
      onError: (error) => {
        addToast({
          title: <p className="text-xl font-bold">Error</p>,
          description: `Failed to delete lesson: ${error.message}`,
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
            data-testid="lesson-plan-list-record-title"
            className="text-lg font-semibold"
          >
            {record.creation_meta.source_material.title}
          </h2>
          <p
            data-testid="lesson-plan-list-record-description"
            className="text-sm text-gray-600 mb-4 text-justify line-clamp-2"
          >
            {record.introduction}
          </p>

          <div className="flex justify-between items-center mb-4 text-xs">
            <p
              data-testid="lesson-plan-list-time-per-lesson"
              className="flex items-center text-gray-600"
            >
              {/* Removed durationValue/durationUnit as they dont exist in new type */}
              &nbsp;
            </p>
          </div>
          <LearnerProfileChip
            data-testid="lesson-plan-list-learner-chip"
            learnerProfile={toLearnerProfile(
              record.creation_meta.learner_profile
            )}
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-2 col-span-2 justify-self-end">
          {/* View Button */}
          <Button
            data-testid="lesson-plan-list-button-view"
            color="primary"
            startContent={<Eye />}
            onPress={() => gotoView(record.id)}
          >
            View
          </Button>

          {/* Edit Button */}
          <Button
            data-testid="lesson-plan-list-button-edit"
            variant="flat"
            startContent={<Edit2 />}
            onPress={() => gotoEdit(record.id)}
          >
            Edit
          </Button>

          {/* 3. Delete Button (Triggers Modal) */}
          <Button
            data-testid="lesson-plan-list-button-delete"
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
            Are you sure you want to permanently delete the lesson:
            <span className="font-semibold block mt-1">
              &quot;{record.creation_meta.source_material.title}&quot; (ID:{" "}
              {record.id})?
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
