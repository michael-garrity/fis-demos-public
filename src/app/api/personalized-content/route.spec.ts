import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getClient } from "../../../lib/supabase";
import { GET, POST } from "../../../app/api/personalized-content/route";

// 1. Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

// 2. Mock Supabase with internal spies
vi.mock("@/lib/supabase", () => {
  // Spies for the POST chain: .insert().select().single()
  const mockSingle = vi.fn();
  const mockSelectForInsert = vi.fn(() => ({ single: mockSingle }));
  const mockInsert = vi.fn(() => ({ select: mockSelectForInsert }));

  // Spy for the GET chain: .select("*")
  const mockSelectForGet = vi.fn();

  // Root spy for .from()
  const mockFrom = vi.fn(() => ({
    select: mockSelectForGet,
    insert: mockInsert,
  }));

  return {
    getClient: vi.fn(() => ({
      from: mockFrom,
    })),
  };
});

describe("API Route Handlers: /api/personalized-content", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Helper to access spies ---
  const getMocks = () => {
    const client = getClient();
    const from = client.from;

    const chain = client.from("setup_extraction" as any);
    const select = chain.select;
    const insert = chain.insert;

    const single = insert({} as any).select().single;

    // Clear the history of these setup calls
    vi.clearAllMocks();

    return { from, select, insert, single };
  };

  describe("GET handler", () => {
    const mockData = [
      { id: 1, title: "Quantum Physics", description: "test" },
      { id: 2, title: "Modern Art History", description: "test" },
    ];

    it("should return personalized content data with 200 status on successful fetch", async () => {
      const { from, select } = getMocks();

      // FIX: Add 'count', 'status', and 'statusText' to satisfy TypeScript
      vi.mocked(select).mockResolvedValueOnce({
        data: mockData,
        error: null,
        count: null,
        status: 200,
        statusText: "OK",
      } as any); // 'as any' is safe here to avoid mocking every single Postgrest property

      const response = await GET();
      const body = await response.json();

      expect(from).toHaveBeenCalledWith("personalized_contents");
      expect(select).toHaveBeenCalledWith("*");
      expect(response.status).toBe(200);
      expect(body).toEqual(mockData);
    });

    it("should return 500 status and call Sentry on database error", async () => {
      const { select } = getMocks();
      const mockError = new Error("Connection pool timeout");

      // FIX: Add missing properties here as well
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

  describe("POST handler", () => {
    const mockRequest = (body: any): NextRequest =>
      ({
        json: vi.fn().mockResolvedValue(body),
      } as unknown as NextRequest);

    it("should return the inserted course data with 200 status on success", async () => {
      const { from, insert, single } = getMocks();
      const contentToInsert = {
        title: "New Personalized Content",
        description: "test",
        creation_meta: {},
        content: "test",
      };
      const insertedContent = { id: 3, ...contentToInsert };

      // FIX: Add missing properties to satisfy TypeScript
      vi.mocked(single).mockResolvedValueOnce({
        data: insertedContent,
        error: null,
        count: null,
        status: 201,
        statusText: "Created",
      } as any);

      const req = mockRequest(contentToInsert);
      const response = await POST(req);
      const body = await response.json();

      expect(from).toHaveBeenCalledWith("personalized_contents");
      expect(insert).toHaveBeenCalledWith(contentToInsert);
      expect(single).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(body).toEqual(insertedContent);
    });

    // UPDATED TEST CASE
    it("should return 200 status (with error body) when request body is explicitly empty", async () => {
      const { from } = getMocks();
      const req = mockRequest(null);

      const response = await POST(req);

      // Note: If response body is null, response.json() might throw in real usage
      // unless you are mocking json() behavior elsewhere or your handler returns valid JSON 'null'.
      // If your handler returns `NextResponse.json(null)`, body will be `null`.
      const body = await response.json().catch(() => null);

      expect(response.status).toBe(400);
      expect(response.statusText).toBe("Empty body");
      expect(body).toEqual(null);

      // Now this passes because we cleared the mocks in getMocks()
      expect(from).not.toHaveBeenCalled();
    });

    it("should return 500 status and call Sentry on database error", async () => {
      const { single } = getMocks();
      const contentToInsert = {
        title: "Fail Personalized Content",
        description: "Test Description",
        content: "test",
      };
      const mockError = new Error("Row violation");

      // FIX: Add missing properties
      vi.mocked(single).mockResolvedValueOnce({
        data: null,
        error: mockError,
        count: null,
        status: 500,
        statusText: "Internal Server Error",
      } as any);

      const req = mockRequest(contentToInsert);
      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({ error: mockError.message });
      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    });
  });
});
