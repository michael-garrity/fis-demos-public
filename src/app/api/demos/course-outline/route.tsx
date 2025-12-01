import { NextResponse } from "next/server";
import { CourseOutlineRecord } from "@/types"; // Adjust path as needed

// --- MOCK COURSE OUTLINE DATA ---

const mockCourseOutlines: CourseOutlineRecord[] = [
  {
    id: 1,
    title: "JavaScript Fundamentals for the Web",
    description:
      "A beginner-friendly course covering variables, control flow, DOM manipulation, and modern ES6 features.",
    numberOfLessons: 12,
    timePerLesson: "45 minutes",
    learnerProfile: 1, // Assigned Liam
  },
  {
    id: 2,
    title: "Python & Pandas for Data Storytelling",
    description:
      "Learn to use Python (Pandas and Matplotlib) to analyze educational data and create compelling visualizations.",
    numberOfLessons: 8,
    timePerLesson: "75 minutes",
    learnerProfile: 2, // Assigned Maya
  },
  {
    id: 3,
    title: "Building Secure APIs with Node.js",
    description:
      "Intermediate course focusing on server-side security, authentication (JWT), and protecting web applications from common attacks.",
    numberOfLessons: 10,
    timePerLesson: "60 minutes",
    learnerProfile: 3, // Assigned Chloe
  },
];

/**
 * Handles GET requests for the course outline records.
 * Endpoint: /app/api/demos/course-outline
 */
export async function GET() {
  // Simulate a network delay (optional)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(mockCourseOutlines, { status: 200 });
}
