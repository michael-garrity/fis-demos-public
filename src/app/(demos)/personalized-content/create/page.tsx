"use client";

import { useGeneratePersonalizedContent } from "../_store";
import { useSavePersonalizedContent } from "../_store";
import { useLearnerProfiles } from "@demos/_store/useLearnerProfiles";
import { useMockLessonList } from "../_store/useMockLessonList";
import { PersonalizedContentFormState } from "@/types";
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

export default function PersonalizedContentForm() {
  const [formData, setFormData] = useState<PersonalizedContentFormState>({
    id: "1",
    title: "",
    description: "",
    sourceLesson: "",
    learnerProfileId: "",
    customization: "",
  });

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { data: lessons, isLoading: lessonsLoading } = useMockLessonList();
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

  // Simplified handler for select (used for learnerProfileId and lesson)
  const handleSelectChange = (name: string, value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value?.toString() ?? "",
    }));
  };

  const isFormValid = useMemo(() => {
    const { title, description, learnerProfileId, sourceLesson } = formData;
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      sourceLesson !== "" &&
      learnerProfileId !== ""
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Find the full name for context in the mock
    const learnerProfile = profiles?.find(
      (p) => p.id === formData.learnerProfileId
    );
    if (isFormValid && !isSubmitting) {
      // Structure data for API submission
      const submissionData = {
        ...formData,
        learnerProfile,
      };

      const createdPersonalizedContent =
        await createPersonalizedContent(submissionData);

      const savedPersonalizedContent = await savePersonalizedContent({
        ...createdPersonalizedContent,
        creation_meta: { learner_profile: learnerProfile },
      });

      // Edit page to be implemented later
      router.push(`/personalized-content/${savedPersonalizedContent.id}/edit`);
    }
  };

  return (
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

          {/* 2. DESCRIPTION TEXTAREA */}
          <Textarea
            data-testid="personalized-content-create-description"
            label="Personalized Content Description"
            name="description"
            placeholder="A brief summary of the content and goals."
            value={formData.description}
            onChange={handleChange}
            labelPlacement="outside"
            fullWidth
            required
            rows={4}
          />

          <div className="flex gap-4 mb-12">
            {/* 3. Source Lesson Selection */}
            <Select
              data-testid="personalized-content-create-lesson"
              label="Source Lesson"
              name="sourceLesson"
              placeholder={
                lessonsLoading ? "Loading lessons..." : "Select existing lesson"
              }
              labelPlacement="outside"
              onSelectionChange={(key) =>
                handleSelectChange("sourceLesson", key.currentKey)
              }
              isDisabled={lessonsLoading}
              fullWidth
              required
            >
              <>
                {lessons?.map((lesson) => (
                  <SelectItem key={lesson.id.toString()}>
                    {lesson.title}
                  </SelectItem>
                ))}
              </>
            </Select>
          </div>

          {/* 4. LEARNER PROFILE SELECTION */}
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

          {/* 5. CUSTOMIZATION TEXTAREA */}
          <Textarea
            label="Customization"
            name="customization"
            placeholder="How else would you like to modify this lesson?"
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
    </div>
  );
}
