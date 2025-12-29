import * as supabaseLib from "@/lib/supabase";
import { GET } from "./route";
import { describe, expect, it } from "vitest";
import { prepareTestSchema } from "@/test";

describe("GET", async () => {
  const { factory } = await prepareTestSchema();

  describe("without any records", async () => {
    it("responds with a 200 status", async () => {
      const response = await GET();
      expect(response.status).toEqual(200);
    });

    it("responds with an empty array", async () => {
      const response = await GET();
      const body = await response.json();

      expect(body).toEqual([]);
    });
  });

  describe("with records", () => {
    it("responds with a 200 status", async () => {
      await factory.create("lessonPlan");
      const response = await GET();
      expect(response.status).toEqual(200);
    });

    it("responds with an array of records", async () => {
      const lessonPlan = await factory.create("lessonPlan");
      const response = await GET();
      const body = await response.json();
      expect(body).toEqual([lessonPlan]);
    });
  });

  describe("when a Supabase error occurs", async () => {
    let spy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      spy = vi.spyOn(supabaseLib, "getClient").mockReturnValue({
        from: () => ({
          // @ts-expect-error Irrelevant type mismatch in mock
          select: async () => ({
            data: null,
            error: { message: "Simulated Supabase error" },
          }),
        }),
      });
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it("responds with a 500 status and the error message", async () => {
      const response = await GET();
      expect(response.status).toEqual(500);
    });

    it("responds with the error message", async () => {
      const response = await GET();
      const body = await response.json();
      expect(body).toEqual({ error: "Simulated Supabase error" });
    });
  });
});
