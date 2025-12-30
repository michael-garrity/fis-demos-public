import { BaseModel } from "@/lib/shared/models/BaseModel";
import type { Tables } from "@/types/database";

export type LearnerProfileRow = Tables<"learner_profiles">;

export class LearnerProfile extends BaseModel<LearnerProfileRow> {
  constructor(protected data: LearnerProfileRow) {
    super(data);
  }

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

  get experience() {
    return this.data.experience;
  }

  get interests() {
    return this.data.interests ?? [];
  }
}
