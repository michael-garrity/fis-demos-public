import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";
import { z } from "zod";
import { Json, QuizInsert } from "@/types";

/**
 * Handles GET requests for the quiz records.
 */
export async function GET() {
  const supabase = getClient()

  const {data, error} = await supabase
    .from("quizzes")
    .select("*")

  if (error) {
    Sentry.captureException(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data, { status: 200 });
}

const answer = z.object({
  text: z.string().min(1),
  feedback: z.string(),
  correct: z.boolean()
})

const question = z.object({
  question: z.string().min(1),
  answers: z.array(answer).min(1)
})

const quiz = z.object({
  title: z.string().min(1),
  description: z.string(),
  creation_meta: z.record(z.string(), z.unknown()).default({}),
  questions: z.array(question).optional(),
}).strict();

/**
 * Handles POST request and adds it to DB
 */

export async function POST(
  req: Request
) {
  const supabase = getClient()
  const formData = await req.json()

  const {data: input, error: zError} = quiz.safeParse(formData);

  if (zError) {
    Sentry.captureException(zError);
    return NextResponse.json({ error: z.prettifyError(zError) }, { status: 422 });
  }

  const payload: QuizInsert = {
    ...input,
    creation_meta: input.creation_meta as Json
  }

  const {data, error: dbError} = await supabase
    .from("quizzes")
    .insert(payload)
    .select()
    .single()

  if (dbError) {
    Sentry.captureException(dbError)
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
