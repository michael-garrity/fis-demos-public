import type { Database } from "@/types/database";
import { LearnerProfile, LearnerProfileRow } from "@/lib/learner-profiles";

export type PersonalizedContentRow =
  Database["public"]["Tables"]["personalized_contents"]["Row"];

export type PersonalizedContentUpdate =
  Database["public"]["Tables"]["personalized_contents"]["Update"];

interface CreationMeta {
  learner_profile?: LearnerProfileRow;
  [key: string]: unknown;
}

export class PersonalizedContent {
  constructor(private data: PersonalizedContentRow) {}

  asUpdate(): PersonalizedContentUpdate {
      return {
        title: this.data.title,
        description: this.data.description,
        content: this.data.content,
      };
    }

  // NOTE: if this ever accepts any camelCase `name`, this will need to
  // be adjusted to handle the transformation
  with(name: "title" | "description" | "content", value: string): PersonalizedContent {
    return new PersonalizedContent({ ...this.data, [name]: value });
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

  get description() {
    return this.data.description;
  }

  get content() {
    return this.data.content;
  }
}
