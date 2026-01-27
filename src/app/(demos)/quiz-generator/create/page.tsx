"use client";

import { useLearnerProfiles } from "@demos/_store/useLearnerProfiles";
import { QuizFormState, QuizFormSubmission, SourceMaterial } from "@/types";
import {
  Card,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Spinner,
} from "@heroui/react";
import { ListOrdered, User, Send } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useSaveQuiz, useGenerateQuizQuestions } from "../_store";
import { useRouter } from "next/navigation";
import { SourceSelector } from "../../_components/SourceSelector";
import { ViewSourceModal } from "../../_components/ViewSourceModal";
import DemoNavigationPanel from "../../_components/DemoNavigationPanel";

export default function QuizForm() {
  const [formData, setFormData] = useState<QuizFormState>({
    title: "",
    description: "",
    numberOfQuestions: "1",
    learnerProfileId: "",
    sourceMaterial: {
      title: "",
      markdown: ""
    },
    customization: "",
  });

  const [isViewSourceModalOpen, setIsViewSourceModalOpen] = useState(false);

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { mutateAsync: saveQuiz, isPending: isSubmitting } = useSaveQuiz();
  const { mutateAsync: generateQuizQuestions, isPending: isGenerating } =
    useGenerateQuizQuestions();

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simplified handler for select (learnerProfileId)
  const handleSelectChange = (name: string, value: unknown | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  const isFormValid = useMemo(() => {
    const {
      title,
      description,
      numberOfQuestions,
      learnerProfileId,
      sourceMaterial,
    } = formData;
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      !isNaN(Number(numberOfQuestions)) &&
      Number(numberOfQuestions) > 0 &&
      // Check that durationValue is a positive number
      learnerProfileId !== "" &&
      sourceMaterial.title.trim().length > 0 &&
      sourceMaterial.markdown.trim().length > 0
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isSubmitting) {
      const learnerProfile = profiles?.find(
        (p) => p.id === formData.learnerProfileId
      );

      const sourceMaterial: SourceMaterial = formData.sourceMaterial

      if (learnerProfile === undefined) return;
      if (sourceMaterial === undefined) return;

      const questions = await generateQuizQuestions({
        title: formData.title,
        description: formData.description,
        learnerProfile,
        sourceMaterial,
        customization: formData.customization,
        numberOfQuestions: Number(formData.numberOfQuestions),
      });

      // Structure data for API submission
      const submissionData: QuizFormSubmission = {
        title: formData.title,
        description: formData.description,
        creation_meta: {
          learner_profile: learnerProfile,
          source_material: sourceMaterial,
          customization: formData.customization,
        } as Record<string, unknown>,
        questions: questions,
      };

      const savedQuiz = await saveQuiz(submissionData);

      router.push(`/quiz-generator/${savedQuiz.id}/edit`);
    }
  };

  return (
    <>
      <DemoNavigationPanel backRoute="/quiz-generator" />
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Create New Quiz
        </h1>
        <Card className="p-6 space-y-6 min-w-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. TITLE INPUT */}
            <Input
              data-testid="quiz-create-title"
              label="Quiz Title"
              name="title"
              placeholder="e.g. Data Analysis using Python"
              value={formData.title}
              onChange={handleChange}
              labelPlacement="outside"
              fullWidth
              required
            />

            {/* 2. DESCRIPTION TEXTAREA */}
            <Textarea
              data-testid="quiz-create-description"
              label="Quiz Description"
              name="description"
              placeholder="A brief summary of the quiz and what it'll ask."
              value={formData.description}
              onChange={handleChange}
              labelPlacement="outside"
              fullWidth
              required
              rows={4}
            />

          <SourceSelector
            onSourceChange={(source) => 
              handleSelectChange("sourceMaterial", source)
            }
            onViewSource={() => setIsViewSourceModalOpen(true)}
          />

            {/* 5. LEARNER PROFILE SELECTION */}
            <div className="flex gap-4">
              <Select
                data-testid="quiz-create-learner-profile"
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
                  {profiles?.map((profile, i) => (
                    <SelectItem
                      data-testid={`quiz-create-profile-${i}`}
                      key={profile.id.toString()}
                    >
                      {profile.label}
                    </SelectItem>
                  ))}
                </>
              </Select>
            </div>

            {/* 3. NUMBER OF QUESTIONS */}
            <div className="flex gap-4">
              <Input
                label="Number of Questions"
                name="numberOfQuestions"
                type="number"
                startContent={<ListOrdered size={18} />}
                placeholder="e.g., 10"
                value={String(formData.numberOfQuestions)}
                onChange={handleChange}
                labelPlacement="outside"
                min={1}
                max={20}
                required
              />
            </div>

            {/* 5. CUSTOMIZATION TEXTAREA */}
            <Textarea
              label="Customization"
              name="customization"
              placeholder="What else would you like us to know about what should be on the quiz or about the learner?"
              value={formData.customization}
              onChange={handleChange}
              labelPlacement="outside"
              fullWidth
              rows={4}

            data-testid="quiz-create-customization"
            />

            {/* SUBMIT BUTTON */}
            <Button
              data-testid="quiz-create-submit"
              type="submit"
              color="primary"
              fullWidth
              isDisabled={!isFormValid || isGenerating || isSubmitting}
              startContent={
                isGenerating || isSubmitting ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <Send size={18} />
                )
              }
              >
              {isGenerating
                ? "Generating Questions..."
                : isSubmitting
                ? "Saving Quiz..."
                : "Create Quiz"}
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
