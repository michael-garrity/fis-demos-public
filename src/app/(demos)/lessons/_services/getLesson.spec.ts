import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";
import { getLesson } from "./getLesson";
import { LessonRow, Lesson } from "../_models";
import { factory } from "@/test";

describe("getLesson", () => {
  const lessonId = crypto.randomUUID();
  const mockRow: LessonRow = factory.build("lesson", { id: lessonId });

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches a lesson and returns a Lesson instance", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRow,
    });

    const result = await getLesson(lessonId);

    expect(fetch).toHaveBeenCalledWith(`/api/lessons/${lessonId}`);
    expect(result).toBeInstanceOf(Lesson);
    expect(result.id).toBe(lessonId);
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getLesson(lessonId)).rejects.toThrow("Failed to fetch lesson");
  });
});
