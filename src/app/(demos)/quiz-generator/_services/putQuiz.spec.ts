import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { putQuiz } from ".";
import { Quiz } from "../_models";
import { factory } from "@/test"

describe("putQuiz", () => {
  const row = factory.build("quiz");
  const quiz = new Quiz(row);

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("makes a put request with the correct payload", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => row,
    });

    await putQuiz(quiz);

    expect(fetch).toHaveBeenCalledWith(`/api/quizzes/${quiz.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: row.title,
        description: row.description,
        questions: row.questions
      })
    });
  });

  it("returns a new quiz from the response data", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...row, title: "Updated" }),
    });

    const result = await putQuiz(quiz);

    expect(result).toBeInstanceOf(Quiz);
    expect(result).not.toBe(quiz);
    expect(result.title).toBe("Updated");
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "bad request" }),
    });

    await expect(putQuiz(quiz)).rejects.toThrow(
      `Failed to update quiz '${quiz.id}': bad request`
    );
  });
});
