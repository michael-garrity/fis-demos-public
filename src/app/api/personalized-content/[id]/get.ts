import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";

/**
 * Show personalized content
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getClient();

  const { data, error } = await supabase
    .from("personalized_contents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}
