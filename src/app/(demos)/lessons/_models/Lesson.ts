import type { Database, Tables } from "@/types/database";
import { LearnerProfile, LearnerProfileRow } from "@/lib/learner-profiles";

export type LessonRow = Tables<"lessons">;

export type LessonUpdate = Database["public"]["Tables"]["lessons"]["Update"];

interface CreationMeta {
  learner_profile?: LearnerProfileRow;
  [key: string]: unknown;
}

type LessonSectionKey =
  | "introduction"
  | "context"
  | "example"
  | "practice"
  | "assessment"
  | "reflection";

interface LessonSection {
  title?: string;
  markdown?: string;
}

interface StructuredLessonContent {
  sections?: Partial<Record<LessonSectionKey, LessonSection>>;
}

interface ParsedLessonSection {
  key: LessonSectionKey;
  title: string;
  markdown: string;
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

  private toStringValue(value: unknown): string {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return "";

    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return "";
      }
    }

    return String(value);
  }

  private get rawContent(): unknown {
    return this.data.content as unknown;
  }

  get content() {
    return this.toStringValue(this.rawContent);
  }

  private get structuredContent(): StructuredLessonContent | null {
    const raw = this.rawContent;

    if (raw && typeof raw === "object") {
      return raw as StructuredLessonContent;
    }

    try {
      const parsed = JSON.parse(this.content) as StructuredLessonContent;
      return typeof parsed === "object" && parsed !== null ? parsed : null;
    } catch {
      return null;
    }
  }

  private getSectionMarkdown(key: LessonSectionKey) {
    const markdown = this.structuredContent?.sections?.[key]?.markdown;
    return this.toStringValue(markdown).trim();
  }

  get introduction() {
    return this.getSectionMarkdown("introduction") || this.content;
  }

  get context() {
    return this.getSectionMarkdown("context");
  }

  get example() {
    return this.getSectionMarkdown("example");
  }

  get practice() {
    return this.getSectionMarkdown("practice");
  }

  get assessment() {
    return this.getSectionMarkdown("assessment");
  }

  get reflection() {
    return this.getSectionMarkdown("reflection");
  }

  get lessonSections(): ParsedLessonSection[] {
    return [
      {
        key: "introduction",
        title: "Introduction",
        markdown: this.introduction,
      },
      { key: "context", title: "Context", markdown: this.context },
      { key: "example", title: "Example", markdown: this.example },
      { key: "practice", title: "Practice", markdown: this.practice },
      { key: "assessment", title: "Assessment", markdown: this.assessment },
      { key: "reflection", title: "Reflection", markdown: this.reflection },
    ];
  }

  get createdAt() {
    return new Date(this.data.created_at);
  }
}
