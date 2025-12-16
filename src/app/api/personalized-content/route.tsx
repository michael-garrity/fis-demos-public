import { NextResponse } from "next/server";

const mockPersonalizedContent = {
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
    { name: "Warm-up Activity", content: "Identify steps in a familiar task." },
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
};

export async function POST() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(mockPersonalizedContent, { status: 200 });
}
