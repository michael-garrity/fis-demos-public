import { SetStateAction, useState } from "react";
import { LessonPlanRecord, LessonPlanUpdate } from "@/types/demos/lesson-plan";
import { useLessonPlan } from "../../_store/useLessonPlan";
import { useLessonPlanEdit } from "../../_store/useLessonPlanEdit";

type TopLevelField = "sourceMaterialTitle" | "sourceMaterialContent";

type LessonSection =
  | "introduction"
  | "context"
  | "example"
  | "practice"
  | "assessment"
  | "reflection";

const isEqual = (a?: LessonPlanRecord, b?: LessonPlanRecord): boolean =>
  JSON.stringify(a) !== JSON.stringify(b);

export const useEditLessonPlanHook = (id: string) => {
  const { data, isFetching, error, status } = useLessonPlan(id);
  const { mutate, isPending, isSuccess } = useLessonPlanEdit();

  const [state, setState] = useState<{
    lessonPlan: LessonPlanRecord | undefined;
    originalLessonPlan: LessonPlanRecord | undefined;
    lastFetchedData: LessonPlanRecord | undefined;
  }>({
    lessonPlan: data,
    originalLessonPlan: data,
    lastFetchedData: data,
  });

  if (data !== state.lastFetchedData) {
    setState({
      lessonPlan: data,
      originalLessonPlan: state.originalLessonPlan ?? data,
      lastFetchedData: data,
    });
  }

  const isModified = isEqual(state.lessonPlan, state.originalLessonPlan);

  const setLessonPlan = (
    lessonPlan: SetStateAction<LessonPlanRecord | undefined>
  ) => {
    setState((prev) => ({
      ...prev,
      lessonPlan:
        typeof lessonPlan === "function"
          ? lessonPlan(prev.lessonPlan)
          : lessonPlan,
    }));
  };

  const handleTopLevelChange = (field: TopLevelField, value: string) => {
    setLessonPlan((prev) => {
      if (!prev) return prev;

      switch (field) {
        case "sourceMaterialTitle":
          return {
            ...prev,
            creation_meta: {
              ...prev.creation_meta,
              source_material: {
                ...prev.creation_meta.source_material,
                title: value,
              },
            },
          };

        case "sourceMaterialContent":
          return {
            ...prev,
            creation_meta: {
              ...prev.creation_meta,
              source_material: {
                ...prev.creation_meta.source_material,
                content: value,
              },
            },
          };

        default:
          return prev;
      }
    });
  };

  const handleLessonSectionChange = (section: LessonSection, value: string) => {
    setLessonPlan((prev) => (prev ? { ...prev, [section]: value } : prev));
  };

  const saveChanges = () => {
    if (!state.lessonPlan) return;

    // const { created_at, updated_at, ...updatableFields } = state.lessonPlan;
    const updatableFields: LessonPlanUpdate = state.lessonPlan;

    mutate(updatableFields, {
      onSuccess: (updatedData) => {
        setState({
          lessonPlan: updatedData,
          originalLessonPlan: updatedData,
          lastFetchedData: updatedData,
        });
      },
    });
  };

  const cancelChanges = () => {
    if (state.originalLessonPlan) {
      setLessonPlan(state.originalLessonPlan);
    }
  };

  return {
    lessonPlan: state.lessonPlan,
    isModified,
    isPending,
    isFetching,
    error,
    isSuccess,
    status,
    handleTopLevelChange,
    handleLessonSectionChange,
    saveChanges,
    cancelChanges,
  };
};
