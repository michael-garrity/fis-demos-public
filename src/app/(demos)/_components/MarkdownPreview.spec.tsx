import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MarkdownPreview from "./MarkdownPreview";

describe("MarkdownPreview", () => {
  it("renders the editor textarea with label and placeholder", () => {
    render(
      <MarkdownPreview
        label="Personalized Content"
        value=""
        onChange={vi.fn()}
        placeholder="Write markdown here"
      />
    );

    expect(
      screen.getByPlaceholderText("Write markdown here")
    ).toBeInTheDocument();

    // HeroUI renders labels as accessible text
    expect(
      screen.getByText("Personalized Content")
    ).toBeInTheDocument();
  });

  it("renders segmented tabs", () => {
    render(
      <MarkdownPreview
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Split" })).toBeInTheDocument();
  });

  it("shows empty preview message when switching to preview mode", async () => {
    const user = userEvent.setup();

    render(
      <MarkdownPreview
        value=""
        onChange={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Preview" })
    );

    expect(
      screen.getByText("Nothing to preview yet")
    ).toBeInTheDocument();
  });

  it("renders markdown content in preview mode", async () => {
    const user = userEvent.setup();
    
    const markdown = `
# Heading

This is **bold** text.

- Item one
- Item two
`;

    render(
      <MarkdownPreview
        value={markdown}
        onChange={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Preview" })
    );

    // Heading rendered
    expect(
      screen.getByRole("heading", { name: "Heading" })
    ).toBeInTheDocument();

    // Bold text rendered (semantic check, not style check)
    const boldElement = screen.getByText("bold");
    expect(boldElement.tagName.toLowerCase()).toBe("strong");

    // List items rendered
    expect(screen.getByText("Item one")).toBeInTheDocument();
    expect(screen.getByText("Item two")).toBeInTheDocument();
  });

  it("calls onChange when the user types in the editor", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MarkdownPreview
        value=""
        onChange={onChange}
      />
    );

    const textarea = screen.getByRole("textbox");

    await user.type(textarea, "Hello");

    // HeroUI fires onValueChange per keystroke
    expect(onChange).toHaveBeenCalled();

    // Last call contains full value
    const typedValue = onChange.mock.calls
    .map(call => call[0])
    .join("");

    expect(typedValue).toBe("Hello");
  });

  it("renders live preview header only in split mode", async () => {
    const user = userEvent.setup();

    render(
      <MarkdownPreview
        value="Test"
        onChange={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Split" })
    );

    expect(
      screen.getByText("Live Preview")
    ).toBeInTheDocument();
  });

  it("applies the heightClassName to both editor and preview in split mode", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <MarkdownPreview
        value="Test"
        onChange={vi.fn()}
        heightClassName="h-[600px]"
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Split" })
    );

    const heightContainers =
      container.querySelectorAll(".h-\\[600px\\]");

    expect(heightContainers.length).toBe(2);
  });
});
