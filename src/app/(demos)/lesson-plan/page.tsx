"use client";

import ListView from "../_components/List";
import LessonPlanListRecord from "./_components/LessonPlanListRecord";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { useListLessonPlan } from "./_store/useLessonPlanList";

export default function LessonPlanDemoPage() {
  // Get lesson array using tanstack query hook
  const { data: lessons, isLoading, isError, error } = useListLessonPlan();

  if (isError) {
    return <p>Error loading lessons: {error.message}</p>;
  }

  return (
    <ListView<LessonPlanRecord>
      records={lessons ?? []}
      title="Lesson Plans"
      createNewRoute="/lesson-plan/create"
      RenderItem={LessonPlanListRecord}
      isLoading={isLoading}
    />
  );
}
