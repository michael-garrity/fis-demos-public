import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";
import { getPersonalizedContentList } from "./getPersonalizedContentList";
import { PersonalizedContentRow, PersonalizedContent } from "../models/PersonalizedContent";
import { factory } from "@/test"

describe("getPersonalizedContentList", () => {
  const mockRows: PersonalizedContentRow[] = [
    factory.build("personalizedContent", { id: crypto.randomUUID() }),
    factory.build("personalizedContent", { id: crypto.randomUUID() })
  ]

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches personalized content and returns PersonalizedContent instances", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRows,
    });

    const result = await getPersonalizedContentList();

    expect(fetch).toHaveBeenCalledWith("/api/personalized-content");
    expect(result).toHaveLength(mockRows.length);
    result.forEach((item, index) => {
      expect(item).toBeInstanceOf(PersonalizedContent);
      expect(item.id).toBe(mockRows[index].id);
    });
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getPersonalizedContentList()).rejects.toThrow(
      "Failed to fetch personalized content list"
    );
  });
});
