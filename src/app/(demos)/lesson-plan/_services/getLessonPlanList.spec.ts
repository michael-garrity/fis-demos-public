import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";
import { getLessonPlanList } from "./getLessonPlanList";
import { factory } from "@/test";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";

describe("getLessonPlanList", () => {
  const mockRows: LessonPlanRecord[] = [
    factory.build("lessonPlan", {
      id: crypto.randomUUID(),
    }) as LessonPlanRecord,
    factory.build("lessonPlan", {
      id: crypto.randomUUID(),
    }) as LessonPlanRecord,
  ];

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches lesson plans and returns LessonPlanRecord[]", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRows,
    });

    const result = await getLessonPlanList();

    expect(fetch).toHaveBeenCalledWith("/api/lesson-plan");
    expect(result).toHaveLength(mockRows.length);
    result.forEach((item, index) => {
      expect(item.id).toBe(mockRows[index].id);
    });
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getLessonPlanList()).rejects.toThrow(
      "Failed to fetch lesson plan list"
    );
  });
});
