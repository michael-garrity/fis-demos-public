import { Card, Skeleton, CardBody, CardHeader } from "@heroui/react";
import { BookOpen } from "lucide-react";

/**
 * Renders a skeleton loading state for a single lesson item, mimicking
 * the Lesson Header and the internal details.
 */

export default function LessonSkeleton() {
  return (
    <Card className="shadow-lg overflow-hidden border-t-4 border-indigo-200 opacity-75">
      {/* 1. Lesson Header Mock (Title + Duration Chip) */}
      <CardHeader className="flex flex-col items-start w-full">
        <div className="flex items-center justify-between w-full pb-3">
          <div className="flex flex-col items-start w-full pr-4">
            {/* Title Skeleton */}
            <Skeleton className="w-2/3 h-6 rounded-lg mb-1">
              <div className="bg-default-200" />
            </Skeleton>
            <Skeleton className="w-1/2 h-3 rounded-full">
              <div className="bg-default-300" />
            </Skeleton>
          </div>
        </div>
      </CardHeader>

      {/* 2. Content Body Mock */}
      <CardBody className="p-4 pt-0">
        <div className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-4 border-t pt-4">
          <Card className="shadow-sm h-full">
            <CardHeader className="flex flex-col items-start pb-2">
              <h4 className="flex items-center text-base font-semibold text-gray-800">
                <BookOpen className="w-5 h-5 text-indigo-500 mr-2" />
                Introduction
              </h4>
            </CardHeader>

            <CardBody className="space-y-3 pt-2 border-t border-gray-100">
              <div className="space-y-2">
                <Skeleton className="w-full rounded-full">
                  <div className="h-3 bg-default-200" />
                </Skeleton>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
}
