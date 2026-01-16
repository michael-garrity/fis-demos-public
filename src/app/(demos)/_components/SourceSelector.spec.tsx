import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SourceSelector } from "./SourceSelector";

const mockSources = [
  { id: "1", title: "Algebra Basics" },
  { id: "2", title: "Physics Intro" },
];

const defaultProps = {
  sources: mockSources,
  value: "",
  customSource: {
    title: "",
    markdown: "",
  },
  onSourceChange: vi.fn(),
  onCustomChange: vi.fn(),
  onViewSource: vi.fn(),
  isLoading: false,
};

describe("SourceSelector", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<SourceSelector {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it("renders source options including Custom", () => {
    render(<SourceSelector {...defaultProps} />);

    const trigger = screen.getByRole("button", { name: /source material/i });
    fireEvent.click(trigger);

    expect(
        screen.getByRole("option", { name: "Algebra Basics" })
    ).toBeInTheDocument();

    expect(
        screen.getByRole("option", { name: "Physics Intro" })
    ).toBeInTheDocument();

    expect(
        screen.getByRole("option", { name: "Custom" })
    ).toBeInTheDocument();
  });


  it("shows View Source button only when a non-custom source is selected", () => {
    const { rerender } = render(
      <SourceSelector
        {...defaultProps}
        value="1"
      />
    );

    expect(screen.getByText(/view source/i)).toBeInTheDocument();

    rerender(
      <SourceSelector
        {...defaultProps}
        value="custom"
      />
    );

    expect(screen.queryByText(/view source/i)).not.toBeInTheDocument();
  });

  it("shows custom inputs when Custom is selected", () => {
    render(
      <SourceSelector
        {...defaultProps}
        value="custom"
      />
    );

    expect(
      screen.getByLabelText(/custom source title/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/custom source content/i)
    ).toBeInTheDocument();
  });

  it("calls onCustomChange when typing in custom inputs", () => {
    render(
      <SourceSelector
        {...defaultProps}
        value="custom"
      />
    );

    const titleInput = screen.getByLabelText(/custom source title/i);
    const contentInput = screen.getByLabelText(/custom source content/i);

    fireEvent.change(titleInput, { target: { value: "My Custom Title" } });
    fireEvent.change(contentInput, { target: { value: "# Markdown Content" } });

    expect(defaultProps.onCustomChange).toHaveBeenCalledTimes(2);
    expect(defaultProps.onCustomChange).toHaveBeenLastCalledWith({
      title: "",
      markdown: "# Markdown Content",
    });
  });

  it("calls onViewSource when View Source button is clicked", () => {
    render(
      <SourceSelector
        {...defaultProps}
        value="1"
      />
    );

    fireEvent.click(screen.getByText(/view source/i));
    expect(defaultProps.onViewSource).toHaveBeenCalledTimes(1);
  });

  it("calls onSourceChange when a source is selected", () => {
    render(<SourceSelector {...defaultProps} />);

    const trigger = screen.getByRole("button", { name: /source material/i });
    fireEvent.click(trigger);

    const option = screen.getByRole("option", { name: "Physics Intro" });
    fireEvent.click(option);


    expect(defaultProps.onSourceChange).toHaveBeenCalledWith("2");
  });
});

