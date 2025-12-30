import { LearnerProfile, LearnerProfileRow } from "@/lib/learner-profiles";
import { Question, QuizRow } from "@/types";

interface CreationMeta {
  learner_profile?: LearnerProfileRow;
  [key: string]: unknown;
}

export class Quiz {
  constructor(private data: QuizRow) {}

  get id() {
    return this.data.id;
  }

  get creationMeta(): CreationMeta {
    return (this.data.creation_meta ?? {}) as CreationMeta;
  }

  get learnerProfile(): LearnerProfile | null {
    const profileData = this.creationMeta.learner_profile;
    if (!profileData) return null;

    return new LearnerProfile(profileData);
  }

  get title() {
    return this.data.title;
  }

  get description() {
    return this.data.description;
  }

  get questionCount() {
    return this.questions.length;
  }

  get questions(): Question[] {
    return (this.data.questions ?? []) as unknown as Question[];
  }
}
