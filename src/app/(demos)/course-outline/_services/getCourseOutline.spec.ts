import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { getCourseOutline } from "./";
import { CourseOutlineRow, CourseOutline } from "../_models";
import { factory } from "@/test"

describe("getCourseOutline", () => {
  const mockId = crypto.randomUUID();
  const mockRow: CourseOutlineRow = factory.build("courseOutline", { id: mockId });

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches course outline and returns a CourseOutline instance", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRow,
    });

    const result = await getCourseOutline(mockId);

    expect(fetch).toHaveBeenCalledWith(`/api/course-outlines/${mockId}`);
    expect(result).toBeInstanceOf(CourseOutline);
    expect(result.id).toBe(mockId);
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getCourseOutline(mockId)).rejects.toThrow(
      `Failed to fetch course outline '${mockId}'`
    );
  });
});
