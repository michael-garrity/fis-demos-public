import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { getQuizzes } from "./getQuizzes";
import { Quiz } from "../_models";
import { factory } from "@/test"
import { QuizRow } from "@/types";

describe("getCourseOutlines", () => {
  const mockRows: QuizRow[] = [
    factory.build("quiz", { id: crypto.randomUUID() }),
    factory.build("quiz", { id: crypto.randomUUID() })
  ]

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches course outlines and returns CourseOutline instances", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRows,
    });

    const result = await getQuizzes();

    expect(fetch).toHaveBeenCalledWith("/api/quizzes");
    expect(result).toHaveLength(mockRows.length);
    result.forEach((item, index) => {
      expect(item).toBeInstanceOf(Quiz);
      expect(item.id).toBe(mockRows[index].id);
    });
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getQuizzes()).rejects.toThrow(
      "Failed to fetch course outlines list"
    );
  });
});
