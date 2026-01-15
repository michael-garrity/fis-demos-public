import { SourceMaterial } from "@/features/source-materials"
import { SourceMaterialForm } from "@/types"
import { Select, SelectItem, Textarea } from "@heroui/react"
import { Book, BookText } from "lucide-react"

type props = {
  sources: SourceMaterial[] | undefined
  loading: boolean
  value: SourceMaterialForm
  onChange: (update: SourceMaterialForm) => void
}

export default function SourceMaterialSelector({sources, loading, value, onChange}: props) {
  const selected = 
    value?.type === "custom"
      ? ["custom"] 
    : value?.id ? [value.id]
    : undefined

  const isCustom = value?.type === "custom"

  return (
    <>
    <div className="flex gap-4">
      <Select
        data-testid="quiz-create-lesson-selector"
        label="Source Material"
        name="sourceLessonId"
        placeholder={
          loading
            ? "Loading Source Materials..."
            : "Select Source Material"
        }
        labelPlacement="outside"
        selectedKeys={selected}
        onSelectionChange={(key) =>{
            if (key.currentKey === "custom") {
              onChange({type: "custom", id: undefined, content: value?.content ?? ""})
            } else if (typeof key.currentKey === "string") {
              onChange({type: "source", id: key.currentKey, content: value?.content})
            }
          }
        }
        startContent={isCustom ? <BookText size={18} /> : <Book size={18} />}
        isDisabled={loading}
        fullWidth
        required
      >
        <>
          {sources?.map((source) => (
            <SelectItem key={source.id}>
              {source.title}
            </SelectItem>
          ))}
          <SelectItem key="custom" startContent={<BookText size={18} />}>
            Custom Lesson
          </SelectItem>
        </>
      </Select>
    </div>
    {value?.type === "custom" 
      && <Textarea
            data-testid="source-lesson-material"
            label="Custom Source"
            name="custom-source"
            placeholder="Content used to build the quiz"
            value={value.content}
            onChange={(e) => {
              onChange({...value, content: e.target.value})
            }}
            labelPlacement="outside"
            fullWidth
            required
            rows={4}
          />
      }
  </>
  )
}
