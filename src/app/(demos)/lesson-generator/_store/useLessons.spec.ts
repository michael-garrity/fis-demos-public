import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLessons } from "./useLessons";
import { Lesson } from "../_models";
import { factory } from "@/test";

const mockLessons = [
  new Lesson(factory.build("lesson")),
  new Lesson(factory.build("lesson")),
];

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({
    data: mockLessons,
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

describe("useLessons", () => {
  it("returns the query result with data, isLoading, and isError", () => {
    const { result } = renderHook(() => useLessons());

    expect(result.current.data).toEqual(mockLessons);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
