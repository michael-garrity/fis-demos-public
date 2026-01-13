import { SetStateAction, useState } from "react";
import { usePersonalizedContent, useUpdatePersonalizedContent, PersonalizedContent} from "@/features/personalized-content";

const isEqual = (
  a?: PersonalizedContent,
  b?: PersonalizedContent
): boolean => JSON.stringify(a) !== JSON.stringify(b)


export const useEditPersonalizedContent = (id: string) => {
  const { data, isFetching, error, status, } = usePersonalizedContent(id);
  const { mutate, isPending, isSuccess, } = useUpdatePersonalizedContent();

  const [state, setState] = useState<{
    personalizedContent: PersonalizedContent | undefined;
    originalPersonalizedContent: PersonalizedContent | undefined;
    lastFetchedData: PersonalizedContent | undefined;
  }>({
    personalizedContent: data,
    originalPersonalizedContent: data,
    lastFetchedData: data,
  });

  if (data !== state.lastFetchedData) {
    setState({
      personalizedContent: data,
      originalPersonalizedContent: state.originalPersonalizedContent ?? data,
      lastFetchedData: data,
    });
  }

  const isModified = isEqual(state.personalizedContent, state.originalPersonalizedContent);

  const setPersonalizedContent = (personalizedContent: SetStateAction<PersonalizedContent | undefined>) => {
    setState(prev => ({
      ...prev,
      personalizedContent: typeof personalizedContent === 'function' ?
        personalizedContent(prev.personalizedContent) : personalizedContent,
    }));
  };

  const handleChange = (name: "title" | "description" | "content", value: string) => {
    setPersonalizedContent((prev) => {
      if (!prev) return undefined;

      return prev.with(name, value);
    });
  }

  const saveChanges = () => {
    if (!state.personalizedContent) return;

    mutate(state.personalizedContent, {
      onSuccess: (updatedData) => {
        setState({
          personalizedContent: updatedData,
          originalPersonalizedContent: updatedData,
          lastFetchedData: updatedData,
        })
      },
      onError: (err) => {
        console.error("Save failed:", err);
      },
    });
  }

  const cancelChanges = () => {
    if (state.originalPersonalizedContent) {
      setPersonalizedContent(state.originalPersonalizedContent);
    }
  };

  return {
    personalizedContent: state.personalizedContent,
    isModified,
    isPending,
    isFetching,
    error,
    isSuccess,
    status,
    handleChange,
    saveChanges,
    cancelChanges,
  };
};
