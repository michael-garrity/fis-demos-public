import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";

/**
 * Delete personalized content
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getClient();

  const { error, count } = await supabase
    .from("personalized_contents")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!count) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
