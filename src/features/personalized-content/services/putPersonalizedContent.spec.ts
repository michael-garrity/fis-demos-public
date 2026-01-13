import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { putPersonalizedContent } from "./putPersonalizedContent";
import { PersonalizedContent } from "../models/PersonalizedContent";
import { factory } from "@/test"

describe("putPersonalizedContent", () => {
  const row = factory.build("personalizedContent");
  const personalizedContent = new PersonalizedContent(row);

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("makes a put request with the correct payload", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => row,
    });

    await putPersonalizedContent(personalizedContent);

    expect(fetch).toHaveBeenCalledWith(`/api/personalized-content/${personalizedContent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: row.title,
        description: row.description,
        content: row.content
      })
    });
  });

  it("returns new personalized content from the response data", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...row, title: "Updated" }),
    });

    const result = await putPersonalizedContent(personalizedContent);

    expect(result).toBeInstanceOf(PersonalizedContent);
    expect(result).not.toBe(personalizedContent);
    expect(result.title).toBe("Updated");
  });

  it("throws an error when the fetch response is not ok", async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "bad request" }),
    });

    await expect(putPersonalizedContent(personalizedContent)).rejects.toThrow(
      `Failed to update personalized content '${personalizedContent.id}': bad request`
    );
  });
});
