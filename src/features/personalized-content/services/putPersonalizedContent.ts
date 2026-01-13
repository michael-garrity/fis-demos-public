import { PersonalizedContentRow, PersonalizedContent } from "../models/PersonalizedContent";

/**
 * API function to update an existing Personalized Content record.
 */
export async function putPersonalizedContent(personalizedContent: PersonalizedContent) {
  const res = await fetch(`/api/personalized-content/${personalizedContent.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personalizedContent.asUpdate()),
  });

  if (!res.ok) {
    const { error }: { error: string } = await res.json();
    throw new Error(
      `Failed to update personalized content '${personalizedContent.id}': ${error}`
    );
  }

  const row: PersonalizedContentRow = await res.json();
  return new PersonalizedContent(row);
};


