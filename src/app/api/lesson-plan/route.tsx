import { NextResponse } from "next/server";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";

// --- MOCK COURSE OUTLINE DATA ---

const mockLessonPlans: LessonPlanRecord[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals for the Web",
    description:
      "A beginner-friendly course covering variables, control flow, DOM manipulation, and modern ES6 features.",
    durationValue: 45,
    durationUnit: "minutes",
    learnerProfileId: "1", // Assigned Liam
  },
  {
    id: "2",
    title: "Creating a Wayland Compositor in Zig",
    description:
      "Create a Wayland Compositor from scratch using the Zig programming language, without any major library dependencies.",
    durationValue: 100,
    durationUnit: "hours",
    learnerProfileId: "2", // Assigned Maya,
  },
  {
    id: "3",
    title: "Building Secure APIs with Node.js",
    description:
      "Intermediate course focusing on server-side security, authentication (JWT), and protecting web applications from common attacks.",
    durationValue: 1,
    durationUnit: "hours",
    learnerProfileId: "3", // Assigned Chloe
  },
];

/**
 * Handles GET requests for the course outline records.
 */
export async function GET() {
  // Simulate a network delay (optional)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(mockLessonPlans, { status: 200 });
}
