import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { putCourseOutline } from "./";
import { CourseOutline } from "../_models";
import { factory } from "@/test"

describe("putCourseOutline", () => {
  const row = factory.build("courseOutline");
  const courseOutline = new CourseOutline(row);

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

    await putCourseOutline(courseOutline);

    expect(fetch).toHaveBeenCalledWith(`/api/course-outlines/${courseOutline.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: row.title,
        description: row.description,
        lesson_outlines: row.lesson_outlines
      })
    });
  });

  it("returns a new course outline from the response data", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...row, title: "Updated" }),
    });

    const result = await putCourseOutline(courseOutline);

    expect(result).toBeInstanceOf(CourseOutline);
    expect(result).not.toBe(courseOutline);
    expect(result.title).toBe("Updated");
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "bad request" }),
    });

    await expect(putCourseOutline(courseOutline)).rejects.toThrow(
      `Failed to update course outline '${courseOutline.id}': bad request`
    );
  });
});
