import { NextResponse } from "next/server";

const mockCourseOutline = {
  id: "4",
  title: "Fundamentals of Software Testing and QA",
  description:
    "To enable learners to design, implement, and execute comprehensive test suites (unit, integration, end-to-end) for modern web applications.",
  durationValue: 90,
  durationUnit: "minutes",
  learnerProfileId: "1",
};

export async function POST() {
  // Simulate a network delay (optional)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(mockCourseOutline, { status: 200 });
}
