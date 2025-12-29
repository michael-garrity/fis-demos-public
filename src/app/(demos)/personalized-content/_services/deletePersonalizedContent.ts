import { PersonalizedContent } from "../_models";

/**
 * API function to delete an existing Personalized Content record.
 */
export async function deletePersonalizedContent(personalizedContent: PersonalizedContent) {
  const res = await fetch(`/api/personalized-content/${personalizedContent.id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const { error }: { error: string } = await res.json();
    throw new Error(
      `Failed to delete personalized content '${personalizedContent.id}': ${error}`
    );
  }

  return personalizedContent;
};
