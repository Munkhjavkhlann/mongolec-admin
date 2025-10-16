'use client'

import { useState } from 'react'
import { SerializedEditorState } from 'lexical'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Editor } from '@/components/blocks/editor-00/editor'
import { Label } from '@/components/ui/label'

const initialValue = {
  root: {
    children: [
      {
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState

interface MultiLanguageEditorProps {
  contentEn: SerializedEditorState
  contentMn: SerializedEditorState
  onChangeEn: (state: SerializedEditorState) => void
  onChangeMn: (state: SerializedEditorState) => void
  label?: string
  activeLanguage?: 'en' | 'mn'
  onLanguageChange?: (lang: 'en' | 'mn') => void
}

export function MultiLanguageEditor({
  contentEn = initialValue,
  contentMn = initialValue,
  onChangeEn,
  onChangeMn,
  label = 'Content',
  activeLanguage = 'en',
  onLanguageChange,
}: MultiLanguageEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {label && <Label className="text-base font-semibold">{label}</Label>}
        <Tabs
          value={activeLanguage}
          onValueChange={(v) => onLanguageChange?.(v as 'en' | 'mn')}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="mn">Монгол</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        {activeLanguage === 'en' ? (
          <Editor
            editorSerializedState={contentEn}
            onSerializedChange={onChangeEn}
          />
        ) : (
          <Editor
            editorSerializedState={contentMn}
            onSerializedChange={onChangeMn}
          />
        )}
      </div>
    </div>
  )
}
