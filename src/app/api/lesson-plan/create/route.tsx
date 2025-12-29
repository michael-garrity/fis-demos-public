import { NextResponse } from "next/server";
import { getClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getClient();

    const { error, data } = await supabase
      .from("lesson_plans")
      .insert({
        creation_meta: body.creation_meta,
        introduction: body.introduction,
        context: body.context,
        example: body.example,
        practice: body.practice,
        assessment: body.assessment,
        reflection: body.reflection,
      })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
