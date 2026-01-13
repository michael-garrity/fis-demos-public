import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { getPersonalizedContent } from "./getPersonalizedContent";
import { PersonalizedContentRow, PersonalizedContent } from "../models/PersonalizedContent";
import { factory } from "@/test"

describe("getPersonalizedContent", () => {
  const mockId = crypto.randomUUID();
  const mockRow: PersonalizedContentRow = factory.build("personalizedContent", { id: mockId });

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches personalized content and returns a PersonalizedContent instance", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRow,
    });

    const result = await getPersonalizedContent(mockId);

    expect(fetch).toHaveBeenCalledWith(`/api/personalized-content/${mockId}`);
    expect(result).toBeInstanceOf(PersonalizedContent);
    expect(result.id).toBe(mockId);
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getPersonalizedContent(mockId)).rejects.toThrow(
      `Failed to fetch personalized content '${mockId}'`
    );
  });
});
