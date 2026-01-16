"use client";

import { ChangeEvent, useEffect } from "react";
import { Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  addToast,
} from "@heroui/react";
import { LearnerProfile, LearnerProfileChip } from "@/lib/learner-profiles";
import { useParams, useRouter } from "next/navigation";
import MarkdownPreview from "@/app/(demos)/_components/MarkdownPreview";
import {
  LessonPlanSkeleton,
  LessonSkeleton,
  useEditLessonPlanHook,
} from "@/features/lesson-planner";

export default function LessonPlanEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    lessonPlan,
    isFetching,
    isModified,
    isPending,
    isSuccess,
    error,
    cancelChanges,
    saveChanges,
    handleTopLevelChange,
    handleLessonSectionChange,
  } = useEditLessonPlanHook(id);

  // Show toast and redirect after save
  useEffect(() => {
    if (isSuccess && id) {
      addToast({
        title: <p className="text-xl font-bold">Success!</p>,
        description: "Lesson Plan Saved",
        color: "success",
        shouldShowTimeoutProgress: true,
      });
      router.push(`/lesson-planner/${id}`);
    }
  }, [isSuccess, id, router]);

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center text-red-600">
        <p>Error loading lesson: {error.message}</p>
      </div>
    );
  }

  const isFetchingData = isFetching && !isPending;

  const lessonSections = [
    { label: "Introduction", key: "introduction" },
    { label: "Context", key: "context" },
    { label: "Example", key: "example" },
    { label: "Practice", key: "practice" },
    { label: "Assessment", key: "assessment" },
    { label: "Reflection", key: "reflection" },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto font-inter min-h-screen w-full">
      {isFetchingData && !lessonPlan?.creation_meta.source_material.title ? (
        <LessonPlanSkeleton />
      ) : (
        <Card className="shadow-xl border-t-4 border-indigo-600 mb-8 rounded-xl">
          <CardHeader>
            {/* Editable Lesson Plan Title */}
            <Input
              label="Lesson Plan Title"
              labelPlacement="outside"
              fullWidth
              size="lg"
              value={lessonPlan?.creation_meta.source_material.title ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleTopLevelChange("sourceMaterialTitle", e.target.value)
              }
            />
          </CardHeader>

          <CardBody className="pt-0">
            {/* Editable Source Material Content */}
            <Textarea
              label="Source Material Content"
              labelPlacement="outside"
              fullWidth
              rows={3}
              value={lessonPlan?.creation_meta.source_material.content ?? ""}
              onChange={(e) =>
                handleTopLevelChange("sourceMaterialContent", e.target.value)
              }
            />

            {/* Learner Profile */}
            <div className="flex flex-wrap gap-4 mt-4">
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

      {/* Editable Lesson Sections */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Structural Lesson Analysis
      </h2>

      {isFetchingData ? (
        <LessonSkeleton />
      ) : (
        <div className="space-y-6">
          {lessonSections.map((section) => (
            <Card
              key={section.label}
              className="shadow-lg overflow-hidden border-t-4 border-indigo-200"
            >
              <CardHeader>
                <h3 className="text-lg font-semibold">{section.label}</h3>
              </CardHeader>
              <CardBody>
                <Card className="shadow-sm h-full">
                  <CardBody className="space-y-3 pt-2 border-t border-gray-100">
                    <div>
                      <MarkdownPreview
                        label={`${section.label} Content`}
                        value={lessonPlan?.[section.key] ?? ""}
                        onChange={(value) =>
                          handleLessonSectionChange(section.key, value)
                        }
                      />
                    </div>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Save / Cancel */}
      <div className="flex justify-end gap-3 mt-8 p-4 bg-white rounded-xl shadow-lg sticky bottom-4 z-10">
        <Button
          color="danger"
          variant="light"
          onPress={cancelChanges}
          isDisabled={!isModified || isPending}
        >
          Cancel
        </Button>
        <Button color="primary" onPress={saveChanges} isDisabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
