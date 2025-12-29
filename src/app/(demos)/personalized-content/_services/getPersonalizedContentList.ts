import { PersonalizedContentRow, PersonalizedContent } from "../_models";

export async function getPersonalizedContentList() {
  const res = await fetch("/api/personalized-content");
  if (!res.ok) throw new Error("Failed to fetch personalized content list");

  const rows: PersonalizedContentRow[] = await res.json();
  return rows.map((row) => new PersonalizedContent(row));
}
