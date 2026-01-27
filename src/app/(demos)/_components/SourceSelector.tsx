"use client";

import { useSourceMaterials } from "@/features/source-materials";
import { SourceMaterial } from "@/types";
import { Select, SelectItem, Input, Textarea, Button } from "@heroui/react";
import { Eye, BookOpen, BookText, Book } from "lucide-react";
import { useState } from "react";

type SourceSelectorProps = {
  onSourceChange: (value: SourceMaterial) => void;
  onViewSource: () => void;
};

export function SourceSelector({
  onSourceChange,
  onViewSource,
}: SourceSelectorProps) {
  const { data: sourceMaterials = [], isLoading } = useSourceMaterials();
  const [value, setValue] = useState<string>("");
  const [customSource, setCustomSource] = useState<SourceMaterial>({
    title: "",
    markdown: ""
  });

  const updateSource = (currentKey: string) => {
    const selectedSource = 
      currentKey === "custom" 
      ? customSource
      : sourceMaterials.find((source) => source.id === currentKey)

    setValue(currentKey);
    
    onSourceChange({
      title: selectedSource?.title ?? "",
      markdown: selectedSource?.markdown ?? ""
    })
  }

  const updateCustomSource = <T extends keyof SourceMaterial>(name: T, value: SourceMaterial[T]) => {
    const newSource = {
      ...customSource,
      [name]: value
    }

    setCustomSource(newSource);
    onSourceChange(newSource);
  }

  const isCustom = value === "custom";

  return (
    <div className="flex flex-col gap-3">
      <Select
        data-testid="source-material-selector"
        label="Source Material"
        placeholder={isLoading ? "Loading source materials..." : "Select source"}
        labelPlacement="outside"
        startContent={isCustom ? <BookText size={18} /> : <Book size={18} />}
        selectedKeys={value ? [value] : []}
        onSelectionChange={(key) =>
          updateSource(key.currentKey ?? "")
        }
        isDisabled={isLoading}
        fullWidth
        required
      >
        <>
          {sourceMaterials.map((s, i) => (
            <SelectItem 
              key={s.id.toString()}
              data-testid={`source-material-option-${i}`}
            >{s.title}</SelectItem>
          ))}
          <SelectItem 
            key="custom" 
            startContent={<BookText size={18}/>}
            data-testid="select-custom-material">Custom</SelectItem>
        </>
      </Select>

      {isCustom
        /* Custom Inputs */
        ? (
          <div className="flex flex-col gap-4 p-4 rounded-lg border bg-gray-50">
            <Input
              label="Custom Source Title"
              placeholder="Enter the source title"
              startContent={<BookOpen size={18} />}
              value={customSource.title}
              onChange={(e) =>
                updateCustomSource("title", e.target.value)
              }
              labelPlacement="outside"
              fullWidth
              required
              data-testid="custom-source-title"
            />

            <Textarea
              label="Custom Source Content"
              placeholder="Write your source content in either markdown or plain text..."
              value={customSource.markdown}
              onChange={(e) =>
                updateCustomSource("markdown", e.target.value)
              }
              labelPlacement="outside"
              fullWidth
              rows={6}
              required
              data-testid="custom-source-content"
            />
          </div>
        )
        /* View Source only when one is selected */
        : value && (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="flat"
              startContent={<Eye size={16} />}
              onPress={onViewSource}
            >
              View Source
            </Button>
          </div>
        )
        }
    </div>
  );
}
