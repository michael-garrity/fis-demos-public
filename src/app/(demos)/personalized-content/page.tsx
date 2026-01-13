"use client";

import { PersonalizedContent, usePersonalizedContentList } from "@/features/personalized-content";
import ListView from "../_components/List";
import PersonalizedContentListRecord from "./_components/PersonalizedContentListRecord";

export default function PersonalizedContentDemoPage() {
  const { data: content, isLoading, error } = usePersonalizedContentList();

  if (error) {
    return <p>Error loading content</p>;
  }

  return (
    <ListView<PersonalizedContent>
      records={content ?? []}
      title="Personalized Content Demo"
      createNewRoute="/personalized-content/create"
      RenderItem={PersonalizedContentListRecord}
      isLoading={isLoading}
    />
  );
}
