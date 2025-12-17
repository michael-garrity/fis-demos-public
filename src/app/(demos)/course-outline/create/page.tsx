"use client";

import { useGenerateCourseOutline } from "@demos/course-outline/_store";
import { useLearnerProfiles } from "@demos/_store/useLearnerProfiles";
import { CourseOutlineFormState } from "@/types";
import {
  Card,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Spinner,
} from "@heroui/react";
import { BookOpen, Clock, User, Send } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSaveCourseOutline } from "../_store/useSaveCourseOutline";

export default function CourseOutlineForm() {
  const [formData, setFormData] = useState<CourseOutlineFormState>({
    id: "course-elephants-001",
    title: "Elephants: Behavior, Biology, and Conservation",
    description:
      "An engaging course exploring the biology, social behavior, and conservation challenges of elephants, with a focus on both African and Asian species.",
    numberOfLessons: 5,
    durationValue: 15,
    durationUnit: "minutes",
    learnerProfileId: "1",
    customization:
      "Assume learners have no prior biology background. Use clear explanations, real-world examples, and include conservation case studies in each lesson.",
  });

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { mutateAsync: createCourseOutline, isPending: isSubmitting } =
    useGenerateCourseOutline();

  const { mutateAsync: saveCourseOutline } = useSaveCourseOutline();

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Convert number fields back to number immediately, as inputs return strings
    if (name === "numberOfLessons") {
      const numValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) || value === "" ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler for the duration number input
  const handleDurationValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    // If the input is cleared, set to 0. Otherwise, convert to number.
    const numValue = value === "" ? 0 : Number(value);

    if (!isNaN(numValue) && numValue >= 0) {
      setFormData((prev: CourseOutlineFormState) => ({
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
    const {
      title,
      description,
      numberOfLessons,
      learnerProfileId,
      durationValue,
    } = formData;
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      // Check that lessons is a number greater than 0
      typeof numberOfLessons === "number" &&
      numberOfLessons > 0 &&
      // Check that durationValue is a number greater than 0
      typeof durationValue === "number" &&
      durationValue > 0 &&
      learnerProfileId !== ""
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const learnerProfile = profiles?.find(
      (p) => p.id === formData.learnerProfileId
    );
    if (isFormValid && !isSubmitting) {
      // Structure data for API submission
      const submissionData = {
        ...formData,
        timePerLesson: `${formData.durationValue} ${formData.durationUnit}`,
        learnerProfileName: learnerProfile?.name,
      };

      const createdCourseOutline = await createCourseOutline(submissionData);

      const savedCourseOutline = await saveCourseOutline({
        ...createdCourseOutline,
        creation_meta: { learner_profile: learnerProfile },
      });

      router.push(`/course-outline/${savedCourseOutline.id}/edit`);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Create New Course Outline
      </h1>
      <Card className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. TITLE INPUT */}
          <Input
            data-testid="course-outline-create-title"
            label="Course Title"
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
            data-testid="course-outline-create-description"
            label="Course Description"
            name="description"
            placeholder="A brief summary of the course content and goals."
            value={formData.description}
            onChange={handleChange}
            labelPlacement="outside"
            fullWidth
            required
            rows={4}
          />

          <div className="flex gap-4 mb-12">
            {/* 3. NUMBER OF LESSONS */}
            <Input
              label="Number of Lessons"
              name="numberOfLessons"
              type="number"
              startContent={<BookOpen size={18} />}
              placeholder="e.g., 10"
              value={String(formData.numberOfLessons)}
              onChange={handleChange} // Uses updated handleChange
              labelPlacement="outside"
              min={1}
              required
            />

            {/* 4. TIME PER LESSON (DUAL INPUT) */}
            <div className="flex w-full gap-2">
              {/* Left: Number Input for Value */}
              <Input
                label="Time Per Lesson"
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
            data-testid="course-outline-create-learner-profile"
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
                  {profile.name}
                </SelectItem>
              ))}
            </>
          </Select>

          {/* 6. CUSTOMIZATION TEXTAREA */}
          <Textarea
            label="Customization"
            name="customization"
            placeholder="What else would you like us to know about this course or learner?"
            value={formData.customization}
            onChange={handleChange}
            labelPlacement="outside"
            fullWidth
            rows={4}
          />

          {/* SUBMIT BUTTON */}
          <Button
            data-testid="course-outline-create-submit"
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
              ? "Creating Course Outline..."
              : "Create Course Outline"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
