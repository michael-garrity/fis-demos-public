import { BaseListRecord } from "@/types";

export interface PersonalizedContentRecord extends BaseListRecord {
  title: string;
  learnerProfileId: string;
}
export interface PersonalizedContentFormState extends PersonalizedContentRecord {
  customization: string;
  sourceMaterial: {
    title: string;
    markdown: string;
  };
}

export interface PersonalizedContentGenerationRequest {
  title: string;
  sourceMaterial: string;
  learnerProfile: {
    label: string;
    age: number;
    reading_level: number;
    interests: string[];
    experience: string;
  };
  customization?: string;
}
