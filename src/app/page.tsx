"use client";

import DashboardSection from "./_components/DashboardSection";
import DemoCard from "./_components/DemoCard";

export default function Home() {
  return (
    <>
      <DashboardSection heading="Adaptive Learning" marginTop={24}>
        <p className="max-w-lg text-center mb-8">
          Experience the future of creation. Our{" "}
          <strong>adaptive content generation tools</strong> intelligently
          tailor output to fit any need, making content unique and relevant
          every time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-around">
          <DemoCard
            imageSource="/quiz-generator-thumbnail.png"
            title="Quiz Generator"
            description={`Transform any content into a personalized, adaptive multiple-choice quiz that targets your specific knowledge gaps.`}
            href="/quiz-generator"
          ></DemoCard>
          <DemoCard
            imageSource="/content-mapping-thumbnail.png"
            title="Course Outline"
            description={`Quickly generate a full, adaptable course outline.`}
            href="/course-outline"
          ></DemoCard>
          <DemoCard
            imageSource="/personalized-content-thumbnail.png"
            title="Personalized Content"
            description={`Instantly rewrite any text or document into a format, tone, and complexity level that perfectly matches the individual learner's needs.`}
            href="/personalized-content"
          ></DemoCard>
          <DemoCard
            imageSource="/lesson-plan-thumbnail.png"
            title="Lesson Planner"
            description={`Plan your lessons perfectly based around the individual's unique profile.`}
            href="/lesson-planner"
          ></DemoCard>
          <DemoCard
            imageSource="/lesson-plan-thumbnail.png"
            title="Lesson Generator"
            description={`Generate personalized lessons tailored to specific learner profiles.`}
            href="/lessons"
          ></DemoCard>
        </div>
      </DashboardSection>
    </>
  );
}
