import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { addToast } from "@heroui/react";

import CreateLessonPage from "./page";

const pushMock = vi.fn();
const generateLessonMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@heroui/react", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    addToast: vi.fn(),
    Select: ({
      children = null,
      onSelectionChange,
      placeholder,
      ...props
    }: {
      children?: React.ReactNode;
      onSelectionChange?: (value: { currentKey: string }) => void;
      placeholder?: string;
      [key: string]: unknown;
    }) => (
      <select
        data-testid={String(props["data-testid"] ?? "mock-select")}
        aria-label={String(props["label"] ?? placeholder ?? "select")}
        onChange={(e) =>
          onSelectionChange?.({
            currentKey: e.target.value,
          })
        }
      >
        <option value="">Select</option>
        {children}
      </select>
    ),
    SelectItem: ({ children }: { children: React.ReactNode }) => (
      <option value={String(children)}>{children}</option>
    ),
  };
});

vi.mock("../../_store/useLearnerProfiles", () => ({
  useLearnerProfiles: () => ({
    isLoading: false,
    data: [
      {
        id: "7th grader",
        label: "7th grader",
        age: 12,
        readingLevel: 5,
        experience: "Has completed introductory STEM activities.",
        interests: ["Robotics", "Graphic novels"],
      },
    ],
  }),
}));

vi.mock("../_store", () => ({
  useGenerateLesson: () => ({
    mutateAsync: generateLessonMock,
    isPending: false,
  }),
}));

vi.mock("../../_components/SourceSelector", () => ({
  SourceSelector: ({
    onSourceChange,
    onViewSource,
  }: {
    onSourceChange: (value: { title: string; markdown: string }) => void;
    onViewSource: () => void;
  }) => (
    <div>
      <button
        data-testid="mock-source-fill"
        onClick={() =>
          onSourceChange({
            title: "What is an Atom?",
            markdown: "Atoms are the building blocks of matter.",
          })
        }
      >
        Fill Source
      </button>
      <button data-testid="mock-source-view" onClick={onViewSource}>
        View Source
      </button>
    </div>
  ),
}));

vi.mock("../../_components/ViewSourceModal", () => ({
  ViewSourceModal: ({
    isOpen,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    markdown: string;
  }) =>
    isOpen ? (
      <div data-testid="view-source-modal">Source Modal Open</div>
    ) : null,
}));

vi.mock("../../_components/DemoNavigationPanel", () => ({
  default: () => <div data-testid="demo-navigation-panel" />,
}));

describe("CreateLessonPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders expected fields and submit button", () => {
    render(<CreateLessonPage />);

    expect(screen.getByTestId("lesson-create-title")).toBeInTheDocument();
    expect(
      screen.getByTestId("lesson-create-learner-profile"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("lesson-create-customization"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("lesson-create-submit")).toBeInTheDocument();
  });

  it("keeps submit disabled until required fields are complete", () => {
    render(<CreateLessonPage />);
    const submit = screen.getByTestId("lesson-create-submit");
    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByTestId("lesson-create-title"), {
      target: { value: "Generated Lesson" },
    });
    expect(submit).toBeDisabled();

    fireEvent.click(screen.getByTestId("mock-source-fill"));
    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByTestId("lesson-create-learner-profile"), {
      target: { value: "7th grader" },
    });
    expect(submit).not.toBeDisabled();
  });

  it("submits payload and redirects on success", async () => {
    generateLessonMock.mockResolvedValueOnce({
      id: "lesson-123",
      title: "Generated Lesson",
    });

    render(<CreateLessonPage />);

    fireEvent.change(screen.getByTestId("lesson-create-title"), {
      target: { value: "Generated Lesson" },
    });
    fireEvent.click(screen.getByTestId("mock-source-fill"));
    fireEvent.change(screen.getByTestId("lesson-create-learner-profile"), {
      target: { value: "7th grader" },
    });
    fireEvent.change(screen.getByTestId("lesson-create-customization"), {
      target: { value: "Focus on practical examples." },
    });

    fireEvent.click(screen.getByTestId("lesson-create-submit"));

    await waitFor(() => expect(generateLessonMock).toHaveBeenCalledOnce());

    expect(generateLessonMock).toHaveBeenCalledWith({
      title: "Generated Lesson",
      customization: "Focus on practical examples.",
      creation_meta: {
        learner_profile: {
          label: "7th grader",
          age: 12,
          reading_level: 5,
          experience: "Has completed introductory STEM activities.",
          interests: ["Robotics", "Graphic novels"],
        },
        source_material: {
          title: "What is an Atom?",
          content: "Atoms are the building blocks of matter.",
        },
      },
    });

    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/lessons/lesson-123"),
    );
    expect(addToast).toHaveBeenCalled();
  });

  it("shows error toast when generation fails", async () => {
    generateLessonMock.mockRejectedValueOnce(new Error("Generation failed"));

    render(<CreateLessonPage />);

    fireEvent.change(screen.getByTestId("lesson-create-title"), {
      target: { value: "Generated Lesson" },
    });
    fireEvent.click(screen.getByTestId("mock-source-fill"));
    fireEvent.change(screen.getByTestId("lesson-create-learner-profile"), {
      target: { value: "7th grader" },
    });

    fireEvent.click(screen.getByTestId("lesson-create-submit"));

    await waitFor(() => expect(generateLessonMock).toHaveBeenCalledOnce());
    await waitFor(() => expect(addToast).toHaveBeenCalled());
    expect(pushMock).not.toHaveBeenCalled();
  });
});
