import * as Sentry from "@sentry/nextjs";
import type { TablesUpdate } from "@/types";
import { NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";
import { z } from "zod";

export const schema = z
  .object({
    id: z.string().optional(),
    creation_meta: z
      .object({
        learner_profile: z
          .object({
            age: z.number().optional(),
            label: z.string().optional(),
            interests: z.array(z.string()).optional(),
            experience: z.string().optional(),
            reading_level: z.number().optional(),
          })
          .optional(),
        source_material: z
          .object({
            title: z.string().min(1).optional(),
            content: z.string().min(1).optional(),
          })
          .optional(),
      })
      .optional(),
    introduction: z.string().min(1).optional(),
    context: z.string().min(1).optional(),
    example: z.string().min(1).optional(),
    practice: z.string().min(1).optional(),
    assessment: z.string().min(1).optional(),
    reflection: z.string().min(1).optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .strict();

/**
 * Update Lesson Plan
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: input, error: zError } = schema.safeParse(await req.json());

  if (zError) {
    Sentry.captureException(zError);
    return NextResponse.json(
      { error: z.prettifyError(zError) },
      { status: 422 }
    );
  }

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
