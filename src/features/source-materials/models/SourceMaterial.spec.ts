import { describe, it, expect } from "vitest";
import { SourceMaterial } from "@source-materials";
import { factory } from "@/test";

describe("SourceMaterial", () => {
  const data = factory.build("sourceMaterial");
  const sourceMaterial = new SourceMaterial(data);

  it("returns the correct id", () => {
    expect(sourceMaterial.id).toBe(data.id);
  });

  it("returns the title", () => {
    expect(sourceMaterial.title).toBe(data.title);
  });

  it("returns the markdown", () => {
    expect(sourceMaterial.markdown).toBe(data.markdown);
  });

  describe("with", () => {
    it("returns a new instance with an updated title", () => {
      const data = factory.build("sourceMaterial", { title: "Original Title" });
      const sourceMaterial = new SourceMaterial(data);

      const updated = sourceMaterial.with("title", "New Title");

      expect(updated.title).toBe("New Title");
      expect(sourceMaterial.title).toBe("Original Title");
      expect(updated).not.toBe(sourceMaterial);
    });

    it("returns a new instance with the updated markdown", () => {
      const data = factory.build("sourceMaterial", { markdown: "Original MD" });
      const sourceMaterial = new SourceMaterial(data);

      const updated = sourceMaterial.with("markdown", "New MD");

      expect(updated.markdown).toBe("New MD");
      expect(sourceMaterial.markdown).toBe("Original MD");
      expect(updated).not.toBe(sourceMaterial);
    });

    it("does not modify other fields when editing one field", () => {
      const data = factory.build("sourceMaterial", { title: "Original" });
      const sourceMaterial = new SourceMaterial(data);

      const updated = sourceMaterial.with("title", "Updated Title");

      expect(updated.title).toBe("Updated Title");
      expect(updated.markdown).toEqual(sourceMaterial.markdown);
    });
  });
});
