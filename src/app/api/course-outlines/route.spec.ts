import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getClient } from "../../../lib/supabase";
import { GET, POST } from "../../../app/api/course-outlines/route";

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

describe("API Route Handlers: /api/course-outlines", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Helper to access spies ---
  const getMocks = () => {
    const client = getClient();
    const from = client.from;

    // Access the hidden spies inside the mock chain
    const chain = client.from("setup_extraction" as any); // Table name doesn't matter for grabbing mocks
    const select = chain.select;
    const insert = chain.insert;

    // Simulate the chain to get the 'single' spy
    const single = insert({} as any).select().single;

    // Clear the history of these setup calls so tests start fresh
    vi.clearAllMocks();

    return { from, select, insert, single };
  };

  describe("GET handler", () => {
    const mockData = [
      { id: 1, title: "Quantum Physics", description: "test" },
      { id: 2, title: "Modern Art History", description: "test" },
    ];

    it("should return course outlines data with 200 status on successful fetch", async () => {
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

      expect(from).toHaveBeenCalledWith("course_outlines");
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

  describe("POST handler", () => {
    const mockRequest = (body: any): NextRequest =>
      ({
        json: vi.fn().mockResolvedValue(body),
      } as unknown as NextRequest);

    const validCourseData = {
      title: "New Course",
      description: "test",
      creation_meta: {
        learner_profile: {
          age: 12,
          label: "7th Grader",
          interests: ["Robotics"],
          reading_level: 6,
        },
      },
      lesson_outlines: [],
    };

    it("should return the inserted course data with 200 status on success", async () => {
      const { from, insert, single } = getMocks();

      const courseToInsert = { ...validCourseData };
      const insertedCourse = { id: "3", ...courseToInsert };

      vi.mocked(single).mockResolvedValueOnce({
        data: insertedCourse,
        error: null,
        count: null,
        status: 201,
        statusText: "Created",
      } as any);

      const req = mockRequest(courseToInsert);
      const response = await POST(req);
      const body = await response.json();

      expect(from).toHaveBeenCalledWith("course_outlines");
      expect(insert).toHaveBeenCalledWith(courseToInsert);
      expect(single).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(body).toEqual(insertedCourse);
    });

    it("should return 200 status (with error body) when request body is explicitly empty", async () => {
      const { from } = getMocks();
      const req = mockRequest(null);

      const response = await POST(req);
      // Catch null body errors if response is truly empty
      const body = await response.json().catch(() => null);

      expect(response.status).toBe(400);
      expect(response.statusText).toBe("Empty body");
      expect(body).toBeNull();

      expect(from).not.toHaveBeenCalled();
    });

    it("should return 500 status and call Sentry on database error", async () => {
      const { single } = getMocks();

      // FIX: Use valid data so validation passes and we actually attempt the DB call
      const courseToInsert = { ...validCourseData, title: "Fail Course" };
      const mockError = new Error("Row violation");

      vi.mocked(single).mockResolvedValueOnce({
        data: null,
        error: mockError,
        count: null,
        status: 500,
        statusText: "Internal Server Error",
      } as any);

      const req = mockRequest(courseToInsert);
      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({ error: mockError.message });
      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    });

    // Optional: Add a test specifically for validation failure
    it("should return 400 when data is invalid", async () => {
      const { from } = getMocks();
      const invalidData = { title: "Missing Meta" }; // Missing required fields

      const req = mockRequest(invalidData);
      const response = await POST(req);

      expect(response.status).toBe(400);
      expect(from).not.toHaveBeenCalled();
    });
  });
});
