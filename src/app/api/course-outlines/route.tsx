import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";
import z from "zod";
import { Database, Json } from "@/types";

const supabase = getClient();

/**
 * Index course outlines
 */
export async function GET() {
  const { data, error } = await supabase.from("course_outlines").select("*");

  if (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

type CourseOutlineInsert =
  Database["public"]["Tables"]["course_outlines"]["Insert"];

const LessonOutlineSchema = z.object({
  title: z.string().min(1),
  minutes: z.number().int().positive(),
  outcome: z.string().min(1),
  description: z.string().min(1),
});

const CourseOutlineInsertSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  creation_meta: z.record(z.string(), z.unknown()).default({}),
  lesson_outlines: z.array(LessonOutlineSchema).default([]),
});

/**
 * Add course to database
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body) {
    return NextResponse.json(null, { status: 400, statusText: "Empty body" });
  }

  const parsed = CourseOutlineInsertSchema.parse(body);

  const payload: CourseOutlineInsert = {
    ...parsed,
    creation_meta: parsed.creation_meta as Json,
    lesson_outlines: parsed.lesson_outlines as Json,
  };

  const { data, error } = await supabase
    .from("course_outlines")
    .insert(payload)
    .select()
    .single();

  if (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
