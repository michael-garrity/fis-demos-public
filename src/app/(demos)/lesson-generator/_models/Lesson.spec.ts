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
});
