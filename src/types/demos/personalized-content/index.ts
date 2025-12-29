import { BaseListRecord } from "@/types";

export interface PersonalizedContentRecord extends BaseListRecord {
  title: string;
  description: string;
  learnerProfileId: string;
}
export interface PersonalizedContentFormState extends PersonalizedContentRecord {
  sourceLesson: string;
  customization: string;
}
