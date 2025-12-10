import { Pool } from "pg";
import { beforeAll, afterAll, afterEach } from "vitest";
import * as factory from "@/test/factory";

/*
 * This uses a custom schema as a testing sandbox:
 * https://supabase.com/docs/guides/api/using-custom-schemas
 *
 * The custom schema, `test_public`, is created with `npm run db:reset:test`.
 * That command ensures `test_public` is a structural mirror of `public`.
 *
 * The `prepareTestSchema` function connects directly to the Supabase Postgres
 * server (using DATABASE_URL), and ensures that each test is run within a
 * clean slate: removing all data from the `test_public` schema after each
 * test. It also sets the `SUPABASE_DB_SCHEMA` env variable, which should be
 * used conditionally by any initialized Supabase client.
 *
 */

export async function prepareTestSchema() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const schemaName = "test_public";
  const pgClient = await pool.connect();
  await pgClient.query(`SET search_path TO ${schemaName}`);

  process.env.SUPABASE_DB_SCHEMA = schemaName;

  const truncateAll = async () => {
    const { rows } = await pgClient.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = '${schemaName}'`,
    );

    for (const { tablename } of rows) {
      await pgClient.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT FROM pg_tables
            WHERE schemaname = '${schemaName}' AND tablename = '${tablename}'
          ) THEN
            EXECUTE 'TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE';
          END IF;
        END
        $$;
      `);
    }
  };

  beforeAll(truncateAll);

  afterAll(pgClient.release);

  afterEach(truncateAll);

  return { factory, pgClient };
}
