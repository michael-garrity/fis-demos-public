import { describe, it, expect } from "vitest";
import { Lesson, LessonRow } from "./Lesson";
import { factory } from "@/test";

describe("Lesson", () => {
  const mockRow = factory.build("lesson") as LessonRow;

  describe("constructor", () => {
    it("creates a Lesson instance with the given data", () => {
      const lesson = new Lesson(mockRow);
      expect(lesson).toBeInstanceOf(Lesson);
    });
  });

  describe("getters", () => {
    it("returns the id", () => {
      const lesson = new Lesson(mockRow);
      expect(lesson.id).toBe(mockRow.id);
    });

    it("returns the title", () => {
      const lesson = new Lesson(mockRow);
      expect(lesson.title).toBe(mockRow.title);
    });

    it("returns the content", () => {
      const lesson = new Lesson(mockRow);
      expect(lesson.content).toBe(mockRow.content);
    });

    it("returns structured section fields", () => {
      const lesson = new Lesson(mockRow);
      expect(lesson.introduction).toBeTruthy();
      expect(lesson.context).toBeTruthy();
      expect(lesson.example).toBeTruthy();
      expect(lesson.practice).toBeTruthy();
      expect(lesson.assessment).toBeTruthy();
      expect(lesson.reflection).toBeTruthy();
      expect(lesson.lessonSections).toHaveLength(6);
    });

    it("returns the createdAt as Date", () => {
      const lesson = new Lesson(mockRow);
      expect(lesson.createdAt).toBeInstanceOf(Date);
    });

    it("returns the creationMeta", () => {
      const lesson = new Lesson(mockRow);
      expect(lesson.creationMeta).toEqual(mockRow.creation_meta);
    });
  });

  describe("learnerProfile", () => {
    it("returns null when no learner_profile in creation_meta", () => {
      const rowWithoutProfile = {
        ...mockRow,
        creation_meta: {},
      } as LessonRow;
      const lesson = new Lesson(rowWithoutProfile);
      expect(lesson.learnerProfile).toBeNull();
    });

    it("returns LearnerProfile when learner_profile exists", () => {
      const lesson = new Lesson(mockRow);
      expect(lesson.learnerProfile).not.toBeNull();
      expect(lesson.learnerProfile?.label).toBeDefined();
    });
  });

  describe("asUpdate", () => {
    it("returns an object with title and content", () => {
      const lesson = new Lesson(mockRow);
      const update = lesson.asUpdate();
      expect(update).toEqual({
        title: mockRow.title,
        content: mockRow.content,
      });
    });
  });

  describe("with", () => {
    it("creates a new Lesson with updated title", () => {
      const lesson = new Lesson(mockRow);
      const updated = lesson.with("title", "New Title");
      expect(updated.title).toBe("New Title");
      expect(updated.id).toBe(lesson.id);
    });

    it("creates a new Lesson with updated content", () => {
      const lesson = new Lesson(mockRow);
      const updated = lesson.with("content", "New Content");
      expect(updated.content).toBe("New Content");
      expect(updated.id).toBe(lesson.id);
    });
  });

  describe("legacy content fallback", () => {
    it("uses raw content as introduction when content is plain text", () => {
      const rawContent = "Legacy lesson content";
      const legacyRow = {
        ...mockRow,
        content: rawContent,
      } as LessonRow;

      const lesson = new Lesson(legacyRow);

      expect(lesson.introduction).toBe(rawContent);
      expect(lesson.context).toBe("");
      expect(lesson.example).toBe("");
      expect(lesson.practice).toBe("");
      expect(lesson.assessment).toBe("");
      expect(lesson.reflection).toBe("");
    });

    it("handles object content and still returns markdown strings", () => {
      const objectContent = {
        sections: {
          introduction: {
            title: "Introduction",
            markdown: "Intro from object payload",
          },
        },
      };
      const objectRow = {
        ...mockRow,
        content: objectContent,
      } as unknown as LessonRow;

      const lesson = new Lesson(objectRow);

      expect(typeof lesson.introduction).toBe("string");
      expect(lesson.introduction).toBe("Intro from object payload");
      expect(typeof lesson.content).toBe("string");
    });
  });
});
