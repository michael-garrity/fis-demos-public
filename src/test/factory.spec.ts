import { describe, it, expect } from "vitest";
import { prepareTestSchema } from "./test-schema";

describe("factory", async () => {
  const { pgClient, factory } = await prepareTestSchema();

  describe("build", () => {
    it("returns the object with expected keys", () => {
      const obj = factory.build("learnerProfile");
      expect(obj).toHaveProperty("age");
      expect(obj).toHaveProperty("interests");
      expect(obj).toHaveProperty("label");
      expect(obj).toHaveProperty("reading_level");
    });

    it("throws for unknown factory", () => {
      expect(() => factory.build("unknownFactory"))
        .toThrow(/Unknown factory 'unknownFactory'/);
    });

    it("overrides are applied and converted to snake_case", () => {
      const obj = factory.build("learnerProfile", { interests: ["foo"], readingLevel: 1000 });
      expect(obj.interests).toEqual(["foo"]);
      expect(obj.reading_level).toBe(1000);
    });
  });


  describe("buildList", () => {
    it("returns the correct number of items", () => {
      const list = factory.buildList("learnerProfile", 3);
      expect(list).toHaveLength(3);
      list.forEach(item => expect(item).toHaveProperty("label"));
    });
  });

  describe("create", () => {
    it("inserts a new row", async () => {
      let rows;
      ({ rows } = await pgClient.query("SELECT * FROM course_outlines"));
      expect(rows.length).toBe(0);

      await factory.create("courseOutline");

      ({ rows } = await pgClient.query("SELECT * FROM course_outlines"));
      expect(rows.length).toBe(1);
    });

    it("inserts the row with the expected data", async () => {
      const override = { label: "TestUser", age: 42 };
      await factory.create("learnerProfile", override);

      const { rows } = await pgClient.query("SELECT * FROM learner_profiles");
      expect(rows[0].label).toBe(override.label);
      expect(rows[0].age).toBe(override.age);
    });

    it("returns the created row", async () => {
      const override = { label: "TestUser", age: 42 };
      const row = await factory.create("learnerProfile", override);

      expect(row).toHaveProperty("id");
      expect(row.label).toBe(override.label);
      expect(row.age).toBe(override.age);
    });
  });

  describe("createList", () => {
    it("inserts multiple rows", async () => {
      let rows;
      ({ rows } = await pgClient.query("SELECT * FROM learner_profiles"));
      expect(rows.length).toBe(0);

      await factory.createList("learnerProfile", 2);

      ({ rows } = await pgClient.query("SELECT * FROM learner_profiles"));
      expect(rows.length).toBe(2);
    });

    it("inserts the rows with the expected data", async () => {
      const override = { age: 42 };
      await factory.createList("learnerProfile", 2, override);

      const { rows } = await pgClient.query("SELECT * FROM learner_profiles");
      expect(rows[0].age).toBe(override.age);
      expect(rows[1].age).toBe(override.age);
    });

    it("returns the created rows", async () => {
      const override = { age: 42 };
      const rows = await factory.createList("learnerProfile", 2, override);

      expect(rows[0]).toHaveProperty("id");
      expect(rows[1]).toHaveProperty("id");
      expect(rows[0].age).toBe(override.age);
      expect(rows[1].age).toBe(override.age);
    });

    it("throws an error if once occurs", async () => {
      await expect(
        factory.create("learnerProfile", { bad_column: 123 })
      ).rejects.toThrow(
        /Could not find the 'bad_column' column of 'learner_profiles' in the schema cache/
      );
    });
  });
});
