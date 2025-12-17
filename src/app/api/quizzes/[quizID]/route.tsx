import * as Sentry from "@sentry/nextjs";
import { getClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// export async function PUT(req: Request) {
//   const updatedCourseOutline: CourseOutlineDetail = await req.json();
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   return NextResponse.json(updatedCourseOutline, { status: 200 });
// }

// export async function GET() {
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   return NextResponse.json(MOCK_DETAIL, { status: 200 });
// }

export async function DELETE(
    _: unknown,
  { params }: { params: Promise<{ quizID: string }> }
) {
  console.log(params);
  const id = (await params).quizID;

  const supabase = getClient()
  
    const {error} = await supabase
      .from("quizzes")
      .delete()
      .eq("id", id)
  
    if (error) {
      Sentry.captureException(error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

  return NextResponse.json(id, { status: 200 });
}
