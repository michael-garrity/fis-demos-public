import { describe, it, expect, vi, beforeEach } from "vitest";
import * as Sentry from "@sentry/nextjs";
import { getClient } from "@/lib/supabase";
import { GET } from "./route";

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

vi.mock("@/lib/supabase", () => {
  const mockMaybeSingle = vi.fn();
  const mockEq = vi.fn(() => ({
    maybeSingle: mockMaybeSingle,
  }));
  const mockSelect = vi.fn(() => ({
    eq: mockEq,
  }));
  const mockFrom = vi.fn(() => ({
    select: mockSelect,
  }));

  return {
    getClient: vi.fn(() => ({
      from: mockFrom,
    })),
  };
});

describe("API Route Handlers: /api/lessons/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getMocks = () => {
    const client = getClient();
    const from = client.from;
    const chain = client.from("lessons" as any);
    const select = chain.select;
    const eq = select("*").eq;
    const maybeSingle = eq("id", "id").maybeSingle;
    vi.clearAllMocks();
    return { from, select, eq, maybeSingle };
  };

  describe("GET handler", () => {
    const lessonId = crypto.randomUUID();
    const mockData = {
      id: lessonId,
      title: "Introduction to Photosynthesis",
      content: "Photosynthesis is the process by which plants...",
      creation_meta: { learner_profile: { label: "Middle School Student" } },
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    it("returns lesson data with 200 status on successful fetch", async () => {
      const { from, select, eq, maybeSingle } = getMocks();

      vi.mocked(maybeSingle).mockResolvedValueOnce({
        data: mockData,
        error: null,
      } as any);

      const response = await GET({} as Request, {
        params: Promise.resolve({ id: lessonId }),
      });
      const body = await response.json();

      expect(from).toHaveBeenCalledWith("lessons");
      expect(select).toHaveBeenCalledWith("*");
      expect(eq).toHaveBeenCalledWith("id", lessonId);
      expect(response.status).toBe(200);
      expect(body).toEqual(mockData);
    });

    it("returns 404 when lesson is missing", async () => {
      const { maybeSingle } = getMocks();

      vi.mocked(maybeSingle).mockResolvedValueOnce({
        data: null,
        error: null,
      } as any);

      const response = await GET({} as Request, {
        params: Promise.resolve({ id: lessonId }),
      });
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({ error: "Not found" });
    });

    it("returns 500 status and calls Sentry on database error", async () => {
      const { maybeSingle } = getMocks();
      const mockError = new Error("Connection pool timeout");

      vi.mocked(maybeSingle).mockResolvedValueOnce({
        data: null,
        error: mockError,
      } as any);

      const response = await GET({} as Request, {
        params: Promise.resolve({ id: lessonId }),
      });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({ error: mockError.message });
      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    });
  });
});
