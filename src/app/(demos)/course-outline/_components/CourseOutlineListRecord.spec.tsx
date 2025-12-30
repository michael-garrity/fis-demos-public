import "@testing-library/jest-dom";
import CourseOutlineListRecord from "./CourseOutlineListRecord";
import { CourseOutline } from "../_models";
import { LearnerProfile } from "@/lib/learner-profiles";
import { describe, test, expect, vi, beforeEach, Mock } from "vitest";
import { factory } from "@/test";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

// Mock the next/navigation useRouter
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock the LearnerProfileChip component as it's an external dependency
vi.mock("@/lib/learner-profiles", async (importOriginal) => {
  const actual = (await importOriginal()) as Partial<
    typeof import("@/lib/learner-profiles")
  >;
  return {
    ...actual,
    LearnerProfileChip: ({
      learnerProfile,
      ...props
    }: {
      learnerProfile: LearnerProfile;
    }) => (
      <div data-testid="mock-learner-chip" {...props}>
        Learner Profile: {learnerProfile.label}
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
  const data = factory.build("courseOutline", { id: crypto.randomUUID() });
  const record = new CourseOutline(data);
  const mockPush = vi.fn();

  beforeEach(() => {
    mockPush.mockClear();

    // FIX: Use the imported 'Mock' type for assertion
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test("should render course details and learner chip correctly", () => {
    render(<CourseOutlineListRecord record={record} />);

    // Title and Description
    expect(
      screen.getByTestId("course-outline-list-record-title")
    ).toHaveTextContent(record.title);
    expect(
      screen.getByTestId("course-outline-list-record-description")
    ).toHaveTextContent(record.description);

    // Duration/Lesson details
    expect(
      screen.getByTestId("course-outline-list-time-per-lesson")
    ).toHaveTextContent(`${record.totalMinutes} minutes total`);
    expect(
      screen.getByTestId("course-outline-list-total-lessons")
    ).toHaveTextContent(`${record.lessonOutlineCount} lessons`);

    // Learner chip
    expect(
      screen.getByTestId("course-outline-list-learner-chip")
    ).toHaveTextContent(`Learner Profile: ${record.learnerProfile?.label}`);
  });

  test("should avoid impromper pluralization", () => {
    const newData = factory.build("courseOutline", {
      lessonOutlines: [factory.build("lessonOutline", { minutes: 1 })],
    });
    const newRecord = new CourseOutline(newData);

    render(<CourseOutlineListRecord record={newRecord} />);
    expect(
      screen.getByTestId("course-outline-list-time-per-lesson")
    ).toHaveTextContent("1 minute total");
    expect(
      screen.getByTestId("course-outline-list-total-lessons")
    ).toHaveTextContent("1 lesson");
  });

  test("should navigate to view route when View button is clicked", () => {
    render(<CourseOutlineListRecord record={record} />);

    const viewButton = screen.getByTestId("course-outline-list-button-view");
    fireEvent.click(viewButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/course-outline/${record.id}`);
  });

  test("should navigate to edit route when Edit button is clicked", () => {
    render(<CourseOutlineListRecord record={record} />);

    const editButton = screen.getByTestId("course-outline-list-button-edit");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/course-outline/${record.id}/edit`);
  });
});
