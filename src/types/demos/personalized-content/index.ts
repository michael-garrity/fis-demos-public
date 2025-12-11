import { BaseListRecord } from "@/types";

export interface PersonalizedContentRecord extends BaseListRecord {
  title: string;
  intro: string;
  durationValue: number;
  durationUnit: "minutes" | "hours";
  learnerProfileId: string;
}

export interface PersonalizedContentFormState extends PersonalizedContentRecord {
  customization: string;
}
