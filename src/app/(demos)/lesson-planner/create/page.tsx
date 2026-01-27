"use client";

import { useLearnerProfiles } from "@demos/_store/useLearnerProfiles";
import { LessonPlanPreSave, LessonPlanRecord } from "@/types/demos/lesson-plan";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Select,
  SelectItem,
  Button,
  Spinner,
} from "@heroui/react";
import { User, Send } from "lucide-react";
import {
  useLessonPlanGenerate,
  useLessonPlanSave,
} from "@/features/lesson-planner";
import { SourceMaterial } from "@/types";
import { SourceSelector } from "../../_components/SourceSelector";
import { ViewSourceModal } from "../../_components/ViewSourceModal";
import DemoNavigationPanel from "../../_components/DemoNavigationPanel";

interface FormData {
  id: string;
  sourceMaterial: SourceMaterial;
  learnerProfileId: string;
}

export default function LessonPlanForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    id: "3",
    sourceMaterial: {
      title: "",
      markdown: "",
    },
    learnerProfileId: "",
  });

  const [isViewSourceModalOpen, setIsViewSourceModalOpen] = useState(false);

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();

  const { mutateAsync: generateLessonPlan, isPending: isSubmitting } =
    useLessonPlanGenerate();
  const { mutateAsync: saveLessonPlan } = useLessonPlanSave();

  // Handler for both learnerprofile and sourcematerials
  const handleSelectChange = <T extends keyof FormData>(name: T, value: FormData[T]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = useMemo(() => {
    const { sourceMaterial, learnerProfileId } =
      formData;
    return (
      sourceMaterial.title.trim().length > 0 &&
      sourceMaterial.markdown.trim().length > 0 &&
      learnerProfileId !== ""
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const learnerProfile = profiles?.find(
      (p) => p.id === formData.learnerProfileId
    );

    const sourceMaterial = formData.sourceMaterial

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

      const submissionData: Pick<LessonPlanRecord, "creation_meta"> = {
        creation_meta: {
          learner_profile: learnerProfileData,
          source_material: {
            title: sourceMaterial.title,
            content: sourceMaterial.markdown
          }
        },
      };

      // generate instead of creating course manually
      const generatedLessonPlan = await generateLessonPlan(submissionData);

      const payload: LessonPlanPreSave = {
        ...generatedLessonPlan,
        creation_meta: submissionData.creation_meta,
      };

      const savedLessonPlan = await saveLessonPlan(payload);

      router.push(`/lesson-planner/${savedLessonPlan.id}/edit`);
    }
  };

  return (
    <>
      <DemoNavigationPanel backRoute="/lesson-planner" />
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
              <SourceSelector 
                onSourceChange={(source) => handleSelectChange("sourceMaterial", source)}
                onViewSource={() => setIsViewSourceModalOpen(true)}
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
                  handleSelectChange("learnerProfileId", key.currentKey ?? "")
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
                {isSubmitting
                  ? "Creating Lesson Plan..."
                  : "Create Lesson Plan"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <ViewSourceModal
          isOpen={isViewSourceModalOpen}
          onClose={() => setIsViewSourceModalOpen(false)}
          title="Source Material"
          markdown={formData.sourceMaterial.markdown ?? ""}
        />
    </>
  );
}
