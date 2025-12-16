import { SetStateAction, useState } from "react";
import { CourseOutline, LessonOutline } from "@demos/course-outline/_models";
import { useCourseOutline, useUpdateCourseOutline } from "../../_store";

const isEqual = (
  a?: CourseOutline,
  b?: CourseOutline
): boolean => JSON.stringify(a) !== JSON.stringify(b)


export const useEditCourseOutline = (id: string) => {
  const { data, isFetching, error, status, } = useCourseOutline(id);
  const { mutate, isPending, isSuccess, } = useUpdateCourseOutline();

  const [state, setState] = useState<{
    courseOutline: CourseOutline | undefined;
    originalCourseOutline: CourseOutline | undefined;
    lastFetchedData: CourseOutline | undefined;
  }>({
    courseOutline: data,
    originalCourseOutline: data,
    lastFetchedData: data,
  });

  if (data !== state.lastFetchedData) {
    setState({
      courseOutline: data,
      originalCourseOutline: state.originalCourseOutline ?? data,
      lastFetchedData: data,
    });
  }

  const isModified = isEqual(state.courseOutline, state.originalCourseOutline);

  const setCourseOutline = (courseOutline: SetStateAction<CourseOutline | undefined>) => {
    setState(prev => ({
      ...prev,
      courseOutline: typeof courseOutline === 'function' ?
        courseOutline(prev.courseOutline) : courseOutline,
    }));
  };

  const handleTopLevelChange = (name: "title" | "description", value: string) => {
    setCourseOutline((prev) => {
      if (!prev) return undefined;

      return prev.with(name, value);
    });
  }

  const handleLessonOutlineChange = <K extends keyof LessonOutline>(
    index: number, field: K, value: LessonOutline[K]
  ) => {
    setCourseOutline((prev) => {
      if (!prev) return undefined;

      return prev.withLessonOutline(index, { [field]: value });
    });
  }

  const saveChanges = () => {
    if (!state.courseOutline) return;

    mutate(state.courseOutline, {
      onSuccess: (updatedData) => {
        setState({
          courseOutline: updatedData,
          originalCourseOutline: updatedData,
          lastFetchedData: updatedData,
        })
      },
      onError: (err) => {
        console.error("Save failed:", err);
      },
    });
  }

  const cancelChanges = () => {
    if (state.originalCourseOutline) {
      setCourseOutline(state.originalCourseOutline);
    }
  };

  return {
    courseOutline: state.courseOutline,
    isModified,
    isPending,
    isFetching,
    error,
    isSuccess,
    status,
    handleTopLevelChange,
    handleLessonOutlineChange,
    saveChanges,
    cancelChanges,
  };
};
