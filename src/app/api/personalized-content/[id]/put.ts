import * as Sentry from "@sentry/nextjs";
import type { TablesUpdate } from "@/types";
import { NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
}).strict();

/**
 * Update personalized content
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: input, error: zError } = schema.safeParse(await req.json());

  if (zError) {
    Sentry.captureException(zError);
    return NextResponse.json({ error: z.prettifyError(zError) }, { status: 422 });
  }

  const supabase = getClient();
  const { data: record, error: dbError } = await supabase
    .from("personalized_contents")
    .update(input satisfies TablesUpdate<"personalized_contents">)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (dbError) {
    Sentry.captureException(dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(record, { status: 200 });
}
