import { Lesson, LessonRow } from "../_models";

export interface LessonGenerateRequest {
  title: string;
  customization?: string;
  creation_meta: {
    learner_profile: {
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
}

export const generateLesson = async (
  payload: LessonGenerateRequest,
): Promise<Lesson> => {
  const response = await fetch("/api/lessons/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate lesson: ${errorText}`);
  }

  const row: LessonRow = await response.json();
  return new Lesson(row);
};
