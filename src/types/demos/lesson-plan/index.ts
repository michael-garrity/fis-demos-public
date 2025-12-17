import { BaseListRecord } from "@/types/list";

// This is for the top header -> Details about course
export interface LessonPlanRecord extends BaseListRecord {
  title: string;
  description: string;
  durationValue: number;
  durationUnit: "minutes" | "hours";
  learnerProfileId: string;
}

export interface LessonContentBlock {
  rationale: string;
  assessment_format: string;
}

export interface LessonSections {
  introduction: LessonContentBlock;
  context: LessonContentBlock;
  example: LessonContentBlock;
  activity: LessonContentBlock;
  assessment: LessonContentBlock;
  reflection: LessonContentBlock;
}

export interface Lesson extends LessonSections {
  name: string;
  durationValue: number;
  durationUnit: "minutes" | "hours";
}
