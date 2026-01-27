"use client";

import {
  useGeneratePersonalizedContent,
  useSavePersonalizedContent,
} from "@/features/personalized-content";
import { useLearnerProfiles } from "@demos/_store/useLearnerProfiles";
import { useSourceMaterials } from "@/features/source-materials";
import { PersonalizedContentFormState, PersonalizedContentGenerationRequest } from "@/types";
import { ViewSourceModal } from "../../_components/ViewSourceModal";
import { SourceSelector } from "../../_components/SourceSelector";
import {
  Card,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Spinner,
} from "@heroui/react";
import { User, Send } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DemoNavigationPanel from "../../_components/DemoNavigationPanel";

export default function PersonalizedContentForm() {
  const [formData, setFormData] = useState<PersonalizedContentFormState>({
    id: "1",
    title: "",
    learnerProfileId: "",
    customization: "",
    sourceMaterial: {
      title: "",
      markdown: "",
    },
  });

  const [isViewSourceModalOpen, setIsViewSourceModalOpen] = useState(false);

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { mutateAsync: createPersonalizedContent, isPending: isSubmitting } =
    useGeneratePersonalizedContent();

  const { mutateAsync: savePersonalizedContent } = useSavePersonalizedContent();

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simplified handler for select (used for learnerProfileId and sourceMaterial)
  const handleSelectChange = (name: string, value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value?.toString() ?? "",
    }));
  };

  const isFormValid = useMemo(() => {
    const {
      title,
      learnerProfileId,
      sourceMaterial,
    } = formData;

    return (
      title.trim().length > 0 &&
      sourceMaterial.title.trim().length > 0 &&
      sourceMaterial.markdown.trim().length > 0 &&
      learnerProfileId !== ""
    );
  }, [formData]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Find the full profile and sourceMaterial objects based on selected IDs
    const learnerProfile = profiles?.find(
      (p) => p.id === formData.learnerProfileId
    );

    if (!learnerProfile) {
      throw new Error("Learner profile is required to generate personalized content.");
    }

    const sourceMaterial = formData.sourceMaterial;

    if (isFormValid && !isSubmitting) {
      // Structure data for API submission
      const submissionData: PersonalizedContentGenerationRequest = {
        title: formData.title,
        sourceMaterial: sourceMaterial.markdown,
        learnerProfile: {
          label: learnerProfile.label,
          age: learnerProfile.age,
          reading_level: learnerProfile.readingLevel ?? 12,
          interests: learnerProfile.interests,
          experience: learnerProfile.experience?.trim() || "No prior experience specified.",
        },
        customization: formData.customization,
      };

      const createdPersonalizedContent = await createPersonalizedContent(
        submissionData
      );

      // save the title, profile, and source material from the form
      const savedPersonalizedContent = await savePersonalizedContent({
        content: createdPersonalizedContent.content,
        title: formData.title,
        description: createdPersonalizedContent.description,
        creation_meta: {
          learner_profile: learnerProfile,
          source_material: sourceMaterial,
        },
      });

      router.push(`/personalized-content/${savedPersonalizedContent.id}/edit`);
    }
  };

  return (
    <>
      <DemoNavigationPanel backRoute="/personalized-content" />
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Create New Personalized Content
        </h1>
        <Card className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. TITLE INPUT */}
            <Input
              data-testid="personalized-content-create-title"
              label="Personalized Content Title"
              name="title"
              placeholder="e.g., Python for Data Analysis"
              value={formData.title}
              onChange={handleChange}
              labelPlacement="outside"
              fullWidth
              required
            />

          <div className="flex flex-col gap-2 mb-12">
            {/* 2. SOURCE MATERIAL SELECTION */}
            <SourceSelector
              onSourceChange={(value) =>
                setFormData((prev) => ({ ...prev, sourceMaterial: value }))
              }
              onViewSource={() => setIsViewSourceModalOpen(true)}
            />
          </div>

            {/* 3. LEARNER PROFILE SELECTION */}
            <Select
              data-testid="personalized-content-create-learner-profile"
              label="Target Learner Profile"
              name="learnerProfileId"
              placeholder={
                profilesLoading
                  ? "Loading profiles..."
                  : "Select existing profile"
              }
              labelPlacement="outside"
              onSelectionChange={(key) =>
                handleSelectChange("learnerProfileId", key.currentKey)
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

            {/* 4. CUSTOMIZATION TEXTAREA */}
            <Textarea
              label="Customization"
              name="customization"
              placeholder="How else would you like to modify this content?"
              value={formData.customization}
              onChange={handleChange}
              labelPlacement="outside"
              fullWidth
              rows={4}
            />

            {/* SUBMIT BUTTON */}
            <Button
              data-testid="personalized-content-create-submit"
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
              {isSubmitting
                ? "Creating Personalized Content..."
                : "Create Personalized Content"}
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
