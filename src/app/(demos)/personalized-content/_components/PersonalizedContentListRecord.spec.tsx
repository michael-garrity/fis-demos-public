import "@testing-library/jest-dom";
import PersonalizedContentListRecord from "./PersonalizedContentListRecord";
import { PersonalizedContent } from "../_models";
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
vi.mock("../_store/useDeletePersonalizedContent", () => {
  return {
    useDeletePersonalizedContent: vi.fn(() => ({
      mutate: mockDeleteMutation,
      isPending: mockIsDeleting(),
    })),
  };
});

// Mock the ConfirmationDialog component (Declare globally)
// const MockConfirmationDialog = vi.fn(() => null);

describe("PersonalizedContentListRecord", () => {
  const data = factory.build("personalizedContent", {
    id: crypto.randomUUID(),
  });
  const record = new PersonalizedContent(data);
  const mockPush = vi.fn();

  beforeEach(() => {
    mockPush.mockClear();

    // FIX: Use the imported 'Mock' type for assertion
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test("should render course details and learner chip correctly", () => {
    render(<PersonalizedContentListRecord record={record} />);

    // Title and Description
    expect(
      screen.getByTestId("personalized-content-list-record-title")
    ).toHaveTextContent(record.title);
    expect(
      screen.getByTestId("personalized-content-list-record-description")
    ).toHaveTextContent(record.description);

    // Learner chip
    expect(
      screen.getByTestId("personalized-content-list-learner-chip")
    ).toHaveTextContent(`Learner Profile: ${record.learnerProfile?.label}`);
  });

  test("should navigate to view route when View button is clicked", () => {
    render(<PersonalizedContentListRecord record={record} />);

    const viewButton = screen.getByTestId(
      "personalized-content-list-button-view"
    );
    fireEvent.click(viewButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/personalized-content/${record.id}`);
  });

  test("should navigate to edit route when Edit button is clicked", () => {
    render(<PersonalizedContentListRecord record={record} />);
    const editButton = screen.getByTestId(
      "personalized-content-list-button-edit"
    );
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(
      `/personalized-content/${record.id}/edit`
    );
  });
});
