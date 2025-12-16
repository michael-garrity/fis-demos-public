import { BaseListRecord } from "@/types";

export interface PersonalizedContentRecord extends BaseListRecord {
  title: string;
  description: string;
  durationValue: number;
  durationUnit: "minutes" | "hours";
  learnerProfileId: string;
}
export interface PersonalizedContentFormState extends PersonalizedContentRecord {
  lesson: object[];
  customization: string;
}

export interface PersonalizedContentBlock {
  rationale: string;
  assessment_format: string;
}
export interface PersonalizedContentSections {
  introduction: PersonalizedContentBlock;
  context: PersonalizedContentBlock;
  example: PersonalizedContentBlock;
  activity: PersonalizedContentBlock;
  assessment: PersonalizedContentBlock;
  reflection: PersonalizedContentBlock;
}
export interface PersonalizedContent extends PersonalizedContentSections {
  name: string;
  durationValue: number;
  durationUnit: "minutes" | "hours";
}
