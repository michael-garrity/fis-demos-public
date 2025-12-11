"use client";

import { useCallback } from "react";
import LearnerProfileChip from "@/components/learner-profile/LearnerProfileChip";
import { PersonalizedContentRecord } from "@/types";
import { Button, useDisclosure } from "@heroui/react";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/ConfirmationDialog";

interface PersonalizedContentListRecordProps {
  record: PersonalizedContentRecord;
}

export default function PersonalizedContentListRecord({
  record,
}: PersonalizedContentListRecordProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const gotoView = useCallback(
    (id: string) => {
      router.push(`/personalized-content/${id}`);
    },
    [router]
  );

  const gotoEdit = useCallback(
    (id: string) => {
      router.push(`/personalized-content/${id}/edit`);
    },
    [router]
  );

  // 2. Handler for confirming and initiating deletion, will be implemented later
  const handleDelete = useCallback(() => {
    alert(`Delete functionality for ID ${record.id} is not implemented yet.`);
    onClose(); // Close the confirmation modal
  }, [record.id, onClose]);
   

  return (
    <>
      {/* Content: Use a plain div for the grid layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 items-center w-full">
        <div className="col-span-3">
          <h2
            data-testid="personalized-content-list-record-title"
            className="text-lg font-semibold"
          >
            {record.title}
          </h2>
          <p
            data-testid="personalized-content-list-record-intro"
            className="text-sm text-gray-600 mb-4 text-justify line-clamp-2"
          >
            {record.intro}
          </p>

          <div className="flex justify-between items-center mb-4 text-xs">
            <p
              data-testid="personalized-content-list-lesson-time"
              className="flex items-center text-gray-600"
            >
              This lesson is
              {" "}
              {record.durationValue}{" "}
              {record.durationValue === 1
                ? record.durationUnit.slice(0, -1)
                : record.durationUnit}{" "}
              long
            </p>
          </div>
          <LearnerProfileChip
            data-testid="personalized-content-list-learner-chip"
            learnerProfileId={record.learnerProfileId}
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-2 col-span-2 justify-self-end">
          {/* View Button */}
          <Button
            data-testid="personalized-content-list-button-view"
            color="primary"
            startContent={<Eye />}
            onPress={() => gotoView(record.id)}
          >
            View
          </Button>

          {/* Edit Button */}
          <Button
            data-testid="personalized-content-list-button-edit"
            variant="flat"
            startContent={<Edit2 />}
            onPress={() => gotoEdit(record.id)}
          >
            Edit
          </Button>

          {/* 3. Delete Button (Triggers Modal) */}
          <Button
            data-testid="personalized-content-list-button-delete"
            color="danger"
            isIconOnly
            onPress={onOpen}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        isExecuting={false}
        title={"Confirm Deletion"}
        message={
          <p className="text-gray-700">
            Are you sure you want to permanently delete this lesson:
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
