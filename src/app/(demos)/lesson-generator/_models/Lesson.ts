import type { Database, Tables } from "@/types/database";
import { LearnerProfile, LearnerProfileRow } from "@/lib/learner-profiles";

export type LessonRow = Tables<"lessons">;

export type LessonUpdate = Database["public"]["Tables"]["lessons"]["Update"];

interface CreationMeta {
  learner_profile?: LearnerProfileRow;
  [key: string]: unknown;
}

export class Lesson {
  constructor(private data: LessonRow) {}

  asUpdate(): LessonUpdate {
    return {
      title: this.data.title,
      content: this.data.content,
    };
  }

  with(name: "title" | "content", value: string): Lesson {
    return new Lesson({ ...this.data, [name]: value });
  }

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

  get content() {
    return this.data.content;
  }

  get createdAt() {
    return new Date(this.data.created_at);
  }
}
