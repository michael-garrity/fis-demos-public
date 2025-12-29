import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { PersonalizedContentFormState } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as PersonalizedContentFormState;

  const now = new Date().toISOString();

  return NextResponse.json(
    {
      id: randomUUID(), 
      title: body.title,
      description: body.description, 
      content: "test content", // placeholder for LLM output
      creation_meta: {
        learner_profile_id: body.learnerProfileId,
        source_lesson_id: body.sourceLesson,
        customization: body.customization,
      },
      created_at: now,
      updated_at: now,
    },
    { status: 200 }
  );
}
