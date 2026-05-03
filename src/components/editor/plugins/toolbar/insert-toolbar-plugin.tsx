"use client"

import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/extension"
import { MinusIcon } from "lucide-react"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { Button } from "@/components/ui/button"

export function InsertToolbarPlugin() {
  const { activeEditor } = useToolbarContext()

  return (
    <Button
      variant="outline"
      size="sm"
      className="!h-8 !w-8 p-0"
      title="Insert Divider"
      type="button"
      onClick={() => {
        activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
      }}
    >
      <MinusIcon className="h-4 w-4" />
    </Button>
  )
}
