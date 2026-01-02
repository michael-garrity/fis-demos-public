import React from "react";
import { LayoutList, Clock, Users } from "lucide-react";
import { Card, CardHeader, CardBody, Chip, Skeleton } from "@heroui/react";

// Custom component is no longer needed since Skeleton is used directly in JSX
const SkeletonChip = ({
  Icon,
  widthClass,
}: {
  Icon: React.ElementType;
  widthClass: string;
}) => (
  <Chip
    size="md"
    variant="faded"
    startContent={<Icon className="w-4 h-4 text-gray-400" />}
  >
    {/* Use Skeleton to mock the text content size */}
    <Skeleton className={`w-full h-3 block rounded-full`}>
      <div className={widthClass} />
    </Skeleton>
  </Chip>
);

/**
 * Renders a skeleton loading state for the primary content metadata card.
 * This mocks the structure of the Content Title, Description, and the three metadata Chips
 * using the HeroUI Skeleton component.
 */
export default function PersonalizedContentSkeleton() {
  return (
    <Card className="shadow-xl border-t-4 border-indigo-600 mb-8 rounded-xl opacity-75">
      <CardHeader className="flex flex-col items-start w-full">
        {/* Title Skeleton (3/4 width, large height) */}
        <div className="w-full mb-3">
          <Skeleton className="w-3/4 rounded-lg">
            <div className="h-8 bg-default-200" />
          </Skeleton>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        {/* Description Skeleton (Two lines) */}
        <div className="space-y-2 border-b pb-4 mb-4">
          <Skeleton className="w-full rounded-lg">
            <div className="h-4 bg-default-200" />
          </Skeleton>
          <Skeleton className="w-11/12 rounded-lg">
            <div className="h-4 bg-default-300" />
          </Skeleton>
        </div>

        {/* Metadata Chips Skeleton */}
        <div className="flex flex-wrap gap-4 mt-4">
          <SkeletonChip Icon={LayoutList} widthClass="w-24" />
          <SkeletonChip Icon={Clock} widthClass="w-32" />
          <SkeletonChip Icon={Users} widthClass="w-28" />
        </div>
      </CardBody>
    </Card>
  );
}
