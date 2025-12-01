"use client";

import { BaseListRecord, ListViewProps } from "@/types";
import { Button, Card, Divider, Link } from "@heroui/react";
import ListSkeleton from "./ListSkeleton";
import { Plus } from "lucide-react";

// Use a generic function component to accept any type that extends BaseRecord
export default function ListView<T extends BaseListRecord>({
  records,
  title,
  createNewRoute,
  RenderItem,
  isLoading,
}: ListViewProps<T>) {
  return (
    <div data-testid="record-list-container" className="w-full">
      {/* HEADER SECTION: Title and Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
        <Button
          as={Link}
          href={createNewRoute}
          color="primary"
          data-testid="create-new-button"
        >
          <Plus /> Create New
        </Button>
      </div>

      <Divider className="mb-8" />

      {isLoading && <ListSkeleton />}

      {/* LIST SECTION: Render all Records */}
      {!isLoading && (
        <div className="space-y-4">
          {records.length === 0 ? (
            <p className="text-center text-gray-500">
              No records found. Click &apos;Create New&apos; to get started!
            </p>
          ) : (
            records.map((record) => {
              return (
                <Card
                  data-testid="list-item-card"
                  key={record.id}
                  className="p-4 flex justify-between w-full flex-row items-center"
                >
                  <RenderItem record={record} />
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
