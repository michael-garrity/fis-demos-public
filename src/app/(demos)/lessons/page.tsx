"use client";

import { Lesson } from "./_models";
import LessonListRecord from "./_components/LessonListRecord";
import { useLessons } from "./_store";
import DemoNavigationPanel from "../_components/DemoNavigationPanel";
import { Button, Card, Divider, Link } from "@heroui/react";
import { Plus } from "lucide-react";

export default function LessonGeneratorDemoPage() {
  const { data: lessons, isLoading, isError, error } = useLessons();

  if (isError) {
    return (
      <>
        <DemoNavigationPanel backRoute="/" />
        <p>Error loading lessons: {error.message}</p>
      </>
    );
  }

  return (
    <>
      <DemoNavigationPanel backRoute="/" />
      <div data-testid="record-list-container" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-foreground">
            Generated Lessons
          </h1>
          <Button
            as={Link}
            href="/lessons/create"
            color="primary"
            data-testid="create-new-button"
          >
            <Plus /> Create New
          </Button>
        </div>

        <Divider className="mb-8" />

        {isLoading && <p>Loading...</p>}

        {!isLoading && (
          <div className="space-y-4">
            {lessons?.length === 0 ? (
              <p className="text-center text-gray-500">
                No records found. Click &apos;Create New&apos; to get started!
              </p>
            ) : (
              lessons?.map((lesson) => (
                <Card
                  data-testid="list-item-card"
                  key={lesson.id}
                  className="p-4 flex justify-between w-full flex-row items-center"
                >
                  <LessonListRecord record={lesson} />
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
