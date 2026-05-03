import { useEffect, useState } from "react"
import { registerCodeHighlighting } from "@lexical/code"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TRANSFORMERS } from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin"
import { AlignmentToolbarPlugin } from "@/components/editor/plugins/toolbar/alignment-toolbar-plugin"
import { ColorToolbarPlugin } from "@/components/editor/plugins/toolbar/color-toolbar-plugin"
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin"
import { InsertToolbarPlugin } from "@/components/editor/plugins/toolbar/insert-toolbar-plugin"
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading"
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list"
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote"
import { FormatCode } from "@/components/editor/plugins/toolbar/block-format/format-code"
import { Separator } from "@/components/ui/separator"

function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => registerCodeHighlighting(editor), [editor])
  return null
}

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      <ToolbarPlugin>
        {() => (
          <div className="flex flex-wrap items-center gap-1 border-b bg-background px-2 py-1.5 sticky top-0 z-10">
            <HistoryToolbarPlugin />

            <Separator orientation="vertical" className="h-7" />

            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3", "h4"]} />
              <FormatQuote />
              <FormatCode />
              <FormatBulletedList />
              <FormatNumberedList />
              <FormatCheckList />
            </BlockFormatDropDown>

            <Separator orientation="vertical" className="h-7" />

            <FontFormatToolbarPlugin />

            <Separator orientation="vertical" className="h-7" />

            <AlignmentToolbarPlugin />

            <Separator orientation="vertical" className="h-7" />

            <ColorToolbarPlugin />

            <Separator orientation="vertical" className="h-7" />

            <LinkToolbarPlugin />
            <InsertToolbarPlugin />
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="relative">
              <div ref={onRef} className="editor-scroller">
                <ContentEditable placeholder="Start typing…" />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin />
        <CodeHighlightPlugin />
        <HorizontalRulePlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </div>
    </div>
  )
}
