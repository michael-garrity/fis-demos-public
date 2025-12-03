import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import LearnerProfileChip from "./LearnerProfileChip";
import { LearnerProfile } from "@/types";
import { useLearnerProfiles } from "@demos/_store/useLearnerProfiles";

interface MockLearnerProfileCardProps {
  learnerProfile: LearnerProfile;
}

interface MockHeroChipProps {
  children: React.ReactNode;
  startContent?: React.ReactNode;
  "data-testid"?: string;
  className?: string;
}

const MOCK_PROFILE: LearnerProfile = {
  id: "42",
  name: "Advanced Pythonista",
  age: "35",
  readingLevel: "Professional",
  experience: "10+ years in development.",
  interests: ["AI", "Algorithms", "Testing"],
};

const MOCK_PROFILES_ARRAY: LearnerProfile[] = [
  MOCK_PROFILE,
  {
    id: "101",
    name: "Beginner Frontend",
    age: "22",
    readingLevel: "Intermediate",
    experience: "Just started learning React.",
    interests: ["React", "CSS"],
  },
];

vi.mock("@demos/_store/useLearnerProfiles", () => ({
  useLearnerProfiles: vi.fn(),
}));

vi.mock("./LearnerProfileCard", () => ({
  default: ({ learnerProfile }: MockLearnerProfileCardProps) => (
    <div data-testid="mock-profile-card">Card for: {learnerProfile.name}</div>
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
    Spinner: (props: any) => <div data-testid="mock-spinner" {...props} />,
  };
});

type UseLearnerProfilesReturn = ReturnType<typeof useLearnerProfiles>;

describe("LearnerProfileChip", () => {
  // Cast the mock hook for easier use in test setup
  const mockUseLearnerProfiles = vi.mocked(useLearnerProfiles);

  beforeEach(() => {
    mockUseLearnerProfiles.mockReturnValue({
      data: MOCK_PROFILES_ARRAY,
      isLoading: false,
      isError: false,
      error: null,
    } as UseLearnerProfilesReturn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Functional Tests", () => {
    it("renders a loading chip when data is loading", () => {
      mockUseLearnerProfiles.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as UseLearnerProfilesReturn);

      render(<LearnerProfileChip learnerProfileId={MOCK_PROFILE.id} />);

      // Check for the Loading text and the Spinner
      const chip = screen.getByTestId("learner-profile-chip");
      expect(chip).toHaveTextContent("Loading");
      expect(screen.getByTestId("mock-spinner")).toBeInTheDocument();
    });

    it("renders 'Unknown Learner' chip when ID is not found in the list", () => {
      // The hook returns the array, but the requested ID ('999') does not match.
      render(<LearnerProfileChip learnerProfileId="999" />);

      // The logic should fall through to the "Unknown Learner" chip
      expect(screen.getByTestId("mock-chip")).toHaveTextContent(
        "Unknown Learner"
      );
      expect(screen.queryByTestId("popover-trigger")).not.toBeInTheDocument();
    });

    it("renders the profile name as the PopoverTrigger when successful", () => {
      render(<LearnerProfileChip learnerProfileId={MOCK_PROFILE.id} />);

      // Check that the Popover structure and profile name are rendered
      expect(screen.getByTestId("popover-trigger")).toBeInTheDocument();
      expect(screen.getByTestId("popover-trigger")).toHaveTextContent(
        MOCK_PROFILE.name
      );
    });

    it("renders LearnerProfileCard inside PopoverContent with correct data", () => {
      render(<LearnerProfileChip learnerProfileId={MOCK_PROFILE.id} />);

      // Check that the PopoverContent wrapper is rendered
      const content = screen.getByTestId("popover-content");
      expect(content).toBeInTheDocument();

      // Check that the mock profile card is rendered inside the content wrapper
      const mockCard = screen.getByTestId("mock-profile-card");
      expect(mockCard).toBeInTheDocument();

      // Check that the mock card received the correct profile data
      expect(mockCard).toHaveTextContent(`Card for: ${MOCK_PROFILE.name}`);
    });

    it("uses the provided custom data-testid", () => {
      const CUSTOM_TEST_ID = "custom-learner-test-id";
      mockUseLearnerProfiles.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as UseLearnerProfilesReturn);

      render(
        <LearnerProfileChip
          learnerProfileId={MOCK_PROFILE.id}
          data-testid={CUSTOM_TEST_ID}
        />
      );

      expect(screen.getByTestId(CUSTOM_TEST_ID)).toBeInTheDocument();
    });
  });

  // --- SNAPSHOT TESTS ---
  describe("Snapshot Tests", () => {
    it("should match snapshot in Loading state", () => {
      mockUseLearnerProfiles.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as UseLearnerProfilesReturn);

      const { container } = render(
        <LearnerProfileChip learnerProfileId={MOCK_PROFILE.id} />
      );
      expect(container).toMatchSnapshot();
    });

    it("should match snapshot in Unknown Learner state", () => {
      mockUseLearnerProfiles.mockReturnValue({
        data: MOCK_PROFILES_ARRAY,
        isLoading: false,
        isError: false,
        error: null,
      } as UseLearnerProfilesReturn);

      const { container } = render(
        <LearnerProfileChip learnerProfileId="999" />
      );
      expect(container).toMatchSnapshot();
    });

    it("should match snapshot in Success state (Profile Found)", () => {
      // Uses the beforeEach mock setup (Success state)
      const { container } = render(
        <LearnerProfileChip learnerProfileId={MOCK_PROFILE.id} />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
