import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";
import { getLessons } from "./getLessons";
import { LessonRow, Lesson } from "../_models";
import { factory } from "@/test";

describe("getLessons", () => {
  const mockRows: LessonRow[] = [
    factory.build("lesson", { id: crypto.randomUUID() }),
    factory.build("lesson", { id: crypto.randomUUID() }),
  ];

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches lessons and returns Lesson instances", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRows,
    });

    const result = await getLessons();

    expect(fetch).toHaveBeenCalledWith("/api/lessons");
    expect(result).toHaveLength(mockRows.length);
    result.forEach((item, index) => {
      expect(item).toBeInstanceOf(Lesson);
      expect(item.id).toBe(mockRows[index].id);
    });
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getLessons()).rejects.toThrow("Failed to fetch lessons list");
  });
});
