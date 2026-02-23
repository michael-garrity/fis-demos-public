import { describe, it, expect, vi, beforeEach } from "vitest";
import * as Sentry from "@sentry/nextjs";
import { getClient } from "../../../lib/supabase";
import { GET } from "../../../app/api/lessons/route";

// 1. Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

// 2. Mock Supabase with internal spies
vi.mock("@/lib/supabase", () => {
  // Spy for the GET chain: .select("*")
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

describe("API Route Handlers: /api/lessons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Helper to access spies ---
  const getMocks = () => {
    const client = getClient();
    const from = client.from;

    // Access the hidden spies inside the mock chain
    const chain = client.from("lessons" as any);
    const select = chain.select;

    // Clear the history of these setup calls so tests start fresh
    vi.clearAllMocks();

    return { from, select };
  };

  describe("GET handler", () => {
    const mockData = [
      {
        id: "1",
        title: "Introduction to Atoms",
        content: "Atoms are the smallest building blocks...",
        creation_meta: { learner_profile: { label: "7th grader", age: 12 } },
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        title: "The Water Cycle",
        content: "Water is always moving around...",
        creation_meta: { learner_profile: { label: "4th grader", age: 9 } },
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    it("should return lessons data with 200 status on successful fetch", async () => {
      const { from, select } = getMocks();

      vi.mocked(select).mockResolvedValueOnce({
        data: mockData,
        error: null,
        count: null,
        status: 200,
        statusText: "OK",
      } as any);

      const response = await GET();
      const body = await response.json();

      expect(from).toHaveBeenCalledWith("lessons");
      expect(select).toHaveBeenCalledWith("*");
      expect(response.status).toBe(200);
      expect(body).toEqual(mockData);
    });

    it("should return 500 status and call Sentry on database error", async () => {
      const { select } = getMocks();
      const mockError = new Error("Connection pool timeout");

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
