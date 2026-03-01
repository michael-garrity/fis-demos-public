import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode, createElement } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";

import { factory } from "@/test";
import { Lesson } from "../_models";
import * as services from "../_services/generateLesson";
import { lessonKeys } from "./keys";
import { useGenerateLesson } from "./useGenerateLesson";

describe("useGenerateLesson", () => {
  const generatedLesson = new Lesson(factory.build("lesson"));
  const existingLesson = new Lesson(factory.build("lesson"));

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createWrapper() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: Infinity,
          retry: false,
          staleTime: 0,
          refetchOnWindowFocus: false,
        },
      },
    });

    return {
      queryClient,
      Wrapper: ({ children }: { children: ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children),
    };
  }

  it("generates lesson and prepends it to the list cache when cache exists", async () => {
    const spy = vi
      .spyOn(services, "generateLesson")
      .mockResolvedValue(generatedLesson);
    const { queryClient, Wrapper } = createWrapper();

    queryClient.setQueryData(lessonKeys.list(), [existingLesson]);

    const { result } = renderHook(() => useGenerateLesson(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      title: "Generated Lesson",
      customization: "Use short examples.",
      creation_meta: {
        learner_profile: {
          label: "7th grader",
          age: 12,
          reading_level: 5,
          experience: "Has completed intro activities.",
          interests: ["Robotics"],
        },
        source_material: {
          title: "Atoms",
          content: "Atoms are building blocks.",
        },
      },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const updatedList = queryClient.getQueryData<Lesson[]>(lessonKeys.list());
    expect(spy).toHaveBeenCalledOnce();
    expect(updatedList).toEqual([generatedLesson, existingLesson]);
  });

  it("exposes mutation error state when generation fails", async () => {
    const error = new Error("Generation failed");
    vi.spyOn(services, "generateLesson").mockRejectedValue(error);
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useGenerateLesson(), {
      wrapper: Wrapper,
    });

    await expect(
      result.current.mutateAsync({
        title: "Generated Lesson",
        creation_meta: {
          learner_profile: {
            label: "7th grader",
            age: 12,
            reading_level: 5,
            experience: "Has completed intro activities.",
            interests: ["Robotics"],
          },
          source_material: {
            title: "Atoms",
            content: "Atoms are building blocks.",
          },
        },
      }),
    ).rejects.toThrow("Generation failed");

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
