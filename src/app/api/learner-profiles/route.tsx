import { LearnerProfile } from "@/types";
import { NextResponse } from "next/server";

const LiamProfile: LearnerProfile = {
  id: "1",
  name: "Liam Chen",
  age: "25",
  readingLevel: "Intermediate",
  experience:
    "Has basic understanding of HTML/CSS but no JavaScript experience.",
  interests: ["Game Development", "Web Design", "AI Art"],
};

const MayaProfile: LearnerProfile = {
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
};

const ChloeProfile: LearnerProfile = {
  id: "3",
  name: "Chloe Davis",
  age: "17",
  readingLevel: "Fluent",
  experience:
    "Has participated in a few coding camps; understands basic Python syntax and logic.",
  interests: ["Robotics", "Space Exploration", "Cybersecurity"],
};
/**
 * Handles GET requests for the course outline records.
 */
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json([LiamProfile, MayaProfile, ChloeProfile], {
    status: 200,
  });
}
