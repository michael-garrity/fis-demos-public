import { describe, it, expect, vi, beforeEach } from "vitest";
import { CourseOutlineFormState } from "@/types";
import { CourseOutlineOutput } from "@/lib/llm-generation/schemas/courseOutline.zod";
import { generateCourseOutline } from "./generateCourseOutline";

describe("generateCourseOutline", () => {
  const mockCourseData: CourseOutlineFormState = {
    id: "1",
    title: "Test Course",
    description: "A test course",
    numberOfLessons: 3,
    durationValue: 120,
    durationUnit: "minutes",
    learnerProfileId: "learner-1",
    customization: "Test customization",
  };

  const mockResponseData: CourseOutlineOutput = {
    title: "Test Course",
    description: "A test course",
    lesson_outlines: [
      {
        title: "Lesson 1",
        description: "Intro",
        outcome: "Learn basics",
        minutes: 40,
      },
      {
        title: "Lesson 2",
        description: "Intermediate",
        outcome: "Learn intermediate concepts",
        minutes: 40,
      },
      {
        title: "Lesson 3",
        description: "Advanced",
        outcome: "Learn advanced concepts",
        minutes: 40,
      },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the generated course outline on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponseData),
        })
      ) as unknown as typeof fetch
    );

    const result = await generateCourseOutline(mockCourseData);
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/course-outlines/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockCourseData),
    });
  });

  it("throws an error when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          text: () => Promise.resolve("Internal Server Error"),
        })
      ) as unknown as typeof fetch
    );

    await expect(generateCourseOutline(mockCourseData)).rejects.toThrow(
      "Failed to create course: Internal Server Error"
    );
  });
});
