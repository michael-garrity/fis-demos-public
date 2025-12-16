export const personalizedContentKeys = {
  // Base key for the entity
  all: ["personalizedContent"] as const,

  list: () => [...personalizedContentKeys.all, "list"] as const,
    
  create: () => [...personalizedContentKeys.all, "create"] as const,

  // These keys are TODO: to be implemented later
  detail: (id: string | number) => [...personalizedContentKeys.all, "detail", id] as const,

  update: () => [...personalizedContentKeys.all, "update"] as const,

  delete: () => [...personalizedContentKeys.all, "delete"] as const,
};
