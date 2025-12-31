import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { putLessonPlan } from "./putLessonPlan";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { factory } from "@/test";

describe("putLessonPlan", () => {
  const lessonPlan: LessonPlanRecord = factory.build(
    "lessonPlan"
  ) as LessonPlanRecord;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("makes a put request with the correct payload", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => lessonPlan,
    });

    await putLessonPlan(lessonPlan);

    expect(fetch).toHaveBeenCalledWith(`/api/lesson-plan/${lessonPlan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonPlan),
    });
  });

  it("returns a new lesson plan from the response data", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...lessonPlan,
        creation_meta: {
          ...lessonPlan.creation_meta,
          source_material: {
            ...lessonPlan.creation_meta.source_material,
            title: "Updated",
          },
        },
      }),
    });

    const result = await putLessonPlan(lessonPlan);

    expect(result).not.toBe(lessonPlan);
    expect(result.creation_meta.source_material.title).toBe("Updated");
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "bad request" }),
    });

    await expect(putLessonPlan(lessonPlan)).rejects.toThrow(
      `Failed to update lesson plan '${lessonPlan.id}': bad request`
    );
  });
});
