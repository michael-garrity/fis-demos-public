import { PersonalizedContent } from "./";
import { LearnerProfile } from "@/lib/learner-profiles";
import { describe, it, expect } from "vitest";
import { factory } from "@/test";

describe("PersonalizedContent", () => {
  it("returns the correct id", () => {
    const data = factory.build("personalizedContent");
    const personalizedContent = new PersonalizedContent(data);
    expect(personalizedContent.id).toBe(data.id);
  });

  it("returns the learner profile", () => {
    const learnerProfile = factory.build("learnerProfile");
    const data = factory.build("personalizedContent", {
      creationMeta: { learnerProfile },
    });
    const personalizedContent = new PersonalizedContent(data);
    expect(personalizedContent.learnerProfile).toBeInstanceOf(LearnerProfile);
    expect(personalizedContent.learnerProfile?.label).toBe(
      learnerProfile.label
    );
  });

  it("returns the title and description", () => {
    const data = factory.build("personalizedContent");
    const personalizedContent = new PersonalizedContent(data);
    expect(personalizedContent.title).toBe(data.title);
    expect(personalizedContent.description).toBe(data.description);
  });

  it("returns the main content", () => {
    const data = factory.build("personalizedContent");
    const personalizedContent = new PersonalizedContent(data);
    expect(personalizedContent.content).toBe(data.content);
  });

  describe("without learner profile data", () => {
    it("returns null for the learner profile", () => {
      const data = factory.build("personalizedContent", { creation_meta: {} });
      const personalizedContent = new PersonalizedContent(data);
      expect(personalizedContent.learnerProfile).toBeNull();
    });
  });
});
