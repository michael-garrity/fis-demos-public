import * as Sentry from "@sentry/nextjs";
import type { TablesUpdate } from "@/types";
import { NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";

/**
 * Update Lesson Plan
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const input = await req.json();

  const supabase = getClient();
  const { data: record, error: dbError } = await supabase
    .from("lesson_plans")
    .update(input satisfies TablesUpdate<"lesson_plans">)
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
