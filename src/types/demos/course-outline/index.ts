import { BaseListRecord } from "@/types";

export interface CourseOutlineRecord extends BaseListRecord {
  title: string;
  description: string;
  numberOfLessons: number;
  timePerLesson: string;
  learnerProfile: string | number;
}
