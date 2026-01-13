import { PersonalizedContentRow, PersonalizedContent } from "../models/PersonalizedContent";

export async function getPersonalizedContent(id: string) {
  const res = await fetch(`/api/personalized-content/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch personalized content '${id}'`);
  const row: PersonalizedContentRow = await res.json();
  return new PersonalizedContent(row);
}
