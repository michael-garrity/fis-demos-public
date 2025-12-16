import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";
import { getCourseOutlines } from "./getCourseOutlines";
import { CourseOutlineRow, CourseOutline } from "../_models";
import { factory } from "@/test"

describe("getCourseOutlines", () => {
  const mockRows: CourseOutlineRow[] = [
    factory.build("courseOutline", { id: crypto.randomUUID() }),
    factory.build("courseOutline", { id: crypto.randomUUID() })
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

    const result = await getCourseOutlines();

    expect(fetch).toHaveBeenCalledWith("/api/course-outlines");
    expect(result).toHaveLength(mockRows.length);
    result.forEach((item, index) => {
      expect(item).toBeInstanceOf(CourseOutline);
      expect(item.id).toBe(mockRows[index].id);
    });
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getCourseOutlines()).rejects.toThrow(
      "Failed to fetch course outlines list"
    );
  });
});
