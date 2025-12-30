import LearnerProfileCard from "./LearnerProfileCard";
import { LearnerProfile } from "@/lib/learner-profiles";
import { describe, it, expect } from "vitest";
import { factory } from "@/test";
import { render } from "@testing-library/react";

describe("LearnerProfileCard (Snapshot)", () => {
  it("should match snapshot with a fully populated profile", () => {
    const data = factory.build("learnerProfile", {
      id: "42",
      label: "Advanced Pythonista",
      age: 35,
      readingLevel: "Professional",
      experience:
        "10+ years in development, focusing on backend systems and machine learning.",
      interests: ["Python", "Algorithms", "AI", "Testing"],
    });

    const profile = new LearnerProfile(data);
    const { container } = render(
      <LearnerProfileCard learnerProfile={profile} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot when profile data is minimal or empty", () => {
    const data = factory.build("learnerProfile", {
      id: "0",
      label: "Minimal Learner",
      age: null,
      readingLevel: "",
      experience: "No formal experience.",
      interests: [],
    });
    const profile = new LearnerProfile(data);
    const { container } = render(
      <LearnerProfileCard learnerProfile={profile} />
    );

    expect(container).toMatchSnapshot();
  });
});
