import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

let client: ReturnType<typeof createClient<Database>> | null = null;

/*
 * Returns a Supabase client configured for the current environment.
 *
 * - Lazy: the client is only created when first needed, so it picks up
 *   any environment variables (like SUPABASE_DB_SCHEMA) set at runtime.
 * - Memoized: subsequent calls return the same client instance.
 * - Schema-aware: automatically uses the schema from SUPABASE_DB_SCHEMA
 *   if set, allowing dynamic switching for tests.
 */
export function getClient() {
  if (client) return client;

  const schema = process.env.SUPABASE_DB_SCHEMA;
  const options = schema ? { db: { schema } } : {};

  client = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    options
  );

  return client;
}

export function resetClient() {
  client = null;
}
