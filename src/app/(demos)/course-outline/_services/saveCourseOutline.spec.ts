import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCourseOutlines } from "./getCourseOutlines";
import { CourseOutline } from "../_models";
import { CourseOutlineRecord } from "@/types";

describe("getCourseOutlines", () => {
  const mockRows: CourseOutlineRecord[] = [
    {
      id: "1",
      title: "Course 1",
      description: "First course",
      numberOfLessons: 3,
      durationValue: 60,
      durationUnit: "minutes",
      learnerProfileId: "learner-1",
    },
    {
      id: "2",
      title: "Course 2",
      description: "Second course",
      numberOfLessons: 5,
      durationValue: 120,
      durationUnit: "minutes",
      learnerProfileId: "learner-2",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches course outlines and maps them to CourseOutline instances", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRows),
        })
      ) as unknown as typeof fetch
    );

    const result = await getCourseOutlines();

    // Check that each item is an instance of CourseOutline
    expect(result.every((r) => r instanceof CourseOutline)).toBe(true);

    // Check that the data matches
    expect(result.map((r) => r.id)).toEqual(mockRows.map((r) => r.id));

    // Ensure fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/course-outlines");
  });

  it("throws an error if the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      ) as unknown as typeof fetch
    );

    await expect(getCourseOutlines()).rejects.toThrow(
      "Failed to fetch course outlines list"
    );
  });
});
