"use client";

import { CourseOutlineRecord } from "@/types/demos/course-outline";
import ListView from "../_components/List";
import CourseOutlineListRecord from "./_components/CourseOutlineListRecord";
import { useCourseOutlines } from "@/hooks/stores/useCourseOutlines";

export default function CourseOutlineDemoPage() {
  const { data: outlines, isLoading, isError, error } = useCourseOutlines();

  if (isError) {
    return <p>Error loading courses: {error.message}</p>;
  }

  return (
    <ListView<CourseOutlineRecord>
      records={outlines ?? []}
      title="Course Outlines"
      createNewRoute="/course-outline/new"
      RenderItem={CourseOutlineListRecord}
      isLoading={isLoading}
    />
  );
}
