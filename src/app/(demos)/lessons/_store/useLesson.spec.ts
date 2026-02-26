import * as services from "../_services/getLesson";
import { Lesson } from "../_models";
import { describe, it, expect, vi, afterEach } from "vitest";
import { factory } from "@/test";
import { renderHook, waitFor } from "@testing-library/react";
import { useLesson } from "./useLesson";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createElement } from "react";

describe("useLesson", () => {
  const row = factory.build("lesson");
  const lesson = new Lesson(row);

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

  it("fetches a lesson successfully", async () => {
    const spy = vi.spyOn(services, "getLesson").mockResolvedValue(lesson);

    const { result } = renderHook(() => useLesson(lesson.id), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(lesson);
    expect(spy).toHaveBeenCalledWith(lesson.id);
  });

  it("handles errors correctly", async () => {
    const error = new Error("Network error");
    const spy = vi.spyOn(services, "getLesson").mockRejectedValue(error);

    const { result } = renderHook(() => useLesson(lesson.id), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));

    expect(result.current.status).toBe("error");
    expect(result.current.error?.message).toBe("Network error");
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(spy).toHaveBeenCalledWith(lesson.id);
  });
});
