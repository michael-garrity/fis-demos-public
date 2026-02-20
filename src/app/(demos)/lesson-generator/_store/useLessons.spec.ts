import * as services from "../_services/getLessons";
import { Lesson } from "../_models";
import { describe, it, expect, vi, afterEach } from "vitest";
import { factory } from "@/test";
import { renderHook, waitFor } from "@testing-library/react";
import { useLessons } from "./useLessons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createElement } from "react";

describe("useLessons", () => {
  const rows = factory.buildList("lesson", 2);
  const lessons = rows.map((row) => new Lesson(row));

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createWrapper() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 0,
          retry: false,
          retryDelay: 1,
          staleTime: 0,
          refetchOnWindowFocus: false,
        },
      },
    });

    return function Wrapper({ children }: { children: ReactNode }) {
      return createElement(
        QueryClientProvider,
        { client: queryClient },
        children,
      );
    };
  }

  it("fetches lessons successfully", async () => {
    const spy = vi.spyOn(services, "getLessons").mockResolvedValue(lessons);

    const { result } = renderHook(() => useLessons(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(lessons);
    expect(spy).toHaveBeenCalledOnce();
  });

  it("handles errors correctly", async () => {
    const error = new Error("Network error");
    const spy = vi.spyOn(services, "getLessons").mockRejectedValue(error);
    const useLessonsWithOptions = useLessons as unknown as (options?: {
      retry?: boolean;
    }) => ReturnType<typeof useLessons>;

    const { result } = renderHook(
      () => useLessonsWithOptions({ retry: false }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));

    expect(result.current.status).toBe("error");
    expect(result.current.error?.message).toBe("Network error");
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(spy).toHaveBeenCalledOnce();
  });
});
