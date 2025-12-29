"use client";

import { Users, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { LearnerProfile, LearnerProfileChip } from "@/lib/learner-profiles";
import { useLessonPlan } from "../_store/useLessonPlan";
import { useParams } from "next/navigation";

// convert these over
import LessonPlanSkeleton from "./_components/LessonPlanSkeleton";
import LessonSkeleton from "./_components/LessonSkeleton";

export default function LessonPlanTeacherView() {
  const { id: id } = useParams<{ id: string }>();
  const { data: lessonPlan, isFetching, error } = useLessonPlan(id);

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center text-red-600">
        <p>Error loading lesson: {error.message}</p>
      </div>
    );
  }

  const lessonSections = lessonPlan
    ? [
        {
          title: "Introduction",
          content: lessonPlan.introduction,
        },
        {
          title: "Context",
          content: lessonPlan.context,
        },
        {
          title: "Example",
          content: lessonPlan.example,
        },
        {
          title: "Practice",
          content: lessonPlan.practice,
        },
        {
          title: "Assessment",
          content: lessonPlan.assessment,
        },
        {
          title: "Reflection",
          content: lessonPlan.reflection,
        },
      ]
    : [];

  return (
    <div className="max-w-5xl mx-auto font-inter min-h-screen w-full">
      {isFetching && !lessonPlan?.creation_meta.source_material.title ? (
        <LessonPlanSkeleton />
      ) : (
        <Card className="shadow-xl border-t-4 border-indigo-600 mb-8 rounded-xl">
          <CardHeader>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {lessonPlan?.creation_meta.source_material.title}
            </h1>
          </CardHeader>
          {/* Find a better thing to put here? */}
          <CardBody className="pt-0">
            <p className="text-lg text-gray-600 border-b pb-4 mb-4">
              {lessonPlan?.creation_meta.source_material.content}
            </p>

            <div className="flex flex-wrap gap-4">
              <LearnerProfileChip
                learnerProfile={
                  lessonPlan?.creation_meta.learner_profile
                    ? ({
                        id: lessonPlan.creation_meta.learner_profile.id,
                        label: lessonPlan.creation_meta.learner_profile.label,
                        age: lessonPlan.creation_meta.learner_profile.age,
                        readingLevel:
                          lessonPlan.creation_meta.learner_profile
                            .reading_level,
                        experience:
                          lessonPlan.creation_meta.learner_profile.experience,
                        interests:
                          lessonPlan.creation_meta.learner_profile.interests,
                      } as LearnerProfile)
                    : null
                }
                size="md"
                variant="faded"
                color="default"
                startContent={<Users className="w-4 h-4" />}
              >
                Target Profile:{" "}
                <span className="font-semibold ml-1">
                  {lessonPlan?.creation_meta.learner_profile?.label}
                </span>
              </LearnerProfileChip>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Detailed Lesson Breakdown */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Structural Lesson Analysis
      </h2>

      {isFetching ? (
        <LessonSkeleton />
      ) : (
        <Accordion
          selectionMode="multiple"
          className="space-y-4"
          variant="splitted"
          defaultExpandedKeys={["0"]}
        >
          {lessonSections.map((section, index) => (
            <AccordionItem
              key={index.toString()}
              aria-label={section.title}
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-bold text-gray-800">
                    {section.title}
                  </span>
                </div>
              }
              indicator={({ isOpen }) =>
                isOpen ? (
                  <ChevronUp className="w-5 h-5 text-indigo-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )
              }
              classNames={{
                trigger: "py-5 cursor-pointer",
                heading: "text-xl",
                content: "p-4 pt-0",
                title: "text-lg font-semibold",
                base: "border-t-4 border-indigo-200",
              }}
            >
              {/* Make this prettier? */}
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm prose prose-sm">
                <p className="text-gray-700 text-sm">{section.content}</p>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
