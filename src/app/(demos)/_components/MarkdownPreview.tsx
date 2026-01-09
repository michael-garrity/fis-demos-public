"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardBody, Textarea, Button } from "@heroui/react";

type Mode = "edit" | "preview" | "split";

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
  const [mode, setMode] = useState<Mode>("edit");

  /** Shared scroll ratio (0–1) */
  const scrollRatioRef = useRef(0);
  const isSyncingRef = useRef(false);

  /** Scroll containers */
  const editorScrollRef = useRef<HTMLTextAreaElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);

  /** Helpers */
  const saveScrollRatio = (el: HTMLElement) => {
    const max = el.scrollHeight - el.clientHeight;
    scrollRatioRef.current = max > 0 ? el.scrollTop / max : 0;
  };

  const restoreScrollRatio = (el: HTMLElement) => {
    const max = el.scrollHeight - el.clientHeight;
    el.scrollTop = max * scrollRatioRef.current;
  };

  /** Sync scrolling between editor & preview (split mode only) */
  const syncScroll = (
    source: HTMLElement,
    target: HTMLElement
  ) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    saveScrollRatio(source);
    restoreScrollRatio(target);

    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  };

  /** Restore scroll when mode changes */
  useEffect(() => {
    requestAnimationFrame(() => {
      if (editorScrollRef.current) {
        restoreScrollRatio(editorScrollRef.current);
      }
      if (previewScrollRef.current) {
        restoreScrollRatio(previewScrollRef.current);
      }
    });
  }, [mode]);

  return (
    <div className={className}>
      {/* Segmented Tabs */}
      <div className="mb-3 inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
        <Button
          size="sm"
          variant={mode === "edit" ? "solid" : "light"}
          onPress={() => setMode("edit")}
        >
          Edit
        </Button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <Button
          size="sm"
          variant={mode === "preview" ? "solid" : "light"}
          onPress={() => setMode("preview")}
        >
          Preview
        </Button>

        <div className="mx-1 h-5 w-px bg-gray-300" />


        <Button
          size="sm"
          variant={mode === "split" ? "solid" : "light"}
          onPress={() => setMode("split")}
        >
          Split
        </Button>
      </div>

      {/* Edit */}
      {mode === "edit" && (
        <Card className="shadow-sm">
          <CardBody className={`flex flex-col gap-2 ${heightClassName}`}>
            <Textarea
              ref={editorScrollRef}
              label={label}
              labelPlacement="inside"
              fullWidth
              disableAutosize
              value={value}
              placeholder={placeholder}
              onValueChange={onChange}
              onScroll={(e) =>
                saveScrollRatio(e.currentTarget)
              }
              classNames={{
                base: "flex flex-col flex-1",
                inputWrapper: "flex-1",
                input: "h-full resize-none",
              }}
            />
          </CardBody>
        </Card>
      )}

      {/* Preview */}
      {mode === "preview" && (
        <Card className="shadow-sm bg-gray-50">
          <CardBody className={`flex flex-col ${heightClassName}`}>
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Preview
            </p>

            <div
              ref={previewScrollRef}
              onScroll={(e) =>
                saveScrollRatio(e.currentTarget)
              }
              className="flex-1 overflow-y-auto prose prose-sm max-w-none prose-headings:font-bold prose-h2:mt-4"
            >
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
      )}

      {/* Split */}
      {mode === "split" && (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
          {/* Editor */}
          <Card className="shadow-sm">
            <CardBody className={`flex flex-col gap-2 ${heightClassName}`}>
              <Textarea
                ref={editorScrollRef}
                label={label}
                labelPlacement="inside"
                fullWidth
                disableAutosize
                value={value}
                placeholder={placeholder}
                onValueChange={onChange}
                onScroll={(e) =>
                  previewScrollRef.current &&
                  syncScroll(
                    e.currentTarget,
                    previewScrollRef.current
                  )
                }
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
            <CardBody className={`flex flex-col ${heightClassName}`}>
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Live Preview
              </p>

              <div 
                ref={previewScrollRef}
                onScroll={(e) =>
                  editorScrollRef.current &&
                  syncScroll(
                    e.currentTarget,
                    editorScrollRef.current
                  )
                }
                className="flex-1 overflow-y-auto prose prose-sm max-w-none prose-headings:font-bold prose-h2:mt-4">
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
      )}
    </div>
  );
}
