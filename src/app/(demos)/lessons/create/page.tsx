"use client";

import DemoNavigationPanel from "../../_components/DemoNavigationPanel";

export default function CreateLessonPage() {
  return (
    <>
      <DemoNavigationPanel backRoute="/lessons" />
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-3xl font-bold mb-4">Create New Lesson</h1>
        <p className="text-gray-600">
          Lesson creation will be available in a future update.
        </p>
      </div>
    </>
  );
}
