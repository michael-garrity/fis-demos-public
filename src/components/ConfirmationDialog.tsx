import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // Renamed handleDelete to be generic
  isExecuting: boolean; // Renamed isDeleting to be generic

  title: string;
  message: string | React.ReactNode;
  confirmButtonText?: string;
  confirmButtonColor?: "danger" | "primary" | "success";
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isExecuting,
  title,
  message,
  confirmButtonText = "Confirm Action",
  confirmButtonColor = "primary",
}: ConfirmationDialogProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className={`text-xl font-bold text-${confirmButtonColor}`}>
          {title}
        </ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isExecuting}>
            Cancel
          </Button>
          <Button
            color={confirmButtonColor}
            onPress={onConfirm}
            isLoading={isExecuting}
          >
            {isExecuting ? "Processing..." : confirmButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
