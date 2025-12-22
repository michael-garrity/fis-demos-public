import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";
import { getLearnerProfiles } from "@/lib/learner-profiles";
import { LearnerProfileRow, LearnerProfile } from "@/lib/learner-profiles";
import { factory } from "@/test"

describe("getLearnerProfiles", () => {
  const mockRows: LearnerProfileRow[] = factory.buildList("learnerProfile", 2)


  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches all records and returns LearnerProfile instances", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRows,
    });

    const result = await getLearnerProfiles();

    expect(fetch).toHaveBeenCalledWith("/api/learner-profiles");
    expect(result).toHaveLength(mockRows.length);
    result.forEach((item, index) => {
      expect(item).toBeInstanceOf(LearnerProfile);
      expect(item.id).toBe(mockRows[index].id);
    });
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getLearnerProfiles()).rejects.toThrow(
      "Failed to fetch learner profiles"
    );
  });
});
