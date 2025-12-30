import { LearnerProfile, LearnerProfileChip } from "@/lib/learner-profiles";
import { describe, it, expect, vi } from "vitest";
import { factory } from "@/test";
import { render, screen } from "@testing-library/react";

interface MockLearnerProfileCardProps {
  learnerProfile: LearnerProfile;
}

interface MockHeroChipProps {
  children: React.ReactNode;
  startContent?: React.ReactNode;
  "data-testid"?: string;
  className?: string;
}

vi.mock("./LearnerProfileCard", () => ({
  default: ({ learnerProfile }: MockLearnerProfileCardProps) => (
    <div data-testid="mock-profile-card">Card for: {learnerProfile.label}</div>
  ),
}));

vi.mock("@heroui/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@heroui/react")>();
  return {
    ...actual,
    Chip: ({ children, startContent, ...props }: MockHeroChipProps) => (
      <div data-testid="mock-chip" {...props}>
        {startContent}
        <span>{children}</span>
      </div>
    ),
    Popover: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="popover-trigger">{children}</div>
    ),
    PopoverContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="popover-content">{children}</div>
    ),
    Spinner: (props: any) => <div data-testid="mock-spinner" {...props} />, // eslint-disable-line @typescript-eslint/no-explicit-any
  };
});

describe("LearnerProfileChip", () => {
  const learnerProfile = new LearnerProfile(factory.build("learnerProfile"));

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Functional Tests", () => {
    it("renders a loading chip when data is loading", () => {
      render(<LearnerProfileChip isLoading learnerProfile={null} />);

      const chip = screen.getByTestId("learner-profile-chip");
      expect(chip).toHaveTextContent("Loading");
      expect(screen.getByTestId("mock-spinner")).toBeInTheDocument();
    });

    it("renders 'Unknown Learner' chip when learner profile is null", () => {
      render(<LearnerProfileChip learnerProfile={null} />);

      expect(screen.getByTestId("learner-profile-chip")).toHaveTextContent(
        "Unknown Learner"
      );
      expect(screen.queryByTestId("popover-trigger")).not.toBeInTheDocument();
    });

    it("renders the profile name as the PopoverTrigger when successful", () => {
      render(<LearnerProfileChip learnerProfile={learnerProfile} />);

      expect(screen.getByTestId("popover-trigger")).toBeInTheDocument();
      expect(screen.getByTestId("popover-trigger")).toHaveTextContent(
        learnerProfile.label
      );
    });

    it("renders LearnerProfileCard inside PopoverContent with correct data", () => {
      render(<LearnerProfileChip learnerProfile={learnerProfile} />);

      const content = screen.getByTestId("popover-content");
      expect(content).toBeInTheDocument();

      const mockCard = screen.getByTestId("mock-profile-card");
      expect(mockCard).toBeInTheDocument();

      expect(mockCard).toHaveTextContent(`Card for: ${learnerProfile.label}`);
    });

    it("uses the provided custom data-testid", () => {
      const testid = "custom-learner-test-id";

      render(
        <LearnerProfileChip
          learnerProfile={learnerProfile}
          data-testid={testid}
        />
      );

      expect(screen.getByTestId(testid)).toBeInTheDocument();
    });
  });

  describe("Snapshot Tests", () => {
    it("should match snapshot in Loading state", () => {
      const { container } = render(
        <LearnerProfileChip learnerProfile={null} isLoading />
      );
      expect(container).toMatchSnapshot();
    });

    it("should match snapshot in Unknown Learner state", () => {
      const { container } = render(
        <LearnerProfileChip learnerProfile={null} data-testid="mock-chip" />
      );
      expect(container).toMatchSnapshot();
    });

    it("should match snapshot in Success state (Profile Found)", () => {
      const data = factory.build("learnerProfile", {
        label: "Advanced Pythonista",
      });
      const profile = new LearnerProfile(data);
      const { container } = render(
        <LearnerProfileChip learnerProfile={profile} data-testid="mock-chip" />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
