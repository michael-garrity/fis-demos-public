import type { Tables } from "@/types/database";

export type LearnerProfileRow = Tables<"learner_profiles">;

export class LearnerProfile {
  constructor(private data: LearnerProfileRow) {}

  get id() {
    return this.data.id;
  }

  get label() {
    return this.data.label;
  }

  get age() {
    return this.data.age;
  }

  get readingLevel() {
    return this.data.reading_level;
  }

  get experience () {
    return this.data.experience;
  }

  get interests() {
    return (this.data.interests ?? []);
  }
}

