import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getClient } from "@/lib/supabase"; // Mock path
import { GET } from "./route"; // Relative import

// 1. Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

// 2. Mock Supabase with extended spies for the GET chain
vi.mock("@/lib/supabase", () => {
  // Chain spies: .select("*") -> .eq("id", ...) -> .maybeSingle()
  const mockMaybeSingle = vi.fn();
  const mockEq = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));

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

describe("API Route Handlers: Course Outlines GET", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Helper to access spies ---
  const getMocks = () => {
    const client = getClient();
    const from = client.from;

    // Simulate the chain to get specific spy references
    const chainSelect = client.from("any_table" as any).select("*");
    const chainEq = chainSelect.eq("id", "1");

    const select = from("course_outlines").select; // Reference to the select spy
    const eq = chainSelect.eq; // Reference to the eq spy
    const maybeSingle = chainEq.maybeSingle; // Reference to the end spy

    vi.clearAllMocks(); // Clear history from setup steps

    return { from, select, eq, maybeSingle };
  };

  const mockRequest = {} as NextRequest; // GET requests usually don't need a body mock
  const mockParams = { params: Promise.resolve({ id: "course-123" }) };

  describe("GET handler", () => {
    it("should return the record with 200 status on success", async () => {
      const { from, select, eq, maybeSingle } = getMocks();

      const mockRecord = {
        id: "course-123",
        title: "Introduction to Biology",
        description: "Cells and stuff.",
      };

      // Mock DB success response
      vi.mocked(maybeSingle).mockResolvedValueOnce({
        data: mockRecord,
        error: null,
        count: null,
        status: 200,
        statusText: "OK",
      } as any);

      const response = await GET(mockRequest, mockParams);
      const body = await response.json();

      // Assertions
      expect(from).toHaveBeenCalledWith("course_outlines");
      expect(select).toHaveBeenCalledWith("*");
      expect(eq).toHaveBeenCalledWith("id", "course-123");
      expect(maybeSingle).toHaveBeenCalled();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockRecord);
    });

    it("should return 404 when record is not found (data is null)", async () => {
      const { maybeSingle } = getMocks();

      // Mock DB "Not Found" response (valid query, but no rows returned)
      vi.mocked(maybeSingle).mockResolvedValueOnce({
        data: null, // Supabase returns null data for not found in maybeSingle
        error: null,
        count: null,
        status: 200,
        statusText: "OK",
      } as any);

      const response = await GET(mockRequest, mockParams);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe("Not found");
    });

    it("should return 500 status and call Sentry on database error", async () => {
      const { maybeSingle } = getMocks();
      const mockError = new Error("Connection pool timeout");

      // Mock DB Error response
      vi.mocked(maybeSingle).mockResolvedValueOnce({
        data: null,
        error: mockError,
        count: null,
        status: 500,
        statusText: "Internal Server Error",
      } as any);

      const response = await GET(mockRequest, mockParams);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({ error: mockError.message });
      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    });
  });
});
