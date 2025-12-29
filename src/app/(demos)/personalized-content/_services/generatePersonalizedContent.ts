import { PersonalizedContentFormState } from "@/types";
import { PersonalizedContentOutput } from "@/lib/llm-generation/schemas/personalizedContent.zod";

export const generatePersonalizedContent = async (
  newCourseData: PersonalizedContentFormState
): Promise<PersonalizedContentOutput> => {
  const response = await fetch("/api/personalized-content/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCourseData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create content: ${errorText}`);
  }

  return response.json();
};
