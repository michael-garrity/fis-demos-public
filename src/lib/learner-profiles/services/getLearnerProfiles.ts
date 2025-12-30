import { LearnerProfile, LearnerProfileRow } from "@/lib/learner-profiles";

export async function getLearnerProfiles() {
  const res = await fetch("/api/learner-profiles");
  if (!res.ok) throw new Error("Failed to fetch learner profiles");

  const rows: LearnerProfileRow[] = await res.json();
  return rows.map((row) => new LearnerProfile(row));
}
