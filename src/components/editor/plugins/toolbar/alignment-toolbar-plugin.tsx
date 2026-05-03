"use client"

import { useCallback, useState } from "react"
import { $findMatchingParent } from "@lexical/utils"
import {
  $isRangeSelection,
  $isRootOrShadowRoot,
  BaseSelection,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
} from "lexical"
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const ALIGNMENTS = [
  { value: "left", icon: AlignLeftIcon, label: "Align Left" },
  { value: "center", icon: AlignCenterIcon, label: "Align Center" },
  { value: "right", icon: AlignRightIcon, label: "Align Right" },
  { value: "justify", icon: AlignJustifyIcon, label: "Justify" },
] as const

export function AlignmentToolbarPlugin() {
  const { activeEditor } = useToolbarContext()
  const [alignment, setAlignment] = useState<string>("left")

  const $updateToolbar = useCallback((selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })
      if (element && "getFormatType" in element) {
        const format = (element as { getFormatType: () => string }).getFormatType()
        setAlignment(format || "left")
      }
    }
  }, [])

  useUpdateToolbarHandler($updateToolbar)

  return (
    <ToggleGroup
      type="single"
      value={alignment}
      variant="outline"
      size="sm"
    >
      {ALIGNMENTS.map(({ value, icon: Icon, label }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          aria-label={label}
          title={label}
          onClick={() => {
            activeEditor.dispatchCommand(
              FORMAT_ELEMENT_COMMAND,
              value as ElementFormatType
            )
            setAlignment(value)
          }}
        >
          <Icon className="h-4 w-4" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
