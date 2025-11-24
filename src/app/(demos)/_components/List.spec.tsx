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
}));

// --- TEST DATA ---

const MOCK_RECORDS: TestRecord[] = [
  { id: "101", name: "Product A" },
  { id: "102", name: "Product B" },
];

const MOCK_PROPS = {
  records: MOCK_RECORDS,
  title: "Product List",
  createHref: "/products/new",
  RenderItem: MockRenderItem,
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
    expect(createButton).toHaveTextContent("+ Create New");
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

  it("generates and passes the correct view and edit links to RenderItem", () => {
    render(<ListView {...MOCK_PROPS} />);

    // 1. Check props passed for the first record (id: "101")
    const firstCall = MockRenderItem.mock.calls[0][0]; // arguments of first call

    // Base URL should be '/products' (stripped of '/new')
    expect(firstCall.record.id).toBe("101");
    expect(firstCall.viewHref).toBe("/products/101");
    expect(firstCall.editHref).toBe("/products/101/edit");

    // 2. Check props passed for the second record (id: "102")
    const secondCall = MockRenderItem.mock.calls[1][0]; // arguments of second call

    expect(secondCall.record.id).toBe("102");
    expect(secondCall.viewHref).toBe("/products/102");
    expect(secondCall.editHref).toBe("/products/102/edit");
  });

  it("handles createHref with URL parameters when generating links", () => {
    const propsWithParams = {
      ...MOCK_PROPS,
      createHref: "/products/new?page=1", // Test stripping params
    };
    render(<ListView {...propsWithParams} />);

    const firstCall = MockRenderItem.mock.calls[0][0];

    // Base URL should correctly strip both '/new' and '?page=1' to get '/products'
    expect(firstCall.viewHref).toBe("/products/101");
    expect(firstCall.editHref).toBe("/products/101/edit");
  });
});
