import { BaseListRecord } from "@/types";

export interface PersonalizedContentRecord extends BaseListRecord {
  title: string;
  learnerProfileId: string;
}
export interface PersonalizedContentFormState extends PersonalizedContentRecord {
  sourceMaterial: string;
  customization: string;
  customSource: {
    title: string;
    markdown: string;
  };
}
