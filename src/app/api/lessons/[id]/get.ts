import { getClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = getClient();

  const { data, error } = await supabase
    .from("lessons")
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
