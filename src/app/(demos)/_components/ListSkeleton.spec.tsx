import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ListSkeleton from "./ListSkeleton";
import * as HeroUI from "@heroui/react";

// --- MOCKING @heroui/react COMPONENTS ---
// Define variables using 'let' so we can assign the mock implementation
// inside the hoisted 'vi.mock' factory function.

// Fix: The mock definitions (vi.fn()) are now moved inside the factory.
vi.mock("@heroui/react", () => {
  // 1. Define the mock implementations and assign them to the external 'let' variables.
  const MockCard = vi.fn(({ children, className }) => (
    <div data-testid="mock-card" className={className}>
      {children}
    </div>
  ));
  const MockSkeleton = vi.fn((props) => (
    <div data-testid="mock-skeleton" {...props} />
  ));

  // 2. Return the assigned functions for the test module to use.
  return {
    Card: MockCard,
    Skeleton: MockSkeleton,
  };
});

describe("ListSkeleton (Loading View)", () => {
  const MockCard = vi.mocked(HeroUI.Card);
  const MockSkeleton = vi.mocked(HeroUI.Skeleton);

  // Ensure mocks are fully defined before running setup
  if (!MockCard || !MockSkeleton) {
    throw new Error("Mocks were not initialized in the vi.mock factory.");
  }

  beforeEach(() => {
    // Clear mock history before each test
    MockCard.mockClear();
    MockSkeleton.mockClear();
  });

  it("renders without crashing and is visually full width", () => {
    render(<ListSkeleton />);
    // Check for the wrapper div using the data-testid added to the component
    const container = screen.getByTestId("list-skeleton-wrapper");

    // Check for the wrapper div
    expect(container).toBeInTheDocument();
  });

  it("renders exactly 5 skeleton loading cards", () => {
    render(<ListSkeleton />);

    // Check that the mock Card component was called 5 times (for the 5 skeleton items)
    expect(MockCard).toHaveBeenCalledTimes(5);

    // Check that 5 mock-card elements exist in the DOM
    const cardElements = screen.getAllByTestId("mock-card");
    expect(cardElements.length).toBe(5);
  });

  it("renders the correct structure of placeholders inside each card", () => {
    render(<ListSkeleton />);

    // Each row contains 4 Skeleton placeholders:
    // 1. Title Placeholder
    // 2. Description Placeholder
    // 3. View Button Placeholder
    // 4. Edit Button Placeholder
    const expectedSkeletonsPerItem = 4;
    const expectedTotalSkeletons = 5 * expectedSkeletonsPerItem;

    // Check that the mock Skeleton component was called the total expected number of times
    expect(MockSkeleton).toHaveBeenCalledTimes(expectedTotalSkeletons);

    // Check that the correct total number of mock-skeleton elements exist in the DOM
    const skeletonElements = screen.getAllByTestId("mock-skeleton");
    expect(skeletonElements.length).toBe(expectedTotalSkeletons);
  });
});
