export const quizKeys = {
// Base key for the entity
  all: ["quizzes"] as const,

  // Key for the main list view (used in useCourseOutlines)
  list: () => [...quizKeys.all, "list"] as const,

  // Key for a single detail view (optional, but good practice)
  detail: (id: string | number) => [...quizKeys.all, "detail", id] as const,

  // Key for the create mutation (used for mutationKey in useCreateCourseOutline)
  save: () => [...quizKeys.all, "save"] as const,

  generate: () => [...quizKeys.all, "generate"] as const,

  // Key for the update mutation (used for mutationKey in useUpdateCourseOutline)
  update: () => [...quizKeys.all, "update"] as const,

  // Key for the delete mutation (used for mutationKey in useDeleteCourseOutline)
  delete: () => [...quizKeys.all, "delete"] as const,
};
