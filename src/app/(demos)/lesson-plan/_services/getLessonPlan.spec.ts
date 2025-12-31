import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { getLessonPlan } from "./getLessonPlan";
import { factory } from "@/test";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";

describe("getLessonPlan", () => {
  const mockId = crypto.randomUUID();
  const mockRow: LessonPlanRecord = factory.build("lessonPlan", {
    id: mockId,
  }) as LessonPlanRecord;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches lesson plan and returns a LessonPlanRecord", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRow,
    });

    const result = await getLessonPlan(mockId);

    expect(fetch).toHaveBeenCalledWith(`/api/lesson-plan/${mockId}`);
    expect(result.id).toBe(mockId);
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getLessonPlan(mockId)).rejects.toThrow(
      `Failed to fetch lesson plan '${mockId}'`
    );
  });
});
