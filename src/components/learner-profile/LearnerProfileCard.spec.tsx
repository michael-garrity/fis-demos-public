import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import LearnerProfileCard from "./LearnerProfileCard";
import { LearnerProfile } from "@/types";

// --- MOCK DATA ---
const MOCK_PROFILE: LearnerProfile = {
  id: "42",
  name: "Advanced Pythonista",
  // Age is a string in the provided type context
  age: "35",
  readingLevel: "Professional",
  experience:
    "10+ years in development, focusing on backend systems and machine learning.",
  interests: ["Python", "Algorithms", "AI", "Testing"],
};

const EMPTY_PROFILE: LearnerProfile = {
  id: "0",
  name: "Minimal Learner",
  age: "",
  readingLevel: "",
  experience: "No formal experience.",
  interests: [],
};

describe("LearnerProfileCard (Snapshot)", () => {
  it("should match snapshot with a fully populated profile", () => {
    // Render the component with the standard mock data
    const { container } = render(
      <LearnerProfileCard learnerProfile={MOCK_PROFILE} />
    );
    // Snapshot ensures the complex output structure (icons, chips, labels) is stable
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot when profile data is minimal or empty", () => {
    // Render the component with minimal data
    const { container } = render(
      <LearnerProfileCard learnerProfile={EMPTY_PROFILE} />
    );
    // Snapshot ensures the component handles empty strings/arrays gracefully without breaking the layout
    expect(container).toMatchSnapshot();
  });
});
