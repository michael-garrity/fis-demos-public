import { Quiz } from ".";
import { LearnerProfile } from "@/lib/learner-profiles";
import { describe, it, expect } from "vitest";
import { factory } from "@/test";

describe("Quiz", () => {
  it("returns the correct id", () => {
    const data = factory.build("quiz");
    const quiz = new Quiz(data);
    expect(quiz.id).toBe(data.id);
  });

  it("returns the learner profile", () => {
    const learnerProfile = factory.build("learnerProfile");
    const data = factory.build("quiz", { creationMeta: { learnerProfile } });
    const quiz = new Quiz(data);
    expect(quiz.learnerProfile).toBeInstanceOf(LearnerProfile);
    expect(quiz.learnerProfile?.label).toBe(learnerProfile.label);
  });

  it("returns the title and description", () => {
    const data = factory.build("quiz");
    const quiz = new Quiz(data);
    expect(quiz.title).toBe(data.title);
    expect(quiz.description).toBe(data.description);
  });

  it("returns the correct quiz Question count", () => {
    const questions = factory.buildList("question", 2);
    const data = factory.build("quiz", { questions });
    const quiz = new Quiz(data);
    expect(quiz.questionCount).toBe(2);
  });

  it("returns the lesson outlines", () => {
    const data = factory.build("quiz");
    const quiz = new Quiz(data);
    expect(quiz.questions).toEqual(data.questions);
  });

  describe("without learner profile data", () => {
    it("returns null for the learner profile", () => {
      const data = factory.build("quiz", { creation_meta: {} });
      const quiz = new Quiz(data);
      expect(quiz.learnerProfile).toBeNull();
    });
  });
});
