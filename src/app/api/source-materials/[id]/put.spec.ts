import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getClient } from "@/lib/supabase"; // Mock path
import { PUT } from "@/app/api/course-outlines/[id]/route"; // Mock path

// 1. Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

// 2. Mock Supabase with extended spies for Update chain
vi.mock("@/lib/supabase", () => {
  // --- Spies for the UPDATE chain: .update().eq().select().maybeSingle() ---
  const mockMaybeSingle = vi.fn();
  const mockSelectForUpdate = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockEq = vi.fn(() => ({ select: mockSelectForUpdate }));
  const mockUpdate = vi.fn(() => ({ eq: mockEq }));

  // Root spy for .from()
  const mockFrom = vi.fn(() => ({
    update: mockUpdate,
  }));

  return {
    getClient: vi.fn(() => ({
      from: mockFrom,
    })),
  };
});

describe("API Route Handlers: Course Outlines PUT", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Helper to access spies ---
  const getMocks = () => {
    const client = getClient();
    const from = client.from;

    // Simulate the chain to get the specific spies
    // chain: .from("table").update({}).eq("id", "1").select("*").maybeSingle()
    const chainUpdate = client.from("any_table" as any).update({} as any);
    const chainEq = chainUpdate.eq("id", "1");
    const chainSelect = chainEq.select("*");

    const update = from("course_outlines").update; // Reference to the update spy
    const eq = chainUpdate.eq; // Reference to the eq spy
    const maybeSingle = chainSelect.maybeSingle; // Reference to the end spy

    // Clear history from setup steps
    vi.clearAllMocks();

    return { from, update, eq, maybeSingle };
  };

  const mockRequest = (body: any): NextRequest =>
    ({
      json: vi.fn().mockResolvedValue(body),
    } as unknown as NextRequest);

  const mockParams = { params: Promise.resolve({ id: "course-123" }) };

  describe("PUT handler", () => {
    it("should return the updated record with 200 status on success", async () => {
      const { from, update, eq, maybeSingle } = getMocks();

      const inputBody = {
        title: "Updated Course Title",
        description: "New description",
        lesson_outlines: [
          {
            title: "Lesson 1",
            minutes: 30,
            outcome: "Learn X",
            description: "Desc 1",
          },
        ],
      };
      const updatedRecord = { id: "course-123", ...inputBody };

      // Mock DB success response
      vi.mocked(maybeSingle).mockResolvedValueOnce({
        data: updatedRecord,
        error: null,
        count: null,
        status: 200,
        statusText: "OK",
      } as any);

      const req = mockRequest(inputBody);
      const response = await PUT(req, mockParams);
      const body = await response.json();

      // Assertions
      expect(from).toHaveBeenCalledWith("course_outlines");
      expect(update).toHaveBeenCalledWith(inputBody);
      expect(eq).toHaveBeenCalledWith("id", "course-123");
      expect(maybeSingle).toHaveBeenCalled();

      expect(response.status).toBe(200);
      expect(body).toEqual(updatedRecord);
    });

    it("should return 404 when record is not found (data is null)", async () => {
      const { maybeSingle } = getMocks();
      const inputBody = { title: "Ghost Course" };

      // Mock DB "Not Found" response (no error, but no data)
      vi.mocked(maybeSingle).mockResolvedValueOnce({
        data: null,
        error: null,
        count: null,
        status: 200,
        statusText: "OK",
      } as any);

      const req = mockRequest(inputBody);
      const response = await PUT(req, mockParams);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe("Not found");
    });

    it("should return 422 status when validation fails (Zod)", async () => {
      const { from } = getMocks();

      // Invalid body: lesson_outlines missing required fields inside array objects
      const invalidBody = {
        lesson_outlines: [
          { title: "Bad Lesson" }, // Missing minutes, outcome, description
        ],
      };

      const req = mockRequest(invalidBody);
      const response = await PUT(req, mockParams);
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.error).toBeDefined();

      // Ensure we stopped before hitting the database
      expect(from).not.toHaveBeenCalled();
      expect(Sentry.captureException).toHaveBeenCalled();
    });

    it("should return 500 status and call Sentry on database error", async () => {
      const { maybeSingle } = getMocks();
      const inputBody = { title: "Error Case" };
      const mockError = new Error("Database connection failed");

      // Mock DB Error response
      vi.mocked(maybeSingle).mockResolvedValueOnce({
        data: null,
        error: mockError,
        count: null,
        status: 500,
        statusText: "Internal Server Error",
      } as any);

      const req = mockRequest(inputBody);
      const response = await PUT(req, mockParams);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({ error: mockError.message });
      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    });
  });
});
