import { BaseListRecord } from "@/types/list";

// This is for the top header -> Details about course
export interface LessonPlanRecord extends BaseListRecord {
  creation_meta: {
    learner_profile: {
      id: string;
      age: number;
      label: string;
      interests: string[];
      experience: string;
      reading_level: number;
    };
    source_material: {
      title: string;
      content: string;
    };
  };
  introduction: string;
  context: string;
  example: string;
  practice: string;
  assessment: string;
  reflection: string;
  created_at: string;
  updated_at: string;
}
