"use client";

import { Select, SelectItem, Input, Textarea, Button } from "@heroui/react";
import { Eye, BookOpen, BookText, Book } from "lucide-react";

type CustomSource = {
  title: string;
  markdown: string;
};

type SourceSelectorProps = {
  sources: { id: string | number; title: string }[];
  value: string;
  customSource: CustomSource;
  onSourceChange: (value: string) => void;
  onCustomChange: (custom: CustomSource) => void;
  onViewSource: () => void;
  isLoading?: boolean;
};

export function SourceSelector({
  sources,
  value,
  customSource,
  onSourceChange,
  onCustomChange,
  onViewSource,
  isLoading,
}: SourceSelectorProps) {
  const isCustom = value === "custom";

  return (
    <div className="flex flex-col gap-3">
      <Select
        label="Source Material"
        placeholder={isLoading ? "Loading source materials..." : "Select source"}
        labelPlacement="outside"
        startContent={isCustom ? <BookText size={18} /> : <Book size={18} />}
        selectedKeys={value ? [value] : []}
        onSelectionChange={(key) =>
          onSourceChange(key.currentKey?.toString() ?? "")
        }
        isDisabled={isLoading}
        fullWidth
        required
      >
        <>
          {sources.map((s) => (
            <SelectItem key={s.id.toString()}>{s.title}</SelectItem>
          ))}
          <SelectItem key="custom" startContent={<BookText size={18} />}>Custom</SelectItem>
        </>
      </Select>

      {/* View source only for real materials */}
      {!isCustom && value && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="flat"
            startContent={<Eye size={16} />}
            onClick={onViewSource}
          >
            View Source
          </Button>
        </div>
      )}

      {/* Custom Inputs */}
      {isCustom && (
        <div className="flex flex-col gap-4 p-4 rounded-lg border bg-gray-50">
          <Input
            label="Custom Source Title"
            placeholder="Enter the source title"
            startContent={<BookOpen size={18} />}
            value={customSource.title}
            onChange={(e) =>
              onCustomChange({ ...customSource, title: e.target.value })
            }
            labelPlacement="outside"
            fullWidth
            required
          />

          <Textarea
            label="Custom Source Content"
            placeholder="Write your source content in either markdown or plain text..."
            value={customSource.markdown}
            onChange={(e) =>
              onCustomChange({ ...customSource, markdown: e.target.value })
            }
            labelPlacement="outside"
            fullWidth
            rows={6}
            required
          />
        </div>
      )}
    </div>
  );
}
