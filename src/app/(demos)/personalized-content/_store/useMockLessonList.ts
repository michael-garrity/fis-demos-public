const mockData = [
  {
    id: "12",
    title: "Introduction to Algorithmic Thinking for Career Changers",
    description:
      "A customized lesson designed to help transitioning professionals understand core algorithmic problem-solving skills.",
    durationValue: 60,
    durationUnit: "minutes",
    learnerProfileId: "1",
    customization:
      "Adjusted examples and problem sets for learners with non-technical backgrounds.",
    lesson: [
      {
        name: "Warm-up Activity",
        content: "Identify steps in a familiar task.",
      },
    ],
    introduction: {
      rationale:
        "Introduce algorithmic thinking using relatable real-world workflows.",
      assessment_format:
        "Quick verbal check-in: have students describe a daily task as a sequence of steps.",
    },
    context: {
      rationale:
        "Connect algorithmic thinking to common workplace tasks such as prioritization and troubleshooting.",
      assessment_format:
        "Small-group activity evaluating inefficient workflows and suggesting improvements.",
    },
    example: {
      rationale:
        "Demonstrate algorithmic problem-solving using pseudocode for step-by-step clarity.",
      assessment_format:
        "Students rewrite a messy set of instructions into clean pseudocode.",
    },
    activity: {
      rationale:
        "Engage learners in solving a small logic puzzle using structured reasoning.",
      assessment_format:
        "Completion of a guided worksheet walking through branching decisions.",
    },
    assessment: {
      rationale:
        "Measure the learner’s ability to break down unfamiliar problems.",
      assessment_format:
        "Mini-quiz: convert a simple scenario (e.g., scheduling) into algorithmic steps.",
    },
    reflection: {
      rationale:
        "Encourage learners to connect structured thinking to their own career backgrounds.",
      assessment_format:
        "One-paragraph reflection on how algorithmic thinking applies to their previous job roles.",
    },
  },

  // ----------------------------------------------------------
  // 2nd Lesson
  // ----------------------------------------------------------
  {
    id: "13",
    title: "Understanding APIs Through Real-World Analogies",
    description:
      "A personalized lesson that introduces APIs using clear, relatable examples tailored for beginners switching careers.",
    durationValue: 75,
    durationUnit: "minutes",
    learnerProfileId: "2",
    customization:
      "API concepts simplified using workplace-related analogies from retail, healthcare, and logistics.",
    lesson: [
      {
        name: "Hands-On Demo",
        content: "Use a mock API playground to perform GET and POST requests.",
      },
    ],
    introduction: {
      rationale:
        "Introduce APIs through high-level metaphors that connect new concepts to familiar systems.",
      assessment_format:
        "Quick round-robin: learners describe an API metaphor in their own words.",
    },
    context: {
      rationale:
        "Explain where APIs show up in everyday tools like smartphones, banking apps, and online shopping.",
      assessment_format:
        "Group discussion identifying API interactions in a real-world workflow.",
    },
    example: {
      rationale:
        "Show a request–response cycle visually using diagrams and example URLs.",
      assessment_format:
        "Learners name each part of a printed request/response diagram.",
    },
    activity: {
      rationale:
        "Give learners the experience of sending mock API calls and seeing how endpoints behave.",
      assessment_format:
        "Completion of a small task list (fetching data, posting data, handling an error).",
    },
    assessment: {
      rationale:
        "Check comprehension of how APIs enable communication between systems.",
      assessment_format:
        "Short quiz matching API terms (endpoint, payload, header) to definitions.",
    },
    reflection: {
      rationale:
        "Encourage learners to think about how APIs connect to their prior job experience (inventory systems, scheduling, etc.).",
      assessment_format:
        "One-paragraph reflection describing a real-world process that could be improved with an API.",
    },
  },
];


// Mimic the shape of a react-query hook for easy future replacement.
export const useMockLessonList = () => {
  return {
    data: mockData,
    isLoading: false,
    error: null,
  };
};

