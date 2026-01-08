"use client";

import { useState, useMemo } from "react";
import {
  Users,
  BookOpen,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  Switch,
  Tooltip
} from "@heroui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PersonalizedContentSkeleton from "./_components/PersonalizedContentSkeleton";
import { LearnerProfileChip } from "@/lib/learner-profiles";
import { usePersonalizedContent } from "../_store";
import { useSourceMaterials } from "@/features/source-materials";
import { useParams } from "next/navigation";

export default function PersonalizedContentTeacherView() {
  const { contentId: id } = useParams<{ contentId: string }>();
  const { data: personalizedContent, isFetching, error } = usePersonalizedContent(id);

  const sourceLessonId = personalizedContent?.creationMeta.source_lesson_id;

  const { 
    data: sourceMaterials,
    isLoading: isSourceMaterialLoading,
    error: sourceMaterialError,
  } = useSourceMaterials();

  const sourceMaterial = useMemo(() => {
  if (!sourceLessonId || !sourceMaterials) return null;

  return sourceMaterials.find(
    (lesson) => lesson.id.toString() === sourceLessonId.toString()
  );
}, [sourceLessonId, sourceMaterials]); 

  const [showSourceMaterial, setShowSourceMaterial] = useState(false);

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center text-red-600">
        <p>Error loading content: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto font-inter min-h-screen w-full">
      {isFetching && !personalizedContent?.title ? (
        <PersonalizedContentSkeleton />
      ) : (
        <Card className="shadow-xl border-t-4 border-indigo-600 mb-8 rounded-xl">
          <CardHeader>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {personalizedContent?.title}
            </h1>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-lg text-gray-600 border-b pb-4 mb-4">
              {personalizedContent?.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <LearnerProfileChip
                learnerProfile={personalizedContent?.learnerProfile ?? null}
                size="md"
                variant="faded"
                color="default"
                startContent={<Users className="w-4 h-4" />}
              >
                Target Profile:{" "}
                <span className="font-semibold ml-1">
                  {personalizedContent?.learnerProfile?.label}
                </span>
              </LearnerProfileChip>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Header + Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Personalized Content View
        </h2>

        <div className="flex flex-col items-end gap-1">
  <Tooltip
    content={
      sourceLessonId
        ? "Toggle source lesson view"
        : "No source lesson linked to this content"
    }
  >
    <Switch
      size="md"
      isSelected={showSourceMaterial}
      onValueChange={setShowSourceMaterial}
      isDisabled={!sourceLessonId}
    >
      View Source Material
    </Switch>
  </Tooltip>

  {!sourceLessonId && (
    <span className="text-xs text-gray-500">
      No source material was found for this content.
    </span>
  )}
</div>

      </div>

      {/* Content Layout */}
      <div
        className={`grid gap-6 ${
          showSourceMaterial ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Personalized Content */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2 text-gray-700">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-semibold">
                What the Student Will See
              </h3>
            </div>
          </CardHeader>

          <CardBody className="bg-gray-50">
            {personalizedContent?.content ? (
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {personalizedContent.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="italic text-gray-400">
                No personalized content has been added yet.
              </p>
            )}
          </CardBody>
        </Card>

        {/* Source Material */}
        {showSourceMaterial && (
          <Card className="shadow-lg rounded-xl">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold">
                  Source Lesson Material
                </h3>
              </div>
            </CardHeader>

            <CardBody className="bg-gray-50">
              {isSourceMaterialLoading ? (
                <p className="text-gray-500 italic">
                  Loading source material…
                </p>
              ) : sourceMaterialError ? (
                <p className="text-red-600">
                  Failed to load source material.
                </p>
              ) : sourceMaterial?.markdown ? (
                <div className="prose max-w-none opacity-90">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {sourceMaterial.markdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="italic text-gray-400">
                  No source material found.
                </p>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
