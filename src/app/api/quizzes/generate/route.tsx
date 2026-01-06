import { openAIService } from "@/lib/llm-generation/openai/OpenAIService";
import { generationSchema, QuestionOutput } from "@/lib/llm-generation/schemas/quiz.zod";
import { QuizGenerationState } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: QuizGenerationState = await req.json();

    const prompt = `
      Create a set of quiz questions using the following information:

      Title: ${body.title}
      Description: ${body.description}
      Customization notes: ${body.customization}
      Source Material: ${body.sourceMaterial?.content}
      User: ${body.learnerProfile}
    `;

    const result =
      await openAIService.generateStructuredContent<QuestionOutput>(
        prompt,
        generationSchema(body.numberOfQuestions),
        {
          systemPrompt:
            "You are an expert quiz maker",
          developerPrompt:
            "Do not include commentary, markdown, or explanations. Keep your questions appropriate for the user and relevant to the material",
          max_output_tokens: 1200,
        }
      );

    return NextResponse.json(result.questions);
  } catch (error) {
    console.error("POST /quizzes/generate", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
