import { CourseOutlineDetail, Lesson } from "@/types";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const updatedCourseOutline: CourseOutlineDetail = await req.json();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(updatedCourseOutline, { status: 200 });
}

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(MOCK_DETAIL, { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(id, { status: 200 });
}

const MOCK_LESSONS: Lesson[] = [
  {
    title: "Lesson 1: Introduction to Test Driven Development (TDD)",
    duration: "90 minutes",
    introduction: {
      rationale:
        "Introduce the TDD cycle (Red, Green, Refactor) and its benefits for code quality and design.",
      assessment_format: "Short answer quiz defining the three phases of TDD.",
    },
    context: {
      rationale:
        "Contrast TDD with traditional 'write code first, test later' approaches, highlighting risk reduction.",
      assessment_format:
        "Group discussion on real-world bug scenarios TDD could have prevented.",
    },
    example: {
      rationale:
        "Live coding demonstration: writing a failing unit test for a simple utility function, making it pass, and refactoring.",
      assessment_format: "Peer observation checklist during the live demo.",
    },
    activity: {
      rationale:
        "Learners will apply the Red/Green/Refactor cycle to implement a basic calculator's addition function.",
      assessment_format:
        "Code submission validated by successful test execution and coverage report.",
    },
    assessment: {
      rationale:
        "Evaluate the ability to apply the TDD methodology to new problems.",
      assessment_format:
        "Practical exam: implementing a small string manipulation utility using TDD.",
    },
    reflection: {
      rationale:
        "Reflect on the initial resistance and eventual benefits of the TDD workflow.",
      assessment_format:
        "Brief self-assessment on speed versus quality improvement using TDD.",
    },
  },
  {
    title: "Lesson 2: Hash Tables and Collision Resolution",
    duration: "90 minutes",
    introduction: {
      rationale:
        "Introduce the concept of hashing for near-constant time complexity lookups.",
      assessment_format: "Definition recall exercise using flashcards.",
    },
    context: {
      rationale:
        "Explore real-world applications of hash tables, such as database indexing and caching mechanisms.",
      assessment_format:
        "Group discussion on the scalability of hash tables vs. arrays for a large dictionary service.",
    },
    example: {
      rationale:
        "Illustrate two primary collision resolution techniques: separate chaining and open addressing (linear probing).",
      assessment_format:
        "Whiteboard activity tracing a key insertion with a collision.",
    },
    activity: {
      rationale:
        "Learners must write a custom hash function for a specialized object type (e.g., student ID + birthday).",
      assessment_format:
        "Code review and stress test against a provided dataset for collision rate.",
    },
    assessment: {
      rationale:
        "To determine mastery of hash table fundamental operations and theoretical limits.",
      assessment_format:
        "Code implementation challenge: implement the `get(key)` method using linear probing.",
    },
    reflection: {
      rationale:
        "Assess the learner's understanding of the trade-off between space and time in collision resolution strategies.",
      assessment_format:
        "One-paragraph summary comparing load factor impact on chaining vs. probing.",
    },
  },
  {
    title: "Lesson 3: Binary Search Trees (BSTs)",
    duration: "105 minutes",
    introduction: {
      rationale:
        "Define the properties of a Binary Search Tree and its primary advantages over sorted arrays.",
      assessment_format:
        "Quick diagramming exercise: draw a valid BST from a given set of numbers.",
    },
    context: {
      rationale:
        "Discuss the time complexity of insertion, deletion, and search in both balanced and unbalanced BSTs, emphasizing the worst-case scenario.",
      assessment_format:
        "Fill-in-the-blank worksheet on O(log n) average vs. O(n) worst-case complexity.",
    },
    example: {
      rationale:
        "Demonstrate in-order, pre-order, and post-order traversal algorithms using recursion.",
      assessment_format:
        "Class exercise: trace the output sequence for all three traversal types on a provided tree diagram.",
    },
    activity: {
      rationale:
        "Implement the `delete(value)` operation, focusing on the three cases (no child, one child, two children).",
      assessment_format:
        "Pair programming session followed by a challenge to handle node deletion while maintaining BST properties.",
    },
    assessment: {
      rationale:
        "To test understanding of BST structure and traversal utility.",
      assessment_format:
        "Written test: design a function to find the successor node in a BST.",
    },
    reflection: {
      rationale:
        "To evaluate the learner's understanding of the importance of balancing in practical tree applications.",
      assessment_format:
        "Short memo discussing why a standard BST is rarely used in high-performance systems without self-balancing features (e.g., AVL or Red-Black).",
    },
  },
];

// Mock data for a single CourseOutlineDetail
const MOCK_DETAIL: CourseOutlineDetail = {
  id: "1",
  title: "JavaScript Fundamentals for the Web",
  description:
    "A beginner-friendly course covering variables, control flow, DOM manipulation, and modern ES6 features.",
  numberOfLessons: 3,
  durationValue: 90,
  durationUnit: "minutes",
  learnerProfileId: "1",
  // The bulk of the data:
  lessons: MOCK_LESSONS,
  // Ensure all necessary CourseOutlineDetail fields are present
};
