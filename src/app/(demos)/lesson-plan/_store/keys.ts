export const lessonKeys = {
  // Base key for the entity
  all: ["lessonPlans"] as const,

  // Key for the main list view
  list: () => [...lessonKeys.all, "list"] as const,

  // Key for a single detail view (optional, but good practice)
  // TODO Implement useLessonPlanDetail
  detail: (id: string | number) => [...lessonKeys.all, "detail", id] as const,

  // Key for the create mutation
  create: () => [...lessonKeys.all, "create"] as const,

  // Key for the update mutation
  // TODO Implement useLessonPlanUpdate
  update: () => [...lessonKeys.all, "update"] as const,

  // Key for the delete mutation
  // TODO Implement useLessonPlanDelete
  delete: () => [...lessonKeys.all, "delete"] as const,
};
