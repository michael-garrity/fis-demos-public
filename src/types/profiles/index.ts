import { BaseListRecord } from "../list";

export interface LearnerProfile extends BaseListRecord {
  name: string;
  age: string;
  readingLevel: string;
  experience: string;
  interests: string[];
}
