"use client";

import { Card, Skeleton } from "@heroui/react";

/**
 * Renders a skeleton loading view for the ListView component.
 * It simulates 5 loading cards with animated placeholder shapes using the Skeleton component from heroui.
 */
export default function ListSkeleton() {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div data-testid="list-skeleton-wrapper" className="space-y-4 w-full">
      {skeletonItems.map((_, index) => (
        <Card
          key={index}
          className="p-4 flex justify-between w-full flex-row items-center rounded-xl"
        >
          {/* Use Skeleton components for placeholders */}
          <div className="flex flex-col space-y-2 w-3/4">
            {/* Title Placeholder */}
            <Skeleton className="h-4 w-1/3 rounded-lg" />
            {/* Description Placeholder */}
            <Skeleton className="h-3 w-2/3 rounded-lg" />
          </div>

          {/* Right side: Button placeholders */}
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  );
}
