import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseOutlineListRecord from "./CourseOutlineListRecord";
import * as HeroUI from "@heroui/react";
import LearnerProfileChip from "@/components/learner-profile/LearnerProfileChip";

// --- MOCK DATA ---
// Create a mock record matching the expected structure of CourseOutlineRecord
const MOCK_COURSE_RECORD = {
  id: 1,
  title: "Introduction to JavaScript",
  description:
    "A comprehensive course covering JS fundamentals and DOM manipulation.",
  numberOfLessons: 15,
  timePerLesson: "45 min",
  // IMPORTANT: Assuming 'learnerProfile' contains the ID required by LearnerProfileChip
  learnerProfile: 101,
};

// --- MOCKING DEPENDENCIES ---

vi.mock("@heroui/react", () => ({
  Button: vi.fn(({ children, startContent, ...props }) => (
    <button data-testid="mock-button" {...props}>
      {startContent}
      {children}
    </button>
  )),
}));

vi.mock("@/components/learner-profile/LearnerProfileChip", () => ({
  default: vi.fn((props) => (
    <div data-testid="mock-learner-chip" {...props}>
      Learner ID: {props.learnerProfileId}
    </div>
  )),
}));

describe("CourseOutlineListRecord", () => {
  const MockButton = vi.mocked(HeroUI.Button);
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- CONTENT RENDERING TESTS ---

  it("renders the title, description, and lesson details correctly", () => {
    render(<CourseOutlineListRecord record={MOCK_COURSE_RECORD} />);

    // Title
    expect(
      screen.getByRole("heading", { name: /introduction to javascript/i })
    ).toBeInTheDocument();

    // Description
    expect(
      screen.getByText(MOCK_COURSE_RECORD.description)
    ).toBeInTheDocument();

    // Time per lesson
    expect(screen.getByText(/45 min per lesson/i)).toBeInTheDocument();

    // Total lessons
    expect(screen.getByText(/15 total lessons/i)).toBeInTheDocument();
  });

  // --- CHILD COMPONENT ASSERTIONS ---

  it("renders the LearnerProfileChip with the correct ID", () => {
    const MockLearnerProfileChip = vi.mocked(LearnerProfileChip);
    render(<CourseOutlineListRecord record={MOCK_COURSE_RECORD} />);

    // 1. Check that the mock component was called
    expect(MockLearnerProfileChip).toHaveBeenCalledTimes(1);

    // 2. Check that the component received the correct ID prop
    expect(MockLearnerProfileChip).toHaveBeenCalledWith(
      expect.objectContaining({
        learnerProfileId: MOCK_COURSE_RECORD.learnerProfile,
        className: "mt-2",
      }),
      undefined
    );

    // 3. Check for the element in the DOM
    expect(
      screen.getByTestId("course-outline-list-learner-chip")
    ).toHaveTextContent("Learner ID: 101");
  });

  it("renders the View and Edit buttons with correct props and icons", () => {
    render(<CourseOutlineListRecord record={MOCK_COURSE_RECORD} />);

    // 2. Assert Button component was called exactly twice (View and Edit)
    expect(MockButton).toHaveBeenCalledTimes(2);

    const viewButton = screen.getByTestId("course-outline-list-button-view");
    const editButton = screen.getByTestId("course-outline-list-button-edit");

    expect(viewButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
  });
});
