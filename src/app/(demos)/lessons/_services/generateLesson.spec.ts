import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";

import { factory } from "@/test";
import { Lesson } from "../_models";
import { generateLesson, LessonGenerateRequest } from "./generateLesson";

describe("generateLesson", () => {
  const mockRow = factory.build("lesson");
  const payload: LessonGenerateRequest = {
    title: "Generated Atoms Lesson",
    customization: "Keep examples practical.",
    creation_meta: {
      learner_profile: {
        label: "7th grader",
        age: 12,
        reading_level: 5,
        experience: "Has completed intro STEM activities.",
        interests: ["Robotics", "Graphic novels"],
      },
      source_material: {
        title: "What is an Atom?",
        content: "Atoms are the building blocks of matter.",
      },
    },
  };

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts payload and returns a Lesson instance", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRow,
    });

    const result = await generateLesson(payload);

    expect(fetch).toHaveBeenCalledWith("/api/lessons/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(result).toBeInstanceOf(Lesson);
    expect(result.id).toBe(mockRow.id);
  });

  it("throws an error when generation fails", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => "internal server error",
    });

    await expect(generateLesson(payload)).rejects.toThrow(
      "Failed to generate lesson: internal server error",
    );
  });
});
