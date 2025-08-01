"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, Link, Image, Code } from "lucide-react"
import { useState } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)

  const insertText = (before: string, after: string = "") => {
    if (!textareaRef) return

    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    // Set cursor position after insertion
    setTimeout(() => {
      textareaRef.focus()
      textareaRef.setSelectionRange(start + before.length + selectedText.length + after.length, start + before.length + selectedText.length + after.length)
    }, 0)
  }

  const formatButtons = [
    { icon: Bold, label: "Bold", before: "**", after: "**" },
    { icon: Italic, label: "Italic", before: "*", after: "*" },
    { icon: List, label: "List", before: "\n- ", after: "" },
    { icon: Link, label: "Link", before: "[", after: "](url)" },
    { icon: Image, label: "Image", before: "![alt text](", after: ")" },
    { icon: Code, label: "Code", before: "`", after: "`" },
  ]

  return (
    <div className="space-y-2">
      <div className="flex gap-1 p-2 border rounded-t-md bg-muted/50">
        {formatButtons.map((button, index) => {
          const Icon = button.icon
          return (
            <Button
              key={index}
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => insertText(button.before, button.after)}
              disabled={disabled}
              title={button.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}
      </div>
      <Textarea
        ref={setTextareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-64 font-mono text-sm resize-none rounded-t-none"
      />
      <div className="text-xs text-muted-foreground">
        Use Markdown syntax for formatting. Bold: **text**, Italic: *text*, Links: [text](url)
      </div>
    </div>
  )
}