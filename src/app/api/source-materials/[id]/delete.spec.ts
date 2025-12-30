import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { type Mock } from "vitest"; // Import Mock to fix type issues
import * as Sentry from "@sentry/nextjs";
import { getClient } from "@/lib/supabase"; // Mock path
import { DELETE } from "./route"; // Relative import

// 1. Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

// 2. Mock Supabase with extended spies for the DELETE chain
vi.mock("@/lib/supabase", () => {
  // Chain spies: .delete({ count: "exact" }) -> .eq("id", id)
  const mockEq = vi.fn();
  const mockDelete = vi.fn(() => ({ eq: mockEq }));

  // Root spy for .from()
  const mockFrom = vi.fn(() => ({
    delete: mockDelete,
  }));

  return {
    getClient: vi.fn(() => ({
      from: mockFrom,
    })),
  };
});

describe("API Route Handlers: Source Materials DELETE", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Helper to access spies ---
  const getMocks = () => {
    const client = getClient();
    const from = client.from;

    // Simulate the chain to get specific spy references
    const chainDelete = client.from("any" as any).delete({} as any);

    // Force cast to Mock to prevent "type instantiation excessively deep" error
    const deleteSpy = from("source_materials").delete as unknown as Mock;
    const eq = chainDelete.eq as unknown as Mock;

    vi.clearAllMocks(); // Clear history from setup steps

    return { from, deleteSpy, eq };
  };

  const mockRequest = {} as NextRequest;
  const mockParams = { params: Promise.resolve({ id: "source-123" }) };

  describe("DELETE handler", () => {
    it("should return 204 status on successful deletion (count > 0)", async () => {
      const { from, deleteSpy, eq } = getMocks();

      // Mock DB success response with count = 1
      eq.mockResolvedValueOnce({
        data: null,
        error: null,
        count: 1, // Crucial for success path
        status: 204,
        statusText: "No Content",
      });

      const response = await DELETE(mockRequest, mockParams);

      // Assertions
      expect(from).toHaveBeenCalledWith("source_materials");
      expect(deleteSpy).toHaveBeenCalledWith({ count: "exact" });
      expect(eq).toHaveBeenCalledWith("id", "source-123");

      expect(response.status).toBe(204);
      expect(response.body).toBe(null);
    });

    it("should return 404 when record is not found (count is 0 or null)", async () => {
      const { eq } = getMocks();

      // Mock DB response where nothing was deleted
      eq.mockResolvedValueOnce({
        data: null,
        error: null,
        count: 0, // Indicates not found
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

      // Mock DB Error response
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
