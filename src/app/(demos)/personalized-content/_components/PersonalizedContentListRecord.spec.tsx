import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, Mock } from "vitest"; // Import Mock for type assertion
import "@testing-library/jest-dom";
import { PersonalizedContentRecord } from "@/types/demos/personalized-content"; // Adjust path as necessary
import { useRouter } from "next/navigation";
import PersonalizedContentListRecord from "./PersonalizedContentListRecord";

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

// Mock the ConfirmationDialog component (Declare globally)
// const MockConfirmationDialog = vi.fn(() => null);

describe("PersonalizedContentlistRecord", () => {
  const mockRecord: PersonalizedContentRecord = {
    id: "lesson-123",
    title: "Advanced Testing Strategies",
    intro: "Learn property-based testing and fuzzing.",
    durationValue: 60,
    durationUnit: "minutes",
    learnerProfileId: "senior-engineer",
  } as PersonalizedContentRecord; // Cast to ensure all required fields are present

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
    render(<PersonalizedContentListRecord record={mockRecord} />);

    // Title and Description
    expect(
      screen.getByTestId("personalized-content-list-record-title")
    ).toHaveTextContent(mockRecord.title);
    expect(
      screen.getByTestId("personalized-content-list-record-intro")
    ).toHaveTextContent(mockRecord.intro);

    // Duration/Lesson details
    expect(
      screen.getByTestId("personalized-content-list-lesson-time")
    ).toHaveTextContent("This lesson is 60 minutes long");

    // Learner chip
    expect(
      screen.getByTestId("personalized-content-list-learner-chip")
    ).toHaveTextContent("Learner Profile: senior-engineer");
  });

  // Test 2: Handles singular duration unit correctly (e.g., 1 hour, not 1 hours)
  test("should handle singular duration unit", () => {
    const singleLessonRecord = {
      ...mockRecord,
      durationValue: 1,
      durationUnit: "hours",
    } as PersonalizedContentRecord;

    render(<PersonalizedContentListRecord record={singleLessonRecord} />);
    expect(
      screen.getByTestId("personalized-content-list-lesson-time")
    ).toHaveTextContent("This lesson is 1 hour long");
  });

  // Test 3: View button navigates to the view route
  test("should navigate to view route when View button is clicked", () => {
    render(<PersonalizedContentListRecord record={mockRecord} />);

    const viewButton = screen.getByTestId("personalized-content-list-button-view");
    fireEvent.click(viewButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/personalized-content/${mockRecord.id}`);
  });

  // Test 4: Edit button navigates to the edit route
  test("should navigate to edit route when Edit button is clicked", () => {
    render(<PersonalizedContentListRecord record={mockRecord} />);

    const editButton = screen.getByTestId("personalized-content-list-button-edit");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(
      `/personalized-content/${mockRecord.id}/edit`
    );
  });
});
