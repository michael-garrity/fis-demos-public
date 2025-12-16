import { PersonalizedContentRecord } from "@/types";

const mockData: PersonalizedContentRecord[] = [
  {
    id: "1",
    title: "Introduction to Reading Skills",
    description: "This course introduces fundamental reading strategies.",
    durationValue: 45,
    durationUnit: "minutes",
    learnerProfileId: "1",
  },
  {
    id: "2",
    title: "Exploring Narrative Structures",
    description: "Learn how stories are structured and how to analyze them.",
    durationValue: 2,
    durationUnit: "hours",
    learnerProfileId: "2",
  },
];

// Mimic the shape of a react-query hook for easy future replacement.
export const useMockPersonalizedContentList = () => {
  return {
    data: mockData,
    isLoading: false,
    error: null,
  };
};

