"use client"

import { useCallback, useState } from "react"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { $findMatchingParent } from "@lexical/utils"
import { $isRangeSelection, BaseSelection } from "lexical"
import { Link2Icon, Link2OffIcon } from "lucide-react"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function LinkToolbarPlugin() {
  const { activeEditor } = useToolbarContext()
  const [isLink, setIsLink] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const $updateToolbar = useCallback((selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode()
      const linkParent = $findMatchingParent(node, $isLinkNode)
      const isLinkFound = linkParent !== null
      setIsLink(isLinkFound)
      if (isLinkFound && $isLinkNode(linkParent)) {
        setLinkUrl(linkParent.getURL())
      } else {
        setLinkUrl("")
      }
    }
  }, [])

  useUpdateToolbarHandler($updateToolbar)

  const insertLink = () => {
    if (!linkUrl.trim()) return
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`
    activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, {
      url,
      target: "_blank",
      rel: "noopener noreferrer",
    })
    setIsOpen(false)
    setLinkUrl("")
  }

  const removeLink = () => {
    activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    setLinkUrl("")
    setIsLink(false)
  }

  if (isLink) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="!h-8 !w-8 p-0"
        title="Remove Link"
        type="button"
        onClick={removeLink}
      >
        <Link2OffIcon className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="!h-8 !w-8 p-0"
          title="Insert Link"
          type="button"
        >
          <Link2Icon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Insert Link
        </p>
        <div className="flex gap-2">
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") insertLink()
              if (e.key === "Escape") setIsOpen(false)
            }}
            autoFocus
          />
          <Button size="sm" className="h-8 px-3" onClick={insertLink} type="button">
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
