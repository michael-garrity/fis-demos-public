import { openAIService } from "@/lib/llm-generation/openai/OpenAIService";
import {
  CourseOutlineOutput,
  CourseOutlineSchema,
} from "@/lib/llm-generation/schemas/courseOutline.zod";
import { CourseOutlineFormState } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: CourseOutlineFormState = await req.json();

    const totalMinutes =
      body.durationUnit === "hours"
        ? body.durationValue * 60
        : body.durationValue;

    const prompt = `
      Create a course outline with the following constraints:

      Title: ${body.title}
      Description: ${body.description}
      Number of lessons: ${body.numberOfLessons}
      Duration of each lesson: ${totalMinutes} minutes
      Customization notes: ${body.customization}
    `;

    const result =
      await openAIService.generateStructuredContent<CourseOutlineOutput>(
        prompt,
        CourseOutlineSchema,
        {
          systemPrompt:
            "You are an expert curriculum designer. Always follow the provided schema exactly.",
          developerPrompt:
            "Do not include commentary, markdown, or explanations. Structured data only.",
          temperature: 0.7,
          max_output_tokens: 1200,
        }
      );

    return NextResponse.json({ ...result });
  } catch (error) {
    console.error("POST /course-outlines/generate", error);
    return NextResponse.json(
      { error: "Failed to generate course outline" },
      { status: 500 }
    );
  }
}
