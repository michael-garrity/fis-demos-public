"use client";

import { Lesson } from "./_models";
import LessonListRecord from "./_components/LessonListRecord";
import { useLessons } from "./_store";
import DemoNavigationPanel from "../_components/DemoNavigationPanel";
import ListView from "../_components/List";

export default function LessonGeneratorDemoPage() {
  const { data: lessons, isLoading, isError, error } = useLessons();

  if (isError) {
    return (
      <>
        <DemoNavigationPanel backRoute="/" />
        <p>Error loading lessons: {error.message}</p>
      </>
    );
  }

  return (
    <>
      <DemoNavigationPanel backRoute="/" />
      <ListView<Lesson>
        records={lessons ?? []}
        title="Generated Lessons"
        createNewRoute="/lessons/create"
        RenderItem={LessonListRecord}
        isLoading={isLoading}
      />
    </>
  );
}
