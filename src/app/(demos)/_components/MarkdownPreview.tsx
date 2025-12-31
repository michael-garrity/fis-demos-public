"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardBody, Textarea } from "@heroui/react";

interface MarkdownPreviewProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  heightClassName?: string; // allows reuse with different heights
}

export default function MarkdownPreview({
  label = "Content",
  value = "",
  onChange,
  placeholder = "Write your content here…",
  className,
  heightClassName = "h-[480px]",
}: MarkdownPreviewProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className ?? ""}`}>
      {/* Editor */}
      <Card className="shadow-sm">
        <CardBody
          className={`flex flex-col gap-2 ${heightClassName}`}
        >
          <Textarea
            label={label}
            labelPlacement="inside"
            fullWidth
            disableAutosize
            value={value}
            placeholder={placeholder}
            onValueChange={onChange}
            classNames={{
              base: "flex flex-col flex-1",
              inputWrapper: "flex-1",
              input: "h-full resize-none",
            }}
          />
        </CardBody>
      </Card>

      {/* Preview */}
      <Card className="shadow-sm bg-gray-50">
        <CardBody
          className={`flex flex-col ${heightClassName}`}
        >
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Live Preview
          </p>

          <div className="flex-1 overflow-y-auto prose prose-sm max-w-none prose-headings:font-bold prose-h2:mt-4">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">
                Nothing to preview yet
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
