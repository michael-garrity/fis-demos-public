"use client";

import {
  Chip,
  ChipProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@heroui/react";
import LearnerProfileCard from "./LearnerProfileCard";
import { CircleUserRound } from "lucide-react";
import { LearnerProfile } from "@/lib/learner-profiles";

interface LearnerProfileChipProps extends ChipProps {
  learnerProfile: LearnerProfile | null;
  addClassName?: string;
  isLoading?: boolean;
}

const TEST_ID = "learner-profile-chip";

export default function LearnerProfileChip({
  children = null,
  learnerProfile,
  addClassName = "",
  isLoading = false,
  ...chipProps
}: LearnerProfileChipProps) {
  const { "data-testid": dataTestId, ...restChipProps } = chipProps as {
    "data-testid"?: string;
  };

  if (isLoading) {
    return (
      <Chip
        data-testid={dataTestId ?? TEST_ID}
        size="md"
        startContent={
          <Spinner
            size="sm"
            classNames={{
              circle2: "border-b-[#000]",
              circle1: "border-b-[#000]",
            }}
            className="px-2"
          />
        }
        {...restChipProps}
      >
        Loading
      </Chip>
    );
  }

  if (!learnerProfile) {
    return (
      <Chip size="md" data-testid={dataTestId ?? TEST_ID} {...restChipProps}>
        Unknown Learner
      </Chip>
    );
  }

  return (
    // Popover is set to trigger on click and appears to the right of the chip
    <Popover placement="right" showArrow>
      <PopoverTrigger>
        <Chip
          data-testid={dataTestId ?? TEST_ID}
          size="md"
          color="primary"
          startContent={<CircleUserRound size={18} />}
          className={`cursor-pointer transition-transform hover:scale-[1.03] gap-2 px-2 ${addClassName}`.trim()}
          classNames={{ content: "p-0" }}
          {...restChipProps}
        >
          {children ? children : learnerProfile.label}
        </Chip>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-none">
        <LearnerProfileCard learnerProfile={learnerProfile} />
      </PopoverContent>
    </Popover>
  );
}
