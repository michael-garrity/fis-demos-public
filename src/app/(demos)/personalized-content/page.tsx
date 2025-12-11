"use client";

import { PersonalizedContentRecord } from "@/types/demos/personalized-content";
import ListView from "../_components/List";
import PersonalizedContentListRecord from "./_components/PersonalizedContentListRecord";
import { useMockPersonalizedContentList } from "./_store/useMockPersonalizedContentList";

export default function PersonalizedContentDemoPage() {
  const { data: content, isLoading, error } = useMockPersonalizedContentList();

  if (error) {
    return <p>Error loading content</p>;
  }

  return (
    <ListView<PersonalizedContentRecord>
      records={content ?? []}
      title="Personalized Content Demo"
      createNewRoute="/personalized-content/create"
      RenderItem={PersonalizedContentListRecord}
      isLoading={isLoading}
    />
  );
}
