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
import SourceLessonSelector from "./_components/SourceLessonSelector";
import { useRouter } from "next/navigation";

const genericSourceMaterial = [{
  id: "0",
  title: "What is an atom?",
  content: "Atoms are the building blocks of matter. Everything around you — the air, water, your body — is made of atoms. Scientists discovered that atoms are incredibly small and consist of even smaller parts: **protons**, **neutrons**, and **electrons**.\n- **Protons** have a positive charge and sit in the center, called the **nucleus**.\n- **Neutrons** have no charge and are also in the nucleus.\n- **Electrons** have a negative charge and orbit around the nucleus.\nLearning about atoms helps us understand chemistry, biology, and physics.\nFor example, how water molecules form, how chemical reactions occur, and why different materials behave differently all depend on atoms."
}]

export default function QuizForm() {
  const [formData, setFormData] = useState<QuizFormState>({
    title: "",
    description: "",
    numberOfQuestions: "1",
    learnerProfileId: "",
    sourceMaterial: undefined,
    customization: "",
  });

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { mutateAsync: saveQuiz, isPending: isSubmitting } =
    useSaveQuiz();
  const {mutateAsync: generateQuizQuestions, isPending: isGenerating } =
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
      sourceMaterial
    } = formData;
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      !isNaN(Number(numberOfQuestions)) &&
      Number(numberOfQuestions) > 0 &&
      // Check that durationValue is a positive number
      learnerProfileId !== "" &&
      sourceMaterial !== undefined
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isSubmitting) {
      const learnerProfile = profiles?.find(
        (p) => p.id === formData.learnerProfileId
      );

      let sourceMaterial: SourceMaterial | undefined

      if (formData.sourceMaterial) {
        sourceMaterial = genericSourceMaterial.find(
          (source) => source.id === formData.sourceMaterial?.id
        )

        if (sourceMaterial === undefined) {
          sourceMaterial = {
            id: "custom",
            title: "Custom Lesson", 
            content: formData.sourceMaterial?.content ?? ""
          }
        }
      }

      if (learnerProfile === undefined) return;
      if (sourceMaterial === undefined) return;

      const questions = await generateQuizQuestions({
        title: formData.title,
        description: formData.description,
        learnerProfile,
        sourceMaterial,
        customization: formData.customization,
        numberOfQuestions: Number(formData.numberOfQuestions)
      })

      // Structure data for API submission
      const submissionData: QuizFormSubmission = {
        title: formData.title,
        description: formData.description,
        creation_meta: {
          learner_profile: learnerProfile,
          source_material: sourceMaterial,
          customization: formData.customization
        } as Record<string, unknown>,
        questions: questions
      }

      const savedQuiz = await saveQuiz(submissionData);

      router.push(`/quiz-generator/${savedQuiz.id}/edit`);
    }
  };

  return (
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

          <SourceLessonSelector 
            sources={genericSourceMaterial}
            value={formData.sourceMaterial}
            onChange={(source) =>
              handleSelectChange("sourceMaterial", source)
            }
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
          />

          {/* SUBMIT BUTTON */}
          <Button
            data-testid="quiz-create-submit"
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
            onSubmit={handleSubmit}
          >
            {
            isGenerating
              ? "Generating Questions..."
            : isSubmitting
              ? "Saving Quiz..."
              : "Create Quiz"
            }
          </Button>
        </form>
      </Card>
    </div>
  );
}
