"use client";

import { CourseOutline } from "./_models";
import ListView from "../_components/List";
import CourseOutlineListRecord from "./_components/CourseOutlineListRecord";
import { useCourseOutlines } from "./_store";

export default function CourseOutlineDemoPage() {
  const { data: outlines, isLoading, isError, error } = useCourseOutlines();

  if (isError) {
    return <p>Error loading courses: {error.message}</p>;
  }

  return (
    <ListView<CourseOutline>
      records={outlines ?? []}
      title="Course Outlines"
      createNewRoute="/course-outline/create"
      RenderItem={CourseOutlineListRecord}
      isLoading={isLoading}
    />
  );
}
