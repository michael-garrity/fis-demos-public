import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { openAIService } from "@/lib/llm-generation/openai/OpenAIService";
import {
  LessonOutput,
  LessonSchema,
} from "@/lib/llm-generation/schemas/lesson.zod";
import { getClient } from "@/lib/supabase";

const LessonGenerateRequestSchema = z
  .object({
    title: z.string().min(1),
    customization: z.string().optional(),
    creation_meta: z.object({
      learner_profile: z.object({
        age: z.number(),
        label: z.string(),
        interests: z.array(z.string()),
        experience: z.string(),
        reading_level: z.number(),
      }),
      source_material: z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    }),
  })
  .strict();

function toStructuredLessonContent(result: LessonOutput) {
  return JSON.stringify({
    sections: {
      introduction: {
        title: "Introduction",
        markdown: result.introduction,
      },
      context: {
        title: "Context",
        markdown: result.context,
      },
      example: {
        title: "Example",
        markdown: result.example,
      },
      practice: {
        title: "Practice",
        markdown: result.practice,
      },
      assessment: {
        title: "Assessment",
        markdown: result.assessment,
      },
      reflection: {
        title: "Reflection",
        markdown: result.reflection,
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LessonGenerateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const payload = parsed.data;

    const prompt = `
    Create a full lesson with the sections Introduction, Context, Example, Practice, Assessment, and Reflection.

    Title: ${payload.title}
    Learner profile label: ${payload.creation_meta.learner_profile.label}
    Learner age: ${payload.creation_meta.learner_profile.age}
    Learner reading level: ${payload.creation_meta.learner_profile.reading_level}
    Learner interests: ${payload.creation_meta.learner_profile.interests.join(", ")}
    Learner experience: ${payload.creation_meta.learner_profile.experience}

    Source material title: ${payload.creation_meta.source_material.title}
    Source material content: ${payload.creation_meta.source_material.content}

    Customization notes: ${payload.customization ?? ""}
    `.replaceAll("    ", "");

    const generated =
      await openAIService.generateStructuredContent<LessonOutput>(
        prompt,
        LessonSchema,
        {
          systemPrompt:
            "You are an expert lesson designer. Always follow the provided schema exactly.",
          developerPrompt: "All section values must be markdown strings.",
          temperature: 0.7,
          max_output_tokens: 1400,
        },
      );

    const supabase = getClient();
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        title: payload.title,
        creation_meta: payload.creation_meta,
        content: toStructuredLessonContent(generated),
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /lessons/generate", error);
    return NextResponse.json(
      { error: "Failed to generate lesson" },
      { status: 500 },
    );
  }
}
