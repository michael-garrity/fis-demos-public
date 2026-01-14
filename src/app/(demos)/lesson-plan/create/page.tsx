"use client";

import { useLearnerProfiles } from "@demos/_store/useLearnerProfiles";
import { LessonPlanPreSave, LessonPlanRecord } from "@/types/demos/lesson-plan";
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
import { useLessonPlanGenerate } from "../_store/useLessonPlanGenerate";
import { useLessonPlanSave } from "../_store/useLessonPlanSave";
import { useSourceMaterials } from "@/features/source-materials";

interface FormData {
  id: string;
  sourceMaterialId: string;
  sourceMaterialTitle: string;
  sourceMaterialContent: string;
  learnerProfileId: string;
}

export default function LessonPlanForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    id: "3",
    sourceMaterialId: "",
    sourceMaterialTitle: "",
    sourceMaterialContent: "",
    learnerProfileId: "",
  });

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { data: sourceMaterials, isLoading: sourcesLoading } =
    useSourceMaterials();

  const { mutateAsync: generateLessonPlan, isPending: isSubmitting } =
    useLessonPlanGenerate();
  const { mutateAsync: saveLessonPlan } = useLessonPlanSave();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for both learnerprofile and sourcematerials
  const handleSelectChange = (name: string, value: string | undefined) => {
    const selectedValue = value?.toString() ?? "";

    // if custom, allow user to put in their own source material
    if (name === "sourceMaterialId") {
      if (selectedValue === "custom") {
        setFormData((prev) => ({
          ...prev,
          sourceMaterialId: "custom",
          sourceMaterialTitle: "",
          sourceMaterialContent: "",
        }));
        return;
      }

      const selectedMaterial = sourceMaterials?.find(
        (m) => m.id.toString() === selectedValue
      );

      if (selectedMaterial) {
        setFormData((prev) => ({
          ...prev,
          sourceMaterialId: selectedValue,
          sourceMaterialTitle: selectedMaterial.title,
          sourceMaterialContent: selectedMaterial.markdown.trim(),
        }));
        return;
      }
    }

    // Default behavior (learnerProfileId and future selects)
    setFormData((prev) => ({
      ...prev,
      [name]: selectedValue,
    }));
  };

  const isFormValid = useMemo(() => {
    const { sourceMaterialTitle, sourceMaterialContent, learnerProfileId } =
      formData;
    return (
      sourceMaterialTitle.trim().length > 0 &&
      sourceMaterialContent.trim().length > 0 &&
      learnerProfileId !== ""
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
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

      const submissionData = {
        creation_meta: {
          learner_profile: learnerProfileData,
          source_material: {
            title: formData.sourceMaterialTitle,
            content: formData.sourceMaterialContent,
          },
        },
      };

      // generate instead of creating course manually
      const generatedLessonPlan = await generateLessonPlan(submissionData);

      const payload: LessonPlanPreSave = {
        ...generatedLessonPlan,
        creation_meta: submissionData.creation_meta,
      };

      const savedLessonPlan = await saveLessonPlan(payload);

      router.push(`/lesson-plan/${savedLessonPlan.id}/edit`);
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
            <Select
              data-testid="lesson-plan-select-source-material"
              label="Source Material"
              labelPlacement="outside"
              selectedKeys={[formData.sourceMaterialId]}
              placeholder={
                sourcesLoading
                  ? "Loading source materials..."
                  : "Select source material"
              }
              onSelectionChange={(key) =>
                handleSelectChange("sourceMaterialId", key.currentKey)
              }
              isDisabled={sourcesLoading}
              fullWidth
            >
              <>
                <SelectItem key="custom">Custom</SelectItem>

                {sourceMaterials?.map((material) => (
                  <SelectItem key={material.id.toString()}>
                    {material.title}
                  </SelectItem>
                ))}
              </>
            </Select>
            {formData.sourceMaterialId === "custom" && (
              <>
                <Input
                  data-testid="lesson-plan-create-source-material-title"
                  className="pt-2"
                  label="Title"
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
                  label="Source Material"
                  name="sourceMaterialContent"
                  placeholder="Paste or type the source material content that will be used to generate the lesson plan."
                  value={formData.sourceMaterialContent}
                  onChange={handleChange}
                  labelPlacement="outside"
                  fullWidth
                  required
                  rows={6}
                />
              </>
            )}
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
