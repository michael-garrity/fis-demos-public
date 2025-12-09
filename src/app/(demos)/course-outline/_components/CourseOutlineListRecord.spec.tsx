import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, Mock } from "vitest"; // Import Mock for type assertion
import "@testing-library/jest-dom";
import { CourseOutlineRecord } from "@/types/demos/course-outline"; // Adjust path as necessary
import { useRouter } from "next/navigation";
import CourseOutlineListRecord from "./CourseOutlineListRecord";

// Mock the next/navigation useRouter
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock the LearnerProfileChip component as it's an external dependency
vi.mock("@/components/learner-profile/LearnerProfileChip", () => {
  return {
    default: ({ learnerProfileId, className, ...props }: any) => (
      <div data-testid="mock-learner-chip" {...props}>
        Learner Profile: {learnerProfileId}
      </div>
    ),
  };
});

// Mock the delete mutation hook
const mockDeleteMutation = vi.fn();
const mockIsDeleting = vi.fn(() => false); // Use a mock function to control state easily
vi.mock("../_store/useDeleteCourseOutline", () => {
  return {
    useDeleteCourseOutline: vi.fn(() => ({
      mutate: mockDeleteMutation,
      isPending: mockIsDeleting(),
    })),
  };
});

// Mock the ConfirmationDialog component (Declare globally)
// const MockConfirmationDialog = vi.fn(() => null);

describe("CourseOutlineListRecord", () => {
  const mockRecord: CourseOutlineRecord = {
    id: "course-123",
    title: "Advanced Testing Strategies",
    description: "Learn property-based testing and fuzzing.",
    durationValue: 60,
    durationUnit: "minutes",
    numberOfLessons: 5,
    learnerProfileId: "senior-engineer",
  } as CourseOutlineRecord; // Cast to ensure all required fields are present

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
  test("should render course details and learner chip correctly", () => {
    render(<CourseOutlineListRecord record={mockRecord} />);

    // Title and Description
    expect(
      screen.getByTestId("course-outline-list-record-title")
    ).toHaveTextContent(mockRecord.title);
    expect(
      screen.getByTestId("course-outline-list-record-description")
    ).toHaveTextContent(mockRecord.description);

    // Duration/Lesson details
    expect(
      screen.getByTestId("course-outline-list-time-per-lesson")
    ).toHaveTextContent("60 minutes per lesson");
    expect(
      screen.getByTestId("course-outline-list-total-lessons")
    ).toHaveTextContent("5 total lessons");

    // Learner chip
    expect(
      screen.getByTestId("course-outline-list-learner-chip")
    ).toHaveTextContent("Learner Profile: senior-engineer");
  });

  // Test 2: Handles singular duration unit correctly (e.g., 1 hour, not 1 hours)
  test("should handle singular duration unit", () => {
    const singleLessonRecord = {
      ...mockRecord,
      durationValue: 1,
      durationUnit: "hours",
    } as CourseOutlineRecord;

    render(<CourseOutlineListRecord record={singleLessonRecord} />);
    expect(
      screen.getByTestId("course-outline-list-time-per-lesson")
    ).toHaveTextContent("1 hour per lesson");
  });

  // Test 3: View button navigates to the view route
  test("should navigate to view route when View button is clicked", () => {
    render(<CourseOutlineListRecord record={mockRecord} />);

    const viewButton = screen.getByTestId("course-outline-list-button-view");
    fireEvent.click(viewButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/course-outline/${mockRecord.id}`);
  });

  // Test 4: Edit button navigates to the edit route
  test("should navigate to edit route when Edit button is clicked", () => {
    render(<CourseOutlineListRecord record={mockRecord} />);

    const editButton = screen.getByTestId("course-outline-list-button-edit");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(
      `/course-outline/${mockRecord.id}/edit`
    );
  });
});
