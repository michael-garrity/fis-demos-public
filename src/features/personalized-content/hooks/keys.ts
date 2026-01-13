export const personalizedContentKeys = {
  // Base key for the entity
  all: ["personalizedContent"] as const,

  // Key for getting a list of personalized content from the database
  list: () => [...personalizedContentKeys.all, "list"] as const,

  // Key for fetching details of a specific personalized content item
  detail: (id: string | number) => [...personalizedContentKeys.all, "detail", id] as const,

  // Key for creating personalized content in the database
  create: () => [...personalizedContentKeys.all, "create"] as const,

  // Key for deleting personalized content from the database
  delete: () => [...personalizedContentKeys.all, "delete"] as const,

  // Key for saving personalized content to the database
  save: () => [...personalizedContentKeys.all, "save"] as const,

  // Key for updating personalized content in the database
  update: () => [...personalizedContentKeys.all, "update"] as const,
};

