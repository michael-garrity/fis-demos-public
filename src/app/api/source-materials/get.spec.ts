import { describe, it, expect, vi, beforeEach } from "vitest";
import * as Sentry from "@sentry/nextjs";
import { getClient } from "@/lib/supabase"; // Mock path
import { GET } from "./route"; // Relative import

// 1. Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

// 2. Mock Supabase for the simple .select("*") chain
vi.mock("@/lib/supabase", () => {
  // Spy for .select()
  const mockSelect = vi.fn();

  // Root spy for .from()
  const mockFrom = vi.fn(() => ({
    select: mockSelect,
  }));

  return {
    getClient: vi.fn(() => ({
      from: mockFrom,
    })),
  };
});

describe("API Route Handlers: Source Materials Index (GET)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Helper to access spies ---
  const getMocks = () => {
    const client = getClient();
    const from = client.from;

    // Simulate the chain to get the select spy reference
    const select = from("source_materials").select;

    vi.clearAllMocks(); // Clear history from setup steps

    return { from, select };
  };

  describe("GET handler", () => {
    it("should return all records with 200 status on success", async () => {
      const { from, select } = getMocks();

      const mockData = [
        { id: "1", title: "Source A", markdown: "Content A" },
        { id: "2", title: "Source B", markdown: "Content B" },
      ];

      // Mock DB success response
      vi.mocked(select).mockResolvedValueOnce({
        data: mockData,
        error: null,
        count: null,
        status: 200,
        statusText: "OK",
      } as any);

      const response = await GET();
      const body = await response.json();

      // Assertions
      expect(from).toHaveBeenCalledWith("source_materials");
      expect(select).toHaveBeenCalledWith("*");

      expect(response.status).toBe(200);
      expect(body).toEqual(mockData);
    });

    it("should return 500 status and call Sentry on database error", async () => {
      const { select } = getMocks();
      const mockError = new Error("Database timeout");

      // Mock DB Error response
      vi.mocked(select).mockResolvedValueOnce({
        data: null,
        error: mockError,
        count: null,
        status: 500,
        statusText: "Internal Server Error",
      } as any);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({ error: mockError.message });
      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    });
  });
});
