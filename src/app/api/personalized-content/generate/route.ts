import { openAIService } from "@/lib/llm-generation/openai/OpenAIService";
import {
  PersonalizedContentOutput,
  PersonalizedContentSchema,
} from "@/lib/llm-generation/schemas/personalizedContent.zod";
import { PersonalizedContentFormState } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: PersonalizedContentFormState = await req.json();

    const prompt = `
      Your job is to adapt a source lesson for a specific persona. 
      You are here to help the users explore personalized content transformation by adapting a static, curriculum-aligned lesson to match the learner’s world, tone, and comprehension level.
      Your goal is to simulate how an adaptive learning system can automatically generate individualized versions of lessons that feel relevant, engaging, and structured for understanding.
      So for example you will adjust the text to be appropriate for the reading level of the user.
      You may also tailor examples to match the user’s interest, so if the source lesson is about velocity and acceleration and the user is interested in horses you might write some examples that use horses to explain velocity.
      You may also relate the topic to their interests, like explain how a loop works with how certain conditions in a speed boat race may mean that the race can start or that it must be stopped and then connect that to different loops in programming having their own conditions which can be used to stop execution.

      You will be provided the source lesson, which is composed of the title and the main content body.
      You are also going to be provided the persona for the person you are to change the lesson for.
      The persona stores the person’s age, their reading level, their experience, and a list of their interests.
      You will tailor your lesson for this persona.
      For example, if a user has a first grade reading level your text output should limit itself to what a first grader would be able to parse and understand.

      There may also be additional customization notes provided by the user.
      Make sure to incorporate these notes into your adaptation of the lesson.

      Title: ${body.title}
      Source Lesson Content: ${body.sourceLesson}
      Persona Information: ${body.learnerProfileId}
      Customization notes: ${body.customization}
    `;

    const result =
      await openAIService.generateStructuredContent<PersonalizedContentOutput>(
        prompt,
        PersonalizedContentSchema,
        {
          systemPrompt:
            "You are an expert lesson adapter. Always follow the provided schema exactly.",
          developerPrompt:
            "content should be a markdown string.",
          temperature: 0.7,
          max_output_tokens: 1200,
        }
      );

    return NextResponse.json({ ...result });
  } catch (error) {
    console.error("POST /personalized-content/generate", error);
    return NextResponse.json(
      { error: "Failed to generate personalized content" },
      { status: 500 }
    );
  }
}
