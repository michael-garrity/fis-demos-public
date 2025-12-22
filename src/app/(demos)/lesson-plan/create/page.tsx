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
import { Clock, User, Send } from "lucide-react";

export default function LessonPlanForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<LessonPlanRecord>({
    id: "3",
    title: "",
    description: "",
    durationValue: 60,
    durationUnit: "minutes",
    learnerProfileId: "",
  });

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { mutate: createLesson, isPending: isSubmitting } =
    useCreateLessonPlan();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Convert number fields back to number immediately, as inputs return strings
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for the duration number input
  const handleDurationValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    // If the input is cleared, set to 0. Otherwise, convert to number.
    const numValue = value === "" ? 0 : Number(value);

    if (!isNaN(numValue) && numValue >= 0) {
      setFormData((prev: LessonPlanRecord) => ({
        ...prev,
        durationValue: numValue,
      }));
    }
  };

  // Simplified handler for select (used for durationUnit and learnerProfileId)
  const handleSelectChange = (name: string, value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value?.toString() ?? "",
    }));
  };

  const isFormValid = useMemo(() => {
    const { title, description, learnerProfileId, durationValue } = formData;
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      // Check that durationValue is a number greater than 0
      typeof durationValue === "number" &&
      durationValue > 0 &&
      learnerProfileId !== ""
    );
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isSubmitting) {
      // Structure data for API submission
      const submissionData = {
        ...formData,
        // numberOfLessons is already a number due to handleChange fix
        timePerLesson: `${formData.durationValue} ${formData.durationUnit}`,
        learnerProfile: profiles?.find(
          (p) => p.id === formData.learnerProfileId
        ),
      };

      createLesson(submissionData);

      router.push(`/lesson-plan/${submissionData.id}/edit`);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Create New Lesson Plan
      </h1>
      <Card className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. TITLE INPUT */}
          <Input
            data-testid="lesson-plan-create-title"
            label="Lesson Title"
            name="title"
            placeholder="e.g., While Loops in Python"
            value={formData.title}
            onChange={handleChange}
            labelPlacement="outside"
            fullWidth
            required
          />

          {/* 2. DESCRIPTION TEXTAREA */}
          <Textarea
            data-testid="lesson-plan-create-description"
            label="Lesson Description"
            name="description"
            placeholder="A brief summary of the lesson content and goals."
            value={formData.description}
            onChange={handleChange}
            labelPlacement="outside"
            fullWidth
            required
            rows={4}
          />

          <div className="flex gap-4 mb-12">
            {/* 4. TIME PER LESSON (DUAL INPUT) */}
            <div className="flex w-full gap-2">
              {/* Left: Number Input for Value */}
              <Input
                label="Time"
                name="durationValue"
                type="number"
                placeholder="Value"
                value={String(formData.durationValue)}
                onChange={handleDurationValueChange} // Uses updated handler
                startContent={<Clock size={18} />}
                labelPlacement="outside"
                min={1}
                fullWidth
                required
              />

              {/* Right: Select Input for Unit */}
              <Select
                name="durationUnit"
                placeholder="Unit"
                defaultSelectedKeys={["minutes"]}
                onSelectionChange={(key) =>
                  handleSelectChange("durationUnit", key.currentKey)
                }
                aria-label="Time Per Lesson Unit"
                fullWidth
                required
              >
                <SelectItem key="minutes">minutes</SelectItem>
                <SelectItem key="hours">hours</SelectItem>
              </Select>
            </div>
          </div>

          {/* 5. LEARNER PROFILE SELECTION */}
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

          {/* SUBMIT BUTTON */}
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
        </form>
      </Card>
    </div>
  );
}
