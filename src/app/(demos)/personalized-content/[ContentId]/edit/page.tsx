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
import PersonalizedContentSkeleton from "../_components/PersonalizedContentSkeleton";
import { LearnerProfileChip } from "@/lib/learner-profiles";
import { useEditPersonalizedContent } from "../_hooks/useEditPersonalizedContent";
import { useParams, useRouter } from "next/navigation";
import MarkdownPreview from "@/app/(demos)/_components/MarkdownPreview";

export default function PeronsalizedContentEditView() {
  const router = useRouter();
  const { contentId: id } = useParams<{ contentId: string }>();

  const {
    cancelChanges,
    personalizedContent,
    error,
    handleChange,
    isFetching,
    isModified,
    isPending,
    isSuccess,
    saveChanges,
  } = useEditPersonalizedContent(id);

  useEffect(() => {
    if (isSuccess && id) {
      addToast({
        title: <p className="text-xl text-bold">Success!</p>,
        description: "Personalized Content Saved",
        color: "success",
        shouldShowTimeoutProgress: true,
      });
      router.push(`/personalized-content/${id}`);
    }
  }, [isSuccess, id, router]);

  // --- Conditional Rendering ---

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center text-red-600">
        <p>Error loading content: {error.message}</p>
      </div>
    );
  }

  const isFetchingData: boolean = isFetching && !isPending;

  // --- MAIN RENDER ---
  return (
    <div className="max-w-5xl mx-auto font-inter min-h-screen w-full">
      {isFetchingData && !personalizedContent?.title ? (
        <PersonalizedContentSkeleton />
      ) : (
        <Card className="shadow-xl border-t-4 border-indigo-600 mb-8 rounded-xl">
          <CardHeader className="flex flex-col items-start w-full">
            {/* Editable Title - using HeroUI Input */}
            <Input
              label="Content Title"
              labelPlacement="outside"
              fullWidth
              size="lg"
              className="text-3xl font-extrabold"
              classNames={{
                input: "text-3xl font-extrabold text-gray-900 leading-tight",
              }}
              value={personalizedContent?.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("title", e.target.value)
              }
            />
          </CardHeader>
          <CardBody className="pt-0">
            {/* Editable Description - using HeroUI Textarea */}
            <Textarea
              label="Content Description"
              labelPlacement="outside"
              fullWidth
              rows={3}
              className="w-full text-lg text-gray-600"
              value={personalizedContent?.description}
              onChange={(e: ChangeEvent<HTMLElement>) =>
                handleChange(
                  "description",
                  (e.target as HTMLTextAreaElement).value
                )
              }
            />
            <div className="border-t pt-6 mt-6">
                {/* Editable Content Markdown */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Personalized Content Breakdown
                </h2>

              <Card className="shadow-sm h-full">
                <CardBody className="space-y-3 pt-2 border-t border-gray-100">  
                  <div>
                    <MarkdownPreview
                      label="Personalized Content"
                      value={personalizedContent?.content}
                      onChange={(value) => handleChange("content", value)}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
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

      {/* Save / Cancel Button Bar */}
      <div className="flex justify-end gap-3 mt-8 p-4 bg-white rounded-xl shadow-lg sticky bottom-4 z-10">
        <Button
          color="danger"
          variant="light"
          onPress={cancelChanges}
          isDisabled={!isModified || isPending}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onPress={saveChanges}
          isDisabled={!isModified || isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
