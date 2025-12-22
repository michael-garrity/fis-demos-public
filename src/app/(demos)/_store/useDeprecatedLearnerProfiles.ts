import { useQuery } from "@tanstack/react-query";
import { LearnerProfile } from "@/types"


const deprecatedLearnerProfiles = async (): Promise<LearnerProfile[]> => {
  console.warn(`
    The deprecated learner profile mocks were used. This page may be using
    the useDeprecatedLearnerProfiles hook directly, or through a deprecated
    component (e.g. src/components/learn-profiles/*). When feasibly, migrate
    to the useLearnerProfiles hook (or the src/lib/learner-profiles components)
  `)

  return [
    {
      id: "1",
      name: "Liam Chen",
      age: "25",
      readingLevel: "Intermediate",
      experience:
        "Has basic understanding of HTML/CSS but no JavaScript experience.",
      interests: ["Game Development", "Web Design", "AI Art"],
    },
    {
      id: "2",
      name: "Maya Singh",
      age: "40",
      readingLevel: "Advanced",
      experience:
        "Expert in education/training; proficient in tools like Excel, but new to coding/data analysis.",
      interests: [
        "Data Visualization",
        "Educational Technology",
        "Project Management",
      ],
    },
    {
      id: "3",
      name: "Chloe Davis",
      age: "17",
      readingLevel: "Fluent",
      experience:
        "Has participated in a few coding camps; understands basic Python syntax and logic.",
      interests: ["Robotics", "Space Exploration", "Cybersecurity"],
    }
  ];
};

/**
 * NOTE: this hook exists temporarily for backwards compatability. Use
 * `useLearnerProfiles` instead.
 */
export const useDeprecatedLearnerProfiles = () => {
  return useQuery({
    queryKey: ["deprecatedLearnerProfiles"],
    queryFn: deprecatedLearnerProfiles,
  });
};
