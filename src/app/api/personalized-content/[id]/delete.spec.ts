import * as supabaseLib from "@/lib/supabase";
import { DELETE } from "./route";
import { describe, expect, it } from "vitest";
import { prepareTestSchema } from "@/test";

describe("DELETE", async () => {
  const { factory, pgClient } = await prepareTestSchema();
  const mockRequest = {} as Request;

  describe("with an existing record", () => {
    it("responds with a 204 status", async () => {
      const personalizedContent = await factory.create("personalizedContent");
      const response = await DELETE(mockRequest, {
        params: Promise.resolve({ id: personalizedContent.id })
      });
      expect(response.status).toEqual(204);
    });

    it("destroys the record", async () => {
      const { id } = await factory.create("personalizedContent");

      await DELETE(mockRequest, {
        params: Promise.resolve({ id }),
      });

      const result = await pgClient.query(
        `select 1 from personalized_contents where id = $1`,
        [id]
      );

      expect(result.rows).toHaveLength(0);
    });
  });

  describe("without a matching record", async () => {
    let response: Response;

    beforeEach(async () => {
      response = await DELETE(mockRequest, {
        params: Promise.resolve({ id: crypto.randomUUID() })
      });
    });

    it("responds with a 404 status", async () => {
      expect(response.status).toEqual(404);
    });

    it("responds with an error", async () => {
      const body: { error: string } = await response.json();
      expect(body).toEqual({ error: "Not found" });
    });
  });

  describe("when a Supabase error occurs", async () => {
    let response: Response, spy: ReturnType<typeof vi.spyOn>;

    beforeEach(async () => {
      spy = vi.spyOn(supabaseLib, "getClient").mockReturnValue({
        from: () => ({
          delete: () => ({
            // @ts-expect-error Irrelevant type mismatch in mock
            eq: () => ({
              count: null,
              error: { message: "Simulated Supabase error" },
            })
          })
        }),
      });

      response = await DELETE(mockRequest, {
        params: Promise.resolve({ id: crypto.randomUUID() })
      });
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it("responds with a 500 status and the error message", async () => {
      expect(response.status).toEqual(500);
    });

    it("responds with the error message", async () => {
      const body: { error: string } = await response.json();
      expect(body).toEqual({ error: "Simulated Supabase error" });
    });
  });
});
