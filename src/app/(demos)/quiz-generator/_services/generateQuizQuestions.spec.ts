import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { factory } from "@/test"
import { QuizGenerationState, SourceMaterial } from "@/types";
import { generateQuizQuestions } from "./generateQuizQuestions";
import { LearnerProfile } from "@/lib/learner-profiles";

describe("createQuiz", () => {
  const mockQuiz = factory.build("quiz", {id: crypto.randomUUID()})
  const mockLearner = factory.build("learnerProfile");
  const mockSourceMaterial: SourceMaterial = {
        title: "",
        markdown: ""
  }

  const mockForm: QuizGenerationState = {
    title: mockQuiz.title,
    description: mockQuiz.description,
    customization: "",
    numberOfQuestions: 1,
    learnerProfile: new LearnerProfile(mockLearner),
    sourceMaterial: mockSourceMaterial
  }

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("makes the post with the correct payload", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true, 
        json: async () => mockQuiz
      }
    )

    await generateQuizQuestions(mockForm);

    expect(fetch).toHaveBeenCalledWith("/api/quizzes/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockForm)
    });
  });

  it("successfully returns the new quiz", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true, 
        json: async () => {return {questions: []}}
      }
    )

    const result = await generateQuizQuestions(mockForm);

    expect(result.questions).toBeInstanceOf(Array);
    expect(result.questions.length).toBe(0);
  });

  it("throws an error when the fetch response is not ok", async () => {
    const errorText = "Failed";
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => errorText
    });

    await expect(generateQuizQuestions(mockForm)).rejects.toThrow(
      `Failed to create questions: ${errorText}`
    );
  });
});
