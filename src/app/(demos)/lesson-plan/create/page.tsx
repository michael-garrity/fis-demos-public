"use client";

import { useLearnerProfiles } from "@demos/_store/useLearnerProfiles";
import { LessonPlanRecord } from "@/types/demos/lesson-plan";
import { useCreateLessonPlan } from "../_store/useLessonPlanCreate";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Spinner,
} from "@heroui/react";
import { BookOpen, User, Send } from "lucide-react";

interface FormData {
  id: string;
  sourceMaterialTitle: string;
  sourceMaterialContent: string;
  learnerProfileId: string;
  introductionMarkdown: string;
  contextMarkdown: string;
  exampleMarkdown: string;
  practiceMarkdown: string;
  assessmentMarkdown: string;
  reflectionMarkdown: string;
}

export default function LessonPlanForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    id: "3",
    sourceMaterialTitle: "",
    sourceMaterialContent: "",
    learnerProfileId: "",
    introductionMarkdown: "",
    contextMarkdown: "",
    exampleMarkdown: "",
    practiceMarkdown: "",
    assessmentMarkdown: "",
    reflectionMarkdown: "",
  });

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { mutate: createLesson, isPending: isSubmitting } =
    useCreateLessonPlan();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simplified handler for select (used for learnerProfileId)
  const handleSelectChange = (name: string, value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value?.toString() ?? "",
    }));
  };

  const isFormValid = useMemo(() => {
    const {
      sourceMaterialTitle,
      sourceMaterialContent,
      learnerProfileId,
      introductionMarkdown,
      contextMarkdown,
      exampleMarkdown,
      practiceMarkdown,
      assessmentMarkdown,
      reflectionMarkdown,
    } = formData;
    return (
      sourceMaterialTitle.trim().length > 0 &&
      sourceMaterialContent.trim().length > 0 &&
      learnerProfileId !== "" &&
      introductionMarkdown.trim().length > 0 &&
      contextMarkdown.trim().length > 0 &&
      exampleMarkdown.trim().length > 0 &&
      practiceMarkdown.trim().length > 0 &&
      assessmentMarkdown.trim().length > 0 &&
      reflectionMarkdown.trim().length > 0
    );
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const learnerProfile = profiles?.find(
      (p) => p.id === formData.learnerProfileId
    );
    if (isFormValid && !isSubmitting && learnerProfile) {
      // Structure data for API submission - transform learnerProfile to match LessonPlanRecord structure
      const learnerProfileData: LessonPlanRecord["creation_meta"]["learner_profile"] =
        {
          id: learnerProfile.id,
          label: learnerProfile.label,
          age: Number(learnerProfile.age),
          reading_level: Number(learnerProfile.readingLevel) || 0,
          experience: learnerProfile.experience ?? "",
          interests: learnerProfile.interests,
        };

      const submissionData: Partial<LessonPlanRecord> = {
        id: formData.id,
        creation_meta: {
          learner_profile: learnerProfileData,
          source_material: {
            title: formData.sourceMaterialTitle,
            content: formData.sourceMaterialContent,
          },
        },
        introduction: formData.introductionMarkdown,
        context: formData.contextMarkdown,
        example: formData.exampleMarkdown,
        practice: formData.practiceMarkdown,
        assessment: formData.assessmentMarkdown,
        reflection: formData.reflectionMarkdown,
      };

      createLesson(submissionData as LessonPlanRecord);

      router.push(`/lesson-plan/${submissionData.id}/edit`);
    }
  };

  return (
    // <div className="p-8 max-w-4xl mx-auto">
    <div className="p-8 w-full mx-auto" style={{ maxWidth: "600px" }}>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Create New Lesson Plan
      </h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SOURCE MATERIAL SECTION */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Source Material
            </h2>
            <Input
              data-testid="lesson-plan-create-source-material-title"
              label="Source Material Title"
              name="sourceMaterialTitle"
              placeholder="e.g., Python Programming Basics Chapter 3"
              value={formData.sourceMaterialTitle}
              onChange={handleChange}
              labelPlacement="outside"
              startContent={<BookOpen size={18} />}
              fullWidth
              required
            />
            <Textarea
              data-testid="lesson-plan-create-source-material-content"
              label="Source Material Content"
              name="sourceMaterialContent"
              placeholder="Paste or type the source material content that will be used to generate the lesson plan."
              value={formData.sourceMaterialContent}
              onChange={handleChange}
              labelPlacement="outside"
              fullWidth
              required
              rows={6}
            />
          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-200"></div>

          {/* LEARNER PROFILE SECTION */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Learner Profile
            </h2>
            <Select
              data-testid="lesson-plan-create-learner-profile"
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
          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-200"></div>

          {/* LESSON CONTENT SECTION */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Lesson Content
            </h2>
            <div className="space-y-5">
              <Textarea
                data-testid="lesson-plan-create-introduction"
                label="Introduction"
                name="introductionMarkdown"
                placeholder="Enter the introduction content in markdown format."
                value={formData.introductionMarkdown}
                onChange={handleChange}
                labelPlacement="outside"
                fullWidth
                required
                rows={4}
              />

              <Textarea
                data-testid="lesson-plan-create-context"
                label="Context"
                name="contextMarkdown"
                placeholder="Enter the context content in markdown format."
                value={formData.contextMarkdown}
                onChange={handleChange}
                labelPlacement="outside"
                fullWidth
                required
                rows={4}
              />

              <Textarea
                data-testid="lesson-plan-create-example"
                label="Example"
                name="exampleMarkdown"
                placeholder="Enter the example content in markdown format."
                value={formData.exampleMarkdown}
                onChange={handleChange}
                labelPlacement="outside"
                fullWidth
                required
                rows={4}
              />

              <Textarea
                data-testid="lesson-plan-create-practice"
                label="Practice"
                name="practiceMarkdown"
                placeholder="Enter the practice content in markdown format."
                value={formData.practiceMarkdown}
                onChange={handleChange}
                labelPlacement="outside"
                fullWidth
                required
                rows={4}
              />

              <Textarea
                data-testid="lesson-plan-create-assessment"
                label="Assessment"
                name="assessmentMarkdown"
                placeholder="Enter the assessment content in markdown format."
                value={formData.assessmentMarkdown}
                onChange={handleChange}
                labelPlacement="outside"
                fullWidth
                required
                rows={4}
              />

              <Textarea
                data-testid="lesson-plan-create-reflection"
                label="Reflection"
                name="reflectionMarkdown"
                placeholder="Enter the reflection content in markdown format."
                value={formData.reflectionMarkdown}
                onChange={handleChange}
                labelPlacement="outside"
                fullWidth
                required
                rows={4}
              />
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-200 pt-2"></div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <Button
              data-testid="lesson-plan-create-submit"
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
              {isSubmitting ? "Creating Lesson Plan..." : "Create Lesson Plan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
