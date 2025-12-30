import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { type Mock } from "vitest"; // Import Mock to fix type issues
import * as Sentry from "@sentry/nextjs";
import { getClient } from "@/lib/supabase"; // Mock path
import { POST } from "./route"; // Relative import

// 1. Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

// 2. Mock Supabase with extended spies for the POST chain
vi.mock("@/lib/supabase", () => {
  // Chain spies: .insert().select().single()
  const mockSingle = vi.fn();
  const mockSelect = vi.fn(() => ({ single: mockSingle }));
  const mockInsert = vi.fn(() => ({ select: mockSelect }));

  // Root spy for .from()
  const mockFrom = vi.fn(() => ({
    insert: mockInsert,
  }));

  return {
    getClient: vi.fn(() => ({
      from: mockFrom,
    })),
  };
});

describe("API Route Handlers: Source Materials POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Helper to access spies ---
  const getMocks = () => {
    const client = getClient();
    const from = client.from;

    // Simulate chain to grab references
    const chainInsert = client.from("any" as any).insert({} as any);
    const chainSelect = chainInsert.select();

    // Force cast to Mock to prevent "type instantiation excessively deep" error
    const insert = from("source_materials").insert as unknown as Mock;
    const single = chainSelect.single as unknown as Mock;

    vi.clearAllMocks(); // Clear setup history

    return { from, insert, single };
  };

  const mockRequest = (body: any): NextRequest =>
    ({
      json: vi.fn().mockResolvedValue(body),
    } as unknown as NextRequest);

  describe("POST handler", () => {
    it("should return the created record with 201 status on success", async () => {
      const { from, insert, single } = getMocks();

      const payload = {
        title: "The Odyssey",
        markdown: "# Sing, O Muse...",
      };

      const createdRecord = { id: "new-123", ...payload };

      // Mock DB success response
      single.mockResolvedValueOnce({
        data: createdRecord,
        error: null,
        count: null,
        status: 201,
        statusText: "Created",
      });

      const req = mockRequest(payload);
      const response = await POST(req);
      const body = await response.json();

      // Assertions
      expect(from).toHaveBeenCalledWith("source_materials");
      expect(insert).toHaveBeenCalledWith(payload);
      expect(single).toHaveBeenCalled();

      expect(response.status).toBe(201);
      expect(body).toEqual(createdRecord);
    });

    it("should return 422 status when validation fails (Zod)", async () => {
      const { from } = getMocks();

      // Invalid body: missing 'markdown' field
      const invalidBody = { title: "Title Only" };

      const req = mockRequest(invalidBody);
      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.error).toBeDefined();

      // Ensure we stopped before hitting the database
      expect(from).not.toHaveBeenCalled();
      expect(Sentry.captureException).toHaveBeenCalled();
    });

    it("should return 500 status and call Sentry on database error", async () => {
      const { single } = getMocks();

      const payload = { title: "Error Case", markdown: "Content" };
      const mockError = new Error("Database insert failed");

      // Mock DB Error response
      single.mockResolvedValueOnce({
        data: null,
        error: mockError,
        count: null,
        status: 500,
        statusText: "Internal Server Error",
      });

      const req = mockRequest(payload);
      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({ error: mockError.message });
      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    });
  });
});
