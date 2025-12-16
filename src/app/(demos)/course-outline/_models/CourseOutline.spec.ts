import { CourseOutline } from "./";
import { LearnerProfile } from "@/lib/learner-profiles"
import { describe, it, expect } from "vitest";
import { factory } from "@/test"

describe("CourseOutline", () => {
  describe("asUpdate", () => {
    it("returns an object with title, description, and lesson_outlines", () => {
      const data = factory.build("courseOutline");
      const courseOutline = new CourseOutline(data);

      const update = courseOutline.asUpdate();

      expect(update).toEqual({
        title: data.title,
        description: data.description,
        lesson_outlines: data.lesson_outlines,
      });
    });
  });

  describe("with", () => {
    it("returns a new instance with the updated title", () => {
      const data = factory.build("courseOutline", { title: "Original Title" });
      const courseOutline = new CourseOutline(data);

      const updated = courseOutline.with("title", "New Title");

      expect(updated.title).toBe("New Title");
      expect(courseOutline.title).toBe("Original Title");
      expect(updated).not.toBe(courseOutline);
    });

    it("returns a new instance with the updated description", () => {
      const data = factory.build("courseOutline", { description: "Original Desc" });
      const courseOutline = new CourseOutline(data);

      const updated = courseOutline.with("description", "New Desc");

      expect(updated.description).toBe("New Desc");
      expect(courseOutline.description).toBe("Original Desc");
      expect(updated).not.toBe(courseOutline);
    });

    it("does not modify other fields when editing one field", () => {
      const data = factory.build("courseOutline", { title: "Original" });
      const courseOutline = new CourseOutline(data);

      const updated = courseOutline.with("title", "Updated Title");

      expect(updated.title).toBe("Updated Title");
      expect(updated.description).toEqual(courseOutline.description);
    });
  });

  it("returns the correct id", () => {
    const data = factory.build("courseOutline");
    const courseOutline = new CourseOutline(data);
    expect(courseOutline.id).toBe(data.id);
  });

  it("returns the learner profile", () => {
    const learnerProfile = factory.build("learnerProfile");
    const data = factory.build("courseOutline", { creationMeta: { learnerProfile } });
    const courseOutline = new CourseOutline(data);
    expect(courseOutline.learnerProfile).toBeInstanceOf(LearnerProfile);
    expect(courseOutline.learnerProfile?.label).toBe(learnerProfile.label);
  });

  it("returns the title and description", () => {
    const data = factory.build("courseOutline");
    const courseOutline = new CourseOutline(data);
    expect(courseOutline.title).toBe(data.title);
    expect(courseOutline.description).toBe(data.description);
  });

  it("returns the correct lesson outline count", () => {
    const lessonOutlines = factory.buildList("lessonOutline", 2);
    const data = factory.build("courseOutline", { lessonOutlines })
    const courseOutline = new CourseOutline(data);
    expect(courseOutline.lessonOutlineCount).toBe(2);
  });

  it("returns the lesson outlines", () => {
    const data = factory.build("courseOutline");
    const courseOutline = new CourseOutline(data);
    expect(courseOutline.lessonOutlines).toEqual(data.lesson_outlines);
  });

  it("calculates total minutes correctly", () => {
    const lessonOutlines = [
      factory.build("lessonOutline", { minutes: 40 }),
      factory.build("lessonOutline", { minutes: 2 }),
    ]
    const data = factory.build("courseOutline", { lessonOutlines })
    const courseOutline = new CourseOutline(data);
    expect(courseOutline.totalMinutes).toBe(42);
  });

  describe("without learner profile data", () => {
    it("returns null for the learner profile", () => {
      const data = factory.build("courseOutline", { creation_meta: {} });
      const courseOutline = new CourseOutline(data);
      expect(courseOutline.learnerProfile).toBeNull();
    });
  });

  describe("totalMinutesInWords", () => {
    it("returns '0 min' when totalMinutes is 0", () => {
      const data = factory.build("courseOutline", { lessonOutlines: [] });
      const courseOutline = new CourseOutline(data);
      expect(courseOutline.totalMinutesInWords).toBe("0 min");
    });

    it("returns only minutes when less than 60", () => {
      const lessonOutlines = [
        factory.build("lessonOutline", { minutes: 1 }),
        factory.build("lessonOutline", { minutes: 14 }),
      ];
      const data = factory.build("courseOutline", { lessonOutlines });
      const courseOutline = new CourseOutline(data);
      expect(courseOutline.totalMinutesInWords).toBe("15 mins");
    });

    it("returns only hours when totalMinutes is an exact multiple of 60", () => {
      const lessonOutlines = [
        factory.build("lessonOutline", { minutes: 60 }),
        factory.build("lessonOutline", { minutes: 120 }),
      ];
      const data = factory.build("courseOutline", { lessonOutlines });
      const courseOutline = new CourseOutline(data);
      expect(courseOutline.totalMinutesInWords).toBe("3 hrs");
    });

    it("returns hours and minutes when totalMinutes has both", () => {
      const lessonOutlines = [
        factory.build("lessonOutline", { minutes: 70 }), // 1 hr 10 min
      ];
      const data = factory.build("courseOutline", { lessonOutlines });
      const courseOutline = new CourseOutline(data);
      expect(courseOutline.totalMinutesInWords).toBe("1 hr 10 mins");
    });

    it("uses singular labels for 1 hour or 1 minute", () => {
      const lessonOutlines = [
        factory.build("lessonOutline", { minutes: 61 }), // 1 hr 1 min
      ];
      const data = factory.build("courseOutline", { lessonOutlines });
      const courseOutline = new CourseOutline(data);
      expect(courseOutline.totalMinutesInWords).toBe("1 hr 1 min");
    });
  });
});
