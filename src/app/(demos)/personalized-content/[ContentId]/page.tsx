"use client";

import {
  Users,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PersonalizedContentSkeleton from "./_components/PersonalizedContentSkeleton";
import { LearnerProfileChip } from "@/lib/learner-profiles";
import { usePersonalizedContent } from "../_store";
import { useParams } from "next/navigation";

export default function PersonalizedContentTeacherView() {
  const { contentId: id } = useParams<{ contentId: string }>();
  const { data: personalizedContent, isFetching, error } = usePersonalizedContent(id);

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center text-red-600">
        <p>Error loading content: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto font-inter min-h-screen w-full">
      {isFetching && !personalizedContent?.title ? (
        <PersonalizedContentSkeleton />
      ) : (
        <Card className="shadow-xl border-t-4 border-indigo-600 mb-8 rounded-xl">
          <CardHeader>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {personalizedContent?.title}
            </h1>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-lg text-gray-600 border-b pb-4 mb-4">
              {personalizedContent?.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <LearnerProfileChip
                learnerProfile={personalizedContent?.learnerProfile ?? null}
                size="md"
                variant="faded"
                color="default"
                startContent={<Users className="w-4 h-4" />}
              >
                Target Profile:{" "}
                <span className="font-semibold ml-1">
                  {personalizedContent?.learnerProfile?.label}
                </span>
              </LearnerProfileChip>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Detailed Personal Content View */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Personalized Content View
      </h2>
      <Card className="shadow-lg rounded-xl">
  <CardHeader className="border-b">
    <div className="flex items-center gap-2 text-gray-700">
      <BookOpen className="w-5 h-5 text-indigo-600" />
      <h3 className="text-xl font-semibold">
        What the Student Will See
      </h3>
    </div>
  </CardHeader>

  <CardBody className="bg-gray-50">
    {personalizedContent?.content ? (
      <div className="prose prose-base max-w-none prose-headings:font-bold prose-h2:mt-6 prose-h3:mt-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {personalizedContent.content}
        </ReactMarkdown>
      </div>
    ) : (
      <p className="italic text-gray-400">
        No personalized content has been added yet.
      </p>
    )}
  </CardBody>
</Card>

        </div>
  );
}
