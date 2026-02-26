"use client";

import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { Users } from "lucide-react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import DemoNavigationPanel from "../../_components/DemoNavigationPanel";
import { LearnerProfileChip } from "@/lib/learner-profiles";
import { useLesson } from "../_store";

export default function LessonViewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: lesson, isLoading, error } = useLesson(id);

  if (error) {
    return (
      <>
        <DemoNavigationPanel backRoute="/lessons" />
        <div className="p-8 max-w-5xl mx-auto text-center text-red-600">
          <p>Error loading lesson: {error.message}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DemoNavigationPanel backRoute="/lessons" />
      <div className="max-w-5xl mx-auto font-inter min-h-screen w-full">
        {isLoading || !lesson ? (
          <Card className="shadow-xl border-t-4 border-indigo-600 mb-8 rounded-xl">
            <CardHeader>
              <div className="space-y-2 w-full">
                <Skeleton className="h-9 w-3/4 rounded-lg" />
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="border-b pb-4 mb-6">
                <Skeleton className="h-8 w-64 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-11/12 rounded-lg" />
                <Skeleton className="h-4 w-10/12 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-9/12 rounded-lg" />
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card className="shadow-xl border-t-4 border-indigo-600 mb-8 rounded-xl">
              <CardHeader>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                  {lesson.title}
                </h1>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="flex flex-wrap gap-4">
                  <LearnerProfileChip
                    learnerProfile={lesson.learnerProfile}
                    size="md"
                    variant="faded"
                    color="default"
                    startContent={<Users size={18} />}
                  >
                    Target Profile:{" "}
                    <span className="font-semibold ml-1">
                      {lesson.learnerProfile?.label}
                    </span>
                  </LearnerProfileChip>
                </div>
              </CardBody>
            </Card>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Structural Lesson Analysis
            </h2>

            <Card className="shadow-lg rounded-xl">
              <CardBody className="divide-y-2 divide-indigo-100">
                {lesson.lessonSections.map((section, index) => (
                  <section
                    key={section.key}
                    id={`section-${index}`}
                    className="py-10 scroll-mt-24"
                  >
                    <div className="border-l-4 border-indigo-600 pl-4 mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {section.title}
                      </h3>
                    </div>

                    <div className="prose prose-base max-w-none prose-headings:font-bold prose-h2:mt-6 prose-h3:mt-4">
                      {section.markdown.trim() ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {section.markdown}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-gray-400 italic">
                          No content provided for this section.
                        </p>
                      )}
                    </div>
                  </section>
                ))}
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
