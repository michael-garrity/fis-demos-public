import { useRouter } from "next/navigation";
import { describe, test, expect, vi, beforeEach, Mock } from "vitest"; // Import Mock for type assertion
import { render, screen, fireEvent } from "@testing-library/react";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import LessonPlanListRecord from "./LessonPlanListRecord";

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
  const mockRecord: LessonPlanRecord = {
    id: "course-123",
    title: "Advanced Testing Strategies",
    description: "Learn property-based testing and fuzzing.",
    durationValue: 60,
    durationUnit: "minutes",
    learnerProfileId: "senior-engineer",
  } as LessonPlanRecord; // Cast to ensure all required fields are present

  const mockPush = vi.fn();

  beforeEach(() => {
    // Reset mock before each test
    mockPush.mockClear();
    // FIX: Use the imported 'Mock' type for assertion
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
  });

  // Test 1: Component renders correctly with all data points
  test("should render lesson details and learner chip correctly", () => {
    render(<LessonPlanListRecord record={mockRecord} />);

    // Title and Description
    expect(
      screen.getByTestId("lesson-plan-list-record-title")
    ).toHaveTextContent(mockRecord.title);
    expect(
      screen.getByTestId("lesson-plan-list-record-description")
    ).toHaveTextContent(mockRecord.description);

    // Duration/Lesson details
    expect(
      screen.getByTestId("lesson-plan-list-time-per-lesson")
    ).toHaveTextContent("60 minutes per lesson");
    // Learner chip
    expect(
      screen.getByTestId("lesson-plan-list-learner-chip")
    ).toHaveTextContent("Learner Profile: senior-engineer");
  });

  // Test 2: Handles singular duration unit correctly (e.g., 1 hour, not 1 hours)
  test("should handle singular duration unit", () => {
    const singleLessonRecord = {
      ...mockRecord,
      durationValue: 1,
      durationUnit: "hours",
    } as LessonPlanRecord;

    render(<LessonPlanListRecord record={singleLessonRecord} />);
    expect(
      screen.getByTestId("lesson-plan-list-time-per-lesson")
    ).toHaveTextContent("1 hour per lesson");
  });

  // Test 3: View button navigates to the view route
  test("should navigate to view route when View button is clicked", () => {
    render(<LessonPlanListRecord record={mockRecord} />);

    const viewButton = screen.getByTestId("lesson-plan-list-button-view");
    fireEvent.click(viewButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/lesson-plan/${mockRecord.id}`);
  });

  // Test 4: Edit button navigates to the edit route
  test("should navigate to edit route when Edit button is clicked", () => {
    render(<LessonPlanListRecord record={mockRecord} />);

    const editButton = screen.getByTestId("lesson-plan-list-button-edit");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/lesson-plan/${mockRecord.id}/edit`);
  });
});
