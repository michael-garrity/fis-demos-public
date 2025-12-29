import { PersonalizedContentRecord } from "@/types";
import { PersonalizedContentOutput } from "@/lib/llm-generation/schemas/personalizedContent.zod";

export const savePersonalizedContent = async (
  generatedPersonalizedContentOutput: PersonalizedContentOutput & {
    creation_meta: Record<string, unknown>;
  }
): Promise<PersonalizedContentRecord> => {
  const response = await fetch("/api/personalized-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(generatedPersonalizedContentOutput),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save content: ${errorText}`);
  }

  return response.json();
};
