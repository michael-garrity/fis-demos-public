import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { Quiz } from "../_models";
import { factory } from "@/test"
import { QuizRow } from "@/types";
import { saveQuiz } from "./saveQuiz";

describe("createQuiz", () => {
  const mockQuiz: QuizRow = factory.build("quiz", {id: crypto.randomUUID()})

  const mockForm = {
    ...mockQuiz,
    creation_meta: mockQuiz.creation_meta as Record<string, unknown>
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

    await saveQuiz(mockForm);

    expect(fetch).toHaveBeenCalledWith("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockForm)
    });
  });

  it("successfully returns the new quiz", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true, 
        json: async () => mockQuiz
      }
    )

    const result = await saveQuiz(mockForm);

    expect(result).toBeInstanceOf(Quiz);
    expect(result.id).toBe(mockQuiz.id);
  });

  it("throws an error when the fetch response is not ok", async () => {
    const errorText = "Failed";
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => errorText
    });

    await expect(saveQuiz(mockForm)).rejects.toThrow(
      `Failed to create quiz: ${errorText}`
    );
  });
});
