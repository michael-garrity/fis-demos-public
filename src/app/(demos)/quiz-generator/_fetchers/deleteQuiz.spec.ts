import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { getQuizzes } from "./getQuizzes";
import { deleteQuiz } from "./deleteQuiz";

describe("getCourseOutlines", () => {
  const firstID = crypto.randomUUID()

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches course outlines and returns CourseOutline instances", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => firstID,
    });

    const result = await deleteQuiz(firstID);

    expect(fetch).toHaveBeenCalledWith(`/api/quizzes/${firstID}`, {method: "DELETE"});
    expect(result).toEqual(firstID);
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
