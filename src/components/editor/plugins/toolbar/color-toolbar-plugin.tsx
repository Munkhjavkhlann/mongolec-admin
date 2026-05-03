"use client"

import { useCallback, useState } from "react"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import {
  $getSelection,
  $isRangeSelection,
  BaseSelection,
} from "lexical"
import { HighlighterIcon, PaletteIcon } from "lucide-react"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Black", value: "#000000" },
  { label: "Dark Gray", value: "#374151" },
  { label: "Gray", value: "#6B7280" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F97316" },
  { label: "Yellow", value: "#CA8A04" },
  { label: "Green", value: "#16A34A" },
  { label: "Blue", value: "#2563EB" },
  { label: "Purple", value: "#9333EA" },
  { label: "Pink", value: "#DB2777" },
]

const HIGHLIGHT_COLORS = [
  { label: "None", value: "" },
  { label: "Yellow", value: "#FEF08A" },
  { label: "Green", value: "#BBF7D0" },
  { label: "Blue", value: "#BFDBFE" },
  { label: "Red", value: "#FECACA" },
  { label: "Orange", value: "#FED7AA" },
  { label: "Pink", value: "#FBCFE8" },
  { label: "Purple", value: "#E9D5FF" },
]

export function ColorToolbarPlugin() {
  const { activeEditor } = useToolbarContext()
  const [textColor, setTextColor] = useState("")
  const [bgColor, setBgColor] = useState("")

  const $updateToolbar = useCallback((selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setTextColor(
        $getSelectionStyleValueForProperty(selection, "color", "")
      )
      setBgColor(
        $getSelectionStyleValueForProperty(selection, "background-color", "")
      )
    }
  }, [])

  useUpdateToolbarHandler($updateToolbar)

  const applyTextColor = (color: string) => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: color || null })
      }
    })
    setTextColor(color)
  }

  const applyBgColor = (color: string) => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "background-color": color || null })
      }
    })
    setBgColor(color)
  }

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="!h-8 !w-8 p-0 relative"
            title="Text Color"
            type="button"
          >
            <PaletteIcon className="h-4 w-4" />
            <div
              className="absolute bottom-1 left-1.5 right-1.5 h-[3px] rounded-full"
              style={{ backgroundColor: textColor || "#000000" }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Text Color
          </p>
          <div className="grid grid-cols-6 gap-1">
            {TEXT_COLORS.map(({ label, value }) => (
              <button
                key={label}
                title={label}
                type="button"
                className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform flex items-center justify-center"
                style={{ backgroundColor: value || "transparent" }}
                onClick={() => applyTextColor(value)}
              >
                {!value && (
                  <span className="text-[10px] font-bold text-muted-foreground leading-none">
                    A
                  </span>
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="!h-8 !w-8 p-0 relative"
            title="Highlight Color"
            type="button"
          >
            <HighlighterIcon className="h-4 w-4" />
            <div
              className="absolute bottom-1 left-1.5 right-1.5 h-[3px] rounded-full border"
              style={{
                backgroundColor: bgColor || "transparent",
                borderColor: bgColor ? "transparent" : "currentColor",
                opacity: bgColor ? 1 : 0.3,
              }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Highlight
          </p>
          <div className="grid grid-cols-5 gap-1">
            {HIGHLIGHT_COLORS.map(({ label, value }) => (
              <button
                key={label}
                title={label}
                type="button"
                className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: value || "transparent" }}
                onClick={() => applyBgColor(value)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
