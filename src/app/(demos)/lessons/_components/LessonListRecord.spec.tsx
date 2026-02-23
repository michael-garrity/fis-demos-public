import "@testing-library/jest-dom";
import LessonListRecord from "./LessonListRecord";
import { Lesson } from "../_models";
import { LearnerProfile } from "@/lib/learner-profiles";
import { describe, test, expect, vi, Mock } from "vitest";
import { factory } from "@/test";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

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
      <div data-testid="lesson-list-learner-chip" {...props}>
        Learner Profile: {learnerProfile.label}
      </div>
    ),
  };
});

describe("LessonListRecord", () => {
  const data = factory.build("lesson", { id: crypto.randomUUID() });
  const record = new Lesson(data);

  test("should render lesson title", () => {
    render(<LessonListRecord record={record} />);
    expect(screen.getByTestId("lesson-list-record-title")).toHaveTextContent(
      record.title,
    );
  });

  test("should render lesson content", () => {
    render(<LessonListRecord record={record} />);
    const contentElement = screen.getByTestId("lesson-list-record-content");
    expect(contentElement.textContent).toContain(
      record.content.substring(0, 50),
    );
  });

  test("should render learner chip correctly", () => {
    render(<LessonListRecord record={record} />);
    expect(screen.getByTestId("lesson-list-learner-chip")).toHaveTextContent(
      `Learner Profile: ${record.learnerProfile?.label}`,
    );
  });

  test("should render view button", () => {
    render(<LessonListRecord record={record} />);
    expect(screen.getByTestId("lesson-list-button-view")).toBeInTheDocument();
  });
});
