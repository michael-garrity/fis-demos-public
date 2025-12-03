"use client";

import { useCreateCourseOutline } from "@demos/course-outline/_store";
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

export default function CourseOutlineForm() {
  const [formData, setFormData] = useState<CourseOutlineFormState>({
    id: "",
    title: "",
    description: "",
    numberOfLessons: 1,
    durationValue: 60,
    durationUnit: "minutes",
    learnerProfileId: "",
    customization: "",
  });

  const { data: profiles, isLoading: profilesLoading } = useLearnerProfiles();
  const { mutate: createCourse, isPending: isSubmitting } =
    useCreateCourseOutline();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for the new duration number input
  const handleDurationValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const numValue = Number(value) ?? 0;

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
      typeof numberOfLessons === "number" &&
      numberOfLessons > 0 &&
      // Check that durationValue is a positive number
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
        numberOfLessons: Number(formData.numberOfLessons),
        // Construct the final timePerLesson string for submission
        timePerLesson: `${formData.durationValue} ${formData.durationUnit}`,
        // Find the full name for context in the mock
        learnerProfileName: profiles?.find(
          (p) => p.id === formData.learnerProfileId
        )?.name,
      };

      createCourse(submissionData);
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
              onChange={handleChange}
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
                onChange={handleDurationValueChange}
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
            onSubmit={handleSubmit}
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
