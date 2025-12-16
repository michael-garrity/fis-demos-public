import * as Sentry from "@sentry/nextjs";
import type { Database } from "@/types";
import { NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";
import { z } from "zod";

type Update = Database["public"]["Tables"]["course_outlines"]["Update"];

const schema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  lesson_outlines: z.array(z.object({
    title: z.string().min(1),
    minutes: z.number(),
    outcome: z.string(),
    description: z.string(),
  })).optional(),
}).strict();

/**
 * Update course outline
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
    .from("course_outlines")
    .update(input satisfies Update)
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
