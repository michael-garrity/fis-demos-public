export const lessonKeys = {
  all: ["lessons"] as const,

  list: () => [...lessonKeys.all, "list"] as const,

  detail: (id: string | number) => [...lessonKeys.all, "detail", id] as const,

  generate: () => [...lessonKeys.all, "generate"] as const,
};
