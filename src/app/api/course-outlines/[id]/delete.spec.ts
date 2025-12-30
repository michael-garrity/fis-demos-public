import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { type Mock } from "vitest"; // 1. Import Mock type
import * as Sentry from "@sentry/nextjs";
import { getClient } from "@/lib/supabase";
import { DELETE } from "./route";

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

vi.mock("@/lib/supabase", () => {
  const mockEq = vi.fn();
  const mockDelete = vi.fn(() => ({ eq: mockEq }));
  const mockFrom = vi.fn(() => ({ delete: mockDelete }));

  return {
    getClient: vi.fn(() => ({ from: mockFrom })),
  };
});

describe("API Route Handlers: Course Outlines DELETE", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getMocks = () => {
    const client = getClient();
    const from = client.from;

    // Simulate chain to grab references
    const chainDelete = client.from("any" as any).delete({} as any);

    // 2. FORCE CAST these to 'Mock' to stop TypeScript from calculating
    // the infinite Supabase types.
    const deleteSpy = from("course_outlines").delete as unknown as Mock;
    const eq = chainDelete.eq as unknown as Mock;

    vi.clearAllMocks();
    return { from, deleteSpy, eq };
  };

  const mockRequest = {} as NextRequest;
  const mockParams = { params: Promise.resolve({ id: "course-123" }) };

  describe("DELETE handler", () => {
    it("should return 204 status on successful deletion (count > 0)", async () => {
      const { from, deleteSpy, eq } = getMocks();

      // 3. REMOVE vi.mocked(). Just use eq.mockResolvedValueOnce directly.
      eq.mockResolvedValueOnce({
        data: null,
        error: null,
        count: 1,
        status: 204,
        statusText: "No Content",
      });

      const response = await DELETE(mockRequest, mockParams);

      expect(from).toHaveBeenCalledWith("course_outlines");
      expect(deleteSpy).toHaveBeenCalledWith({ count: "exact" });
      expect(eq).toHaveBeenCalledWith("id", "course-123");

      expect(response.status).toBe(204);
      expect(response.body).toBe(null);
    });

    it("should return 404 when record is not found (count is 0 or null)", async () => {
      const { eq } = getMocks();

      eq.mockResolvedValueOnce({
        data: null,
        error: null,
        count: 0,
        status: 204,
        statusText: "No Content",
      });

      const response = await DELETE(mockRequest, mockParams);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe("Not found");
    });

    it("should return 500 status and call Sentry on database error", async () => {
      const { eq } = getMocks();
      const mockError = new Error("Foreign key violation");

      eq.mockResolvedValueOnce({
        data: null,
        error: mockError,
        count: null,
        status: 500,
        statusText: "Internal Server Error",
      });

      const response = await DELETE(mockRequest, mockParams);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({ error: mockError.message });
      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    });
  });
});
