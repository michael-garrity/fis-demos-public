"use client";

import { BaseListRecord, ListViewProps } from "@/types";
import { Button, Card, Divider, Link } from "@heroui/react";

// Use a generic function component to accept any type that extends BaseRecord
export default function ListView<T extends BaseListRecord>({
  records,
  title,
  createHref,
  RenderItem,
}: ListViewProps<T>) {
  // Function to determine the base URL for the item links
  // E.g., if the current URL is /products, item links start with /products/
  const getBaseLink = (href: string) => {
    // Basic logic to strip parameters/trailing slash for base path
    return href.split("?")[0].replace(/\/new$/, "");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER SECTION: Title and Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
        <Button
          as={Link}
          href={createHref}
          color="primary"
          data-testid="create-new-button"
        >
          + Create New
        </Button>
      </div>

      <Divider className="mb-8" />

      {/* LIST SECTION: Render all Records */}
      <div className="space-y-4">
        {records.length === 0 ? (
          <p className="text-center text-gray-500">
            No records found. Click &apos;Create New&apos; to get started!
          </p>
        ) : (
          records.map((record) => {
            const baseLink = getBaseLink(createHref);
            const id = record.id;

            // Construct the necessary links for the inner component
            const viewHref = `${baseLink}/${id}`;
            const editHref = `${baseLink}/${id}/edit`;

            return (
              <Card
                key={record.id}
                className="p-4 flex justify-between w-full flex-row items-center"
              >
                {/* Render the custom component, passing the record data 
                  and the standard edit/view links 
                */}
                <RenderItem
                  record={record}
                  viewHref={viewHref}
                  editHref={editHref}
                />
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
