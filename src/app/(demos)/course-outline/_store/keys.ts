export const courseKeys = {
  // Base key for the entity
  all: ["courseOutlines"] as const,

  // Key for the main list view (used in useCourseOutlines)
  list: () => [...courseKeys.all, "list"] as const,

  // Key for a single detail view (optional, but good practice)
  detail: (id: string | number) => [...courseKeys.all, "detail", id] as const,

  // Key for the create mutation (used for mutationKey in useCreateCourseOutline)
  create: () => [...courseKeys.all, "create"] as const,
};
