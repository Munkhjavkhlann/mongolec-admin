"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { IS_APPLE, mergeRegister } from "@lexical/utils"
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import { RedoIcon, UndoIcon } from "lucide-react"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export function HistoryToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const { activeEditor, $updateToolbar } = useToolbarContext()
  const [isEditable, setIsEditable] = useState(editor.isEditable())
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const updateToolbarRef = useRef($updateToolbar)

  useEffect(() => {
    updateToolbarRef.current = $updateToolbar
  }, [$updateToolbar])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCanUndo = useCallback((payload: boolean) => {
    setCanUndo(payload)
    return false
  }, [])

  const handleCanRedo = useCallback((payload: boolean) => {
    setCanRedo(payload)
    return false
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable)
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbarRef.current()
        })
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        handleCanUndo,
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        handleCanRedo,
        COMMAND_PRIORITY_CRITICAL
      )
    )
  }, [activeEditor, editor, handleCanUndo, handleCanRedo])

  const undoTitle = isMounted ? (IS_APPLE ? "Undo (⌘Z)" : "Undo (Ctrl+Z)") : "Undo"
  const redoTitle = isMounted ? (IS_APPLE ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)") : "Redo"

  return (
    <ButtonGroup>
      <Button
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined)
        }}
        title={undoTitle}
        type="button"
        aria-label="Undo"
        size="icon"
        className="!h-8 !w-8"
        variant={"outline"}
      >
        <UndoIcon className="size-4" />
      </Button>
      <Button
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined)
        }}
        title={redoTitle}
        type="button"
        aria-label="Redo"
        variant={"outline"}
        size="icon"
        className="!h-8 !w-8"
      >
        <RedoIcon className="size-4" />
      </Button>
    </ButtonGroup>
  )
}
