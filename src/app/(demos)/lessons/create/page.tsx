"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
  addToast,
} from "@heroui/react";
import { Send, User } from "lucide-react";

import { SourceMaterial } from "@/types";
import DemoNavigationPanel from "../../_components/DemoNavigationPanel";
import { SourceSelector } from "../../_components/SourceSelector";
import { ViewSourceModal } from "../../_components/ViewSourceModal";
import { useLearnerProfiles } from "../../_store/useLearnerProfiles";
import { useGenerateLesson } from "../_store";
import { LessonGenerateRequest } from "../_services";

interface FormData {
  title: string;
  learnerProfileId: string;
  customization: string;
  sourceMaterial: SourceMaterial;
}

export default function CreateLessonPage() {
  const router = useRouter();
  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { mutateAsync: generateLesson, isPending: isSubmitting } =
    useGenerateLesson();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    learnerProfileId: "",
    customization: "",
    sourceMaterial: {
      title: "",
      markdown: "",
    },
  });
  const [isViewSourceModalOpen, setIsViewSourceModalOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = useMemo(() => {
    const { title, sourceMaterial, learnerProfileId } = formData;
    return (
      title.trim().length > 0 &&
      sourceMaterial.title.trim().length > 0 &&
      sourceMaterial.markdown.trim().length > 0 &&
      learnerProfileId !== ""
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    const learnerProfile = profiles?.find(
      (p) => p.id === formData.learnerProfileId,
    );
    if (!learnerProfile) {
      addToast({
        title: <p className="text-xl font-bold">Error</p>,
        description: "Select a learner profile before generating a lesson.",
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
      return;
    }

    const payload: LessonGenerateRequest = {
      title: formData.title,
      customization: formData.customization,
      creation_meta: {
        learner_profile: {
          label: learnerProfile.label,
          age: Number(learnerProfile.age),
          reading_level: Number(learnerProfile.readingLevel) || 0,
          experience: learnerProfile.experience ?? "",
          interests: learnerProfile.interests,
        },
        source_material: {
          title: formData.sourceMaterial.title,
          content: formData.sourceMaterial.markdown,
        },
      },
    };

    try {
      const lesson = await generateLesson(payload);
      addToast({
        title: <p className="text-xl font-bold">Generated!</p>,
        description: (
          <p>
            Lesson <span className="font-bold">{lesson.title}</span> is ready.
          </p>
        ),
        color: "success",
        shouldShowTimeoutProgress: true,
      });
      router.push(`/lessons/${lesson.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate lesson.";
      addToast({
        title: <p className="text-xl font-bold">Error</p>,
        description: message,
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
    }
  };

  return (
    <>
      <DemoNavigationPanel backRoute="/lessons" />
      <div className="p-8 max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Create New Lesson
        </h1>
        <Card className="p-6 space-y-6 w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              data-testid="lesson-create-title"
              label="Lesson Title"
              name="title"
              placeholder="e.g., Introduction to Atoms"
              value={formData.title}
              onChange={handleChange}
              labelPlacement="outside"
              fullWidth
              required
            />

            <div className="flex flex-col gap-2 mb-12">
              <SourceSelector
                onSourceChange={(value) =>
                  setFormData((prev) => ({ ...prev, sourceMaterial: value }))
                }
                onViewSource={() => setIsViewSourceModalOpen(true)}
              />
            </div>

            <Select
              data-testid="lesson-create-learner-profile"
              label="Target Learner Profile"
              name="learnerProfileId"
              placeholder={
                profilesLoading
                  ? "Loading profiles..."
                  : "Select existing profile"
              }
              labelPlacement="outside"
              onSelectionChange={(key) =>
                setFormData((prev) => ({
                  ...prev,
                  learnerProfileId: key.currentKey ?? "",
                }))
              }
              startContent={<User size={18} />}
              isDisabled={profilesLoading}
              fullWidth
              required
            >
              <>
                {profiles?.map((profile) => (
                  <SelectItem key={profile.id.toString()}>
                    {profile.label}
                  </SelectItem>
                ))}
              </>
            </Select>

            <Textarea
              data-testid="lesson-create-customization"
              label="Customization Notes"
              name="customization"
              placeholder="Optional: add guidance for tone, depth, or examples."
              value={formData.customization}
              onChange={handleChange}
              labelPlacement="outside"
              fullWidth
              rows={4}
            />

            <Button
              data-testid="lesson-create-submit"
              type="submit"
              color="primary"
              fullWidth
              isDisabled={!isFormValid || isSubmitting}
              startContent={
                isSubmitting ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <Send size={18} />
                )
              }
            >
              {isSubmitting ? "Generating Lesson..." : "Generate Lesson"}
            </Button>
          </form>
        </Card>

        <ViewSourceModal
          isOpen={isViewSourceModalOpen}
          onClose={() => setIsViewSourceModalOpen(false)}
          title="Source Material"
          markdown={formData.sourceMaterial.markdown ?? ""}
        />
      </div>
    </>
  );
}
