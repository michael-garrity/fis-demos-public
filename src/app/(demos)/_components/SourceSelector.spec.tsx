import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SourceSelector } from "./SourceSelector";

const mockSources = [
  { id: "1", title: "Algebra Basics" },
  { id: "2", title: "Physics Intro" },
];

vi.mock("@/features/source-materials", () => ({
  useSourceMaterials: () => ({
    data: mockSources, 
    isLoading: false
  }),
}));

const defaultProps = {
  onSourceChange: vi.fn(),
  onViewSource: vi.fn(),
};

describe("SourceSelector", () => {
  beforeEach(() => {
    defaultProps.onSourceChange.mockReset()
  })

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
    render(
      <SourceSelector
        {...defaultProps}
      />
    );

    const trigger = screen.getByRole("button", { name: /source material/i });
    fireEvent.click(trigger);
    const firstItem = screen.getByRole("option", {name: "Physics Intro"})
    fireEvent.click(firstItem)
    
    expect(screen.getByText(/view source/i)).toBeInTheDocument();

    fireEvent.click(trigger);
    const custom = screen.getByRole("option", {name: "Custom"})
    fireEvent.click(custom)

    expect(screen.queryByText(/view source/i)).not.toBeInTheDocument();
  });

  it("shows custom inputs when Custom is selected", () => {
    render(
      <SourceSelector
        {...defaultProps}
      />
    );
    const trigger = screen.getByRole("button", { name: /source material/i });
    fireEvent.click(trigger);
    const custom = screen.getByRole("option", {name: "Custom"})
    fireEvent.click(custom)

    expect(
      screen.getByLabelText(/custom source title/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/custom source content/i)
    ).toBeInTheDocument();
  });

  it("calls onSourceChange when typing in custom inputs", () => {
    render(
      <SourceSelector
        {...defaultProps}
      />
    );
    const trigger = screen.getByRole("button", { name: /source material/i });
    fireEvent.click(trigger);
    const custom = screen.getByRole("option", {name: "Custom"})
    fireEvent.click(custom)

    const titleInput = screen.getByLabelText(/custom source title/i);
    const contentInput = screen.getByLabelText(/custom source content/i);

    fireEvent.change(titleInput, { target: { value: "My Custom Title" } });
    fireEvent.change(contentInput, { target: { value: "# Markdown Content" } });

    expect(defaultProps.onSourceChange).toHaveBeenCalledTimes(3);
    expect(defaultProps.onSourceChange).toHaveBeenLastCalledWith({
      title: "My Custom Title",
      markdown: "# Markdown Content",
    });
  });

  it("calls onViewSource when View Source button is clicked", () => {
    render(
      <SourceSelector
        {...defaultProps}
      />
    );

    const trigger = screen.getByRole("button", { name: /source material/i });
    fireEvent.click(trigger);
    const firstItem = screen.getByRole("option", { name: mockSources[1].title })
    fireEvent.click(firstItem)

    fireEvent.click(screen.getByText(/view source/i));
    expect(defaultProps.onViewSource).toHaveBeenCalledTimes(1);
  });

  it("calls onSourceChange when a source is selected", () => {
    render(<SourceSelector {...defaultProps} />);

    const trigger = screen.getByRole("button", { name: /source material/i });
    fireEvent.click(trigger);

    const source = mockSources[1]

    const option = screen.getByRole("option", { name: source.title });
    fireEvent.click(option);


    expect(defaultProps.onSourceChange).toHaveBeenCalledWith({
      title: source.title,
      markdown: ""
    });
    });
});

