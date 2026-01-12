import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPersonalizedContentList } from "./getPersonalizedContentList";
import { PersonalizedContent } from "../_models";
import { PersonalizedContentRecord } from "@/types";

describe("getPersonalizedContentList", () => {
  const mockRows: PersonalizedContentRecord[] = [
    {
      id: "1",
      title: "Personalized Content 1",
      learnerProfileId: "learner-1",
    },
    {
      id: "2",
      title: "Personalized Content 2",
      learnerProfileId: "learner-2",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches personalized content and maps them to PersonalizedContent instances", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRows),
        })
      ) as unknown as typeof fetch
    );

    const result = await getPersonalizedContentList();

    // Check that each item is an instance of PersonalizedContent
    expect(result.every((r) => r instanceof PersonalizedContent)).toBe(true);

    // Check that the data matches
    expect(result.map((r) => r.id)).toEqual(mockRows.map((r) => r.id));

    // Ensure fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/personalized-content");
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

    await expect(getPersonalizedContentList).rejects.toThrow(
      "Failed to fetch personalized content list"
    );
  });
});
