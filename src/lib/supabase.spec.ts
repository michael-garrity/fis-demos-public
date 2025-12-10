import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getClient, resetClient } from "./supabase";

let originalSchema: string | undefined;
let originalWarn: typeof console.error;

describe("getClient", () => {
  beforeEach(() => {
    originalSchema = process.env.SUPABASE_DB_SCHEMA;
    delete process.env.SUPABASE_DB_SCHEMA;

    originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Multiple GoTrueClient instances detected")
      ) {
        return;
      }
      originalWarn(...args);
    };
  });

  afterEach(() => {
    resetClient();
    console.warn = originalWarn;
    process.env.SUPABASE_DB_SCHEMA = originalSchema;
  });

  it("creates a Supabase client", () => {
    const client = getClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe("function");
  });

  it("memoizes the client", () => {
    const client1 = getClient();
    const client2 = getClient();
    expect(client1).toBe(client2);
  });

  it("uses the public schema by default", () => {
    const client = getClient();
    expect(client.rest.schemaName).toBe("public");
  });

  it("respects SUPABASE_DB_SCHEMA if set", () => {
    process.env.SUPABASE_DB_SCHEMA = "test_schema";
    const client = getClient();
    expect(client.rest.schemaName).toBe("test_schema");
  });
});
