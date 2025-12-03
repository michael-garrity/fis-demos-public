import { BaseListRecord } from "@/types";

export interface CourseOutlineRecord extends BaseListRecord {
  title: string;
  description: string;
  numberOfLessons: number;
  durationValue: number;
  durationUnit: "minutes" | "hours";
  learnerProfileId: string;
}

export interface CourseOutlineFormState extends CourseOutlineRecord {
  customization: string;
}
