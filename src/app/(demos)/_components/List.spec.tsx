import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ListView from "./List";
import { BaseListRecord } from "@/types";

// --- MOCKING SETUP ---

// Creating a new BaseListRecord type for testing
interface TestRecord extends BaseListRecord {
  id: string;
  name: string;
}

/**
 * Mocking the internal RenderItem component to capture passed props
 * This allows us to assert on the generated viewHref and editHref.
 * We check those assertions because they are generated inside ListView.
 */
const MockRenderItem = vi.fn(({ record, viewHref, editHref }) => (
  <div data-testid={`item-${record.id}`}>
    <span>{record.name}</span>
    <a data-testid="view-link" href={viewHref}>
      View
    </a>
    <a data-testid="edit-link" href={editHref}>
      Edit
    </a>
  </div>
));

// Mock the @heroui/react components to prevent internal errors and keep tests focused
vi.mock("@heroui/react", () => ({
  Button: vi.fn(({ children, ...props }) => (
    <button {...props}>{children}</button>
  )),
  Card: vi.fn(({ children }) => <div data-testid="card">{children}</div>),
  Divider: vi.fn(() => <hr data-testid="divider" />),
  Link: vi.fn(({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )),
  Skeleton: vi.fn(() => <div data-testid="skeleton" />),
}));

// --- TEST DATA ---

const MOCK_RECORDS: TestRecord[] = [
  { id: "101", name: "Product A" },
  { id: "102", name: "Product B" },
];

const MOCK_PROPS = {
  records: MOCK_RECORDS,
  title: "Product List",
  createNewRoute: "/products/new",
  RenderItem: MockRenderItem,
  isLoading: false,
};

describe("ListView Component", () => {
  // Clear mock calls before each test
  beforeEach(() => {
    MockRenderItem.mockClear();
  });

  // --- Header and Structure Tests ---

  it("renders the correct title and structure", () => {
    render(<ListView {...MOCK_PROPS} />);

    // Check Title
    expect(
      screen.getByRole("heading", { name: "Product List" })
    ).toBeInTheDocument();

    // Check Divider
    expect(screen.getByTestId("divider")).toBeInTheDocument();
  });

  it("renders the 'Create New' button with the correct href", () => {
    render(<ListView {...MOCK_PROPS} />);

    const createButton = screen.getByTestId("create-new-button");

    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/products/new");
    expect(createButton).toHaveTextContent("Create New");
  });

  // --- Empty State Test ---

  it("renders the 'No records found' message when records array is empty", () => {
    render(<ListView {...MOCK_PROPS} records={[]} />);

    const emptyMessage = screen.getByText(
      "No records found. Click 'Create New' to get started!"
    );
    expect(emptyMessage).toBeInTheDocument();

    // Ensure no items were rendered
    expect(screen.queryByTestId("card")).not.toBeInTheDocument();
  });

  // --- Record Rendering and Link Generation Tests ---

  it("renders all records using the custom RenderItem component", () => {
    render(<ListView {...MOCK_PROPS} />);

    // Check that the RenderItem was called for each record
    expect(MockRenderItem).toHaveBeenCalledTimes(MOCK_RECORDS.length);

    // Check that the list items themselves are in the document
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("displays a skeleton loading view when isLoading is true", () => {
    render(<ListView {...MOCK_PROPS} isLoading={true} />);

    // Check that the skeleton wrapper is in the document
    const skeletonWrapper = screen.getByTestId("list-skeleton-wrapper");
    expect(skeletonWrapper).toBeInTheDocument();

    // Ensure no records are rendered while loading
    expect(screen.queryByTestId("list-item-card")).not.toBeInTheDocument();
  });
});
