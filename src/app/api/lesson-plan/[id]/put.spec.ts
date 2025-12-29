import { PUT } from "./route";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { prepareTestSchema } from "@/test";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";

describe("PUT", async () => {
  const { factory, pgClient } = await prepareTestSchema();

  describe("with a valid update", () => {
    it("responds with a 200 status", async () => {
      const lessonPlan = await factory.create("lessonPlan");

      const request = new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({
          creation_meta: {
            source_material: { title: "New Title" },
          },
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: lessonPlan.id }),
      });

      expect(response.status).toEqual(200);
    });

    it("updates the record", async () => {
      const { id } = await factory.create("lessonPlan");
      const title = `New Title ${crypto.randomUUID()}`;

      const request = new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({
          creation_meta: {
            source_material: { title: title },
          },
        }),
        headers: { "Content-Type": "application/json" },
      });

      await PUT(request, { params: Promise.resolve({ id }) });

      const result = await pgClient.query(
        `select * from lesson_plans where id = $1`,
        [id]
      );

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].creation_meta.source_material.title).toEqual(title);
    });

    it("responds with the updated record", async () => {
      const lessonPlan = await factory.create("lessonPlan");

      const request = new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({
          creation_meta: {
            source_material: { title: "New Title" },
          },
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: lessonPlan.id }),
      });

      const body: LessonPlanRecord = await response.json();

      expect(body.creation_meta.source_material.title).toEqual("New Title");
      expect(body.id).toEqual(lessonPlan.id);
    });
  });

  describe("when the record does not exist", () => {
    it("responds with a 404 status", async () => {
      const request = new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({
          creation_meta: {
            source_material: { title: "New Title" },
          },
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: crypto.randomUUID() }),
      });

      expect(response.status).toEqual(404);
    });
  });

  describe("when a Supabase error occurs", () => {
    let spy: ReturnType<typeof vi.spyOn>;

    beforeEach(async () => {
      const fakeClient = {
        eq: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Simulated Supabase error" },
        }),
      };

      spy = vi
        .spyOn(await import("@/lib/supabase"), "getClient")
        .mockReturnValue(fakeClient as any);
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it("responds with a 500 status and the error message", async () => {
      const lessonPlan = factory.build("lessonPlan");

      const request = new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({ title: "Updated Title" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: lessonPlan.id }),
      });

      expect(response.status).toEqual(500);

      const body = await response.json();
      expect(body.error).toEqual("Simulated Supabase error");
    });
  });
});
