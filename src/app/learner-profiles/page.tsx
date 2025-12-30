"use client";

import BackButton from "@/components/BackButton";
import { Divider, Skeleton } from "@heroui/react";
import { LearnerProfileCard } from "@/lib/learner-profiles";
import { useLearnerProfiles } from "@demos/_store/useLearnerProfiles";

export default function LearnerProfilesPage() {
  const { data, isLoading, isError, error } = useLearnerProfiles();

  if (isError) {
    return <p>Error loading courses: {error.message}</p>;
  }

  return (
    <div className="max-w-5xl flex flex-col items-center mx-auto p-6 w-full">
      <BackButton className="self-start mb-4" />

      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-foreground">
            Learner Profiles
          </h1>
        </div>

        <Divider className="mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-around">
          {isLoading ? <Skeleton className="h-4 w-1/3 rounded-lg" /> : null}
          {!isLoading && data
            ? data.map((learnerProfile) => (
                <LearnerProfileCard
                  key={learnerProfile.id}
                  learnerProfile={learnerProfile}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
