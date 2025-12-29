import { useRouter } from "next/navigation";
import { describe, test, expect, vi, beforeEach, Mock } from "vitest"; // Import Mock for type assertion
import { render, screen, fireEvent } from "@testing-library/react";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import LessonPlanListRecord from "./LessonPlanListRecord";
import { factory } from "@/test";

// Mock the next/navigation useRouter
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

type MockLearnerChipProps = {
  learnerProfileId: string;
  className?: string;
} & Record<string, unknown>;

// Mock the LearnerProfileChip component as it's an external dependency
vi.mock("@/components/learner-profile/LearnerProfileChip", () => {
  return {
    default: ({
      learnerProfileId,
      // className,
      ...props
    }: MockLearnerChipProps) => (
      <div data-testid="mock-learner-chip" {...props}>
        Learner Profile: {learnerProfileId}
      </div>
    ),
  };
});

// Mock the delete mutation hook
const mockDeleteMutation = vi.fn();
const mockIsDeleting = vi.fn(() => false); // Use a mock function to control state easily
vi.mock("../_store/useLessonPlanDelete.ts", () => {
  return {
    useDeleteLessonPlan: vi.fn(() => ({
      mutate: mockDeleteMutation,
      isPending: mockIsDeleting(),
    })),
  };
});

// Mock the ConfirmationDialog component (Declare globally)
// const MockConfirmationDialog = vi.fn(() => null);

describe("LessonPlanListRecord", () => {
  const mockRecord = factory.build("lessonPlan", {
    id: crypto.randomUUID(),
  }) as LessonPlanRecord;
  const mockPush = vi.fn();

  beforeEach(() => {
    mockPush.mockClear();
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test("should render lesson details and learner chip correctly", () => {
    render(<LessonPlanListRecord record={mockRecord} />);

    // Title / description (from introduction in new type)
    expect(
      screen.getByTestId("lesson-plan-list-record-title")
    ).toHaveTextContent(mockRecord.creation_meta.source_material.title);
    expect(
      screen.getByTestId("lesson-plan-list-record-description")
    ).toHaveTextContent(mockRecord.introduction);

    // Learner chip
    expect(
      screen.getByTestId("lesson-plan-list-learner-chip")
    ).toHaveTextContent(mockRecord.creation_meta.learner_profile.label);
  });

  test("View button navigates to the view route", () => {
    render(<LessonPlanListRecord record={mockRecord} />);

    const viewButton = screen.getByTestId("lesson-plan-list-button-view");
    fireEvent.click(viewButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/lesson-plan/${mockRecord.id}`);
  });

  test("Edit button navigates to the edit route", () => {
    render(<LessonPlanListRecord record={mockRecord} />);

    const editButton = screen.getByTestId("lesson-plan-list-button-edit");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/lesson-plan/${mockRecord.id}/edit`);
  });
});
