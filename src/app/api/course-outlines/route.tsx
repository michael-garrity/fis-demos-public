import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";
import z from "zod";
import { TablesInsert } from "@/types";

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

export const LearnerProfileSchema = z.object({
  age: z.number().int().min(1, "Age must be a positive number"),
  label: z.string().min(1, "Label is required"),
  interests: z.array(z.string()),
  experience: z.string().optional().or(z.literal("")),
  reading_level: z.number().min(0),
});

export const SourceMaterialSchema = z.object({
  title: z.string().min(1, "Source title is required"),
  content: z.string().min(1, "Source content is required"),
});

export const CreationMetaSchema = z.object({
  learner_profile: LearnerProfileSchema,
  source_material: SourceMaterialSchema.optional(),
});

export const LessonOutlineItemSchema = z.object({
  title: z.string().min(1),
  minutes: z.number().int().positive(),
  outcome: z.string(),
  description: z.string(),
});

export const CourseOutlineInsertSchema = z.object({
  id: z.uuid().optional(),
  creation_meta: CreationMetaSchema,
  title: z.string().min(1),
  description: z.string(),
  lesson_outlines: z.array(LessonOutlineItemSchema),
});

type CourseOutlineInsert = TablesInsert<"course_outlines">;

/**
 * Add course to database
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body) {
    return NextResponse.json(null, { status: 400, statusText: "Empty body" });
  }

  // 1. Validate the incoming body
  const parsed = CourseOutlineInsertSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  // 2. Insert into the database
  const payload: CourseOutlineInsert = {
    title: parsed.data.title,
    description: parsed.data.description,
    creation_meta: parsed.data.creation_meta,
    lesson_outlines: parsed.data.lesson_outlines,
    ...(parsed.data.id ? { id: parsed.data.id } : {}),
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
