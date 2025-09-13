'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Bold, 
  Italic, 
  Underline, 
  Highlighter, 
  Sparkles, 
  Loader2,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered
} from 'lucide-react'
import { aiService } from '@/lib/ai'
import { ColorPicker } from '@/components/ui/color-picker'
import { HighlightPicker } from '@/components/ui/highlight-picker'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing your note...", className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isAILoading, setIsAILoading] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [selectedText, setSelectedText] = useState('')

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
    }
  }, [onChange])

  const handleSelection = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
    } else {
      setSelectedText('')
    }
  }, [])

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }, [handleInput])

  const applyFormatting = useCallback((format: string) => {
    switch (format) {
      case 'bold':
        execCommand('bold')
        break
      case 'italic':
        execCommand('italic')
        break
      case 'underline':
        execCommand('underline')
        break
      case 'color':
        // This would open a color picker in a real implementation
        execCommand('foreColor', '#ff0000')
        break
      case 'alignLeft':
        execCommand('justifyLeft')
        break
      case 'alignCenter':
        execCommand('justifyCenter')
        break
      case 'alignRight':
        execCommand('justifyRight')
        break
      case 'insertUnorderedList':
        execCommand('insertUnorderedList')
        break
      case 'insertOrderedList':
        execCommand('insertOrderedList')
        break
    }
  }, [execCommand])

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return

    setIsAILoading(true)
    try {
      const result = await aiService.generateFromPrompt(aiPrompt)
      
      // Insert AI generated content at cursor position
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(result)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        // Insert at end if no selection
        if (editorRef.current) {
          const textNode = document.createTextNode('\n\n' + result)
          editorRef.current.appendChild(textNode)
        }
      }
      
      handleInput()
      setAiPrompt('')
      setShowAIPanel(false)
    } catch (error) {
      console.error('AI generation failed:', error)
      // Show user-friendly error message
      const errorMessage = error.message?.includes('rate limits') 
        ? 'AI service is temporarily unavailable due to rate limits. Please try again in a few minutes.'
        : 'AI generation failed. Please try again.'
      
      // Insert error message at cursor position
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(errorMessage)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      
      handleInput()
    } finally {
      setIsAILoading(false)
    }
  }

  const handleAIEnhance = async () => {
    if (!selectedText.trim()) return

    setIsAILoading(true)
    try {
      const result = await aiService.enhanceContent({
        type: 'enhance',
        content: selectedText
      })
      
      // Replace selected text with enhanced content
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(result.enhancedContent)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      
      handleInput()
    } catch (error) {
      console.error('AI enhancement failed:', error)
    } finally {
      setIsAILoading(false)
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('bold')}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('italic')}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('underline')}
            className="h-8 w-8 p-0"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        {/* Colors and Highlighting */}
        <div className="flex items-center gap-1 px-2 border-r">
          <ColorPicker
            onColorSelect={(color) => execCommand('foreColor', color)}
          />
          <HighlightPicker
            onHighlightSelect={(color) => execCommand('backColor', color)}
          />
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 px-2 border-r">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('alignLeft')}
            className="h-8 w-8 p-0"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('alignCenter')}
            className="h-8 w-8 p-0"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('alignRight')}
            className="h-8 w-8 p-0"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 px-2 border-r">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('insertUnorderedList')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('insertOrderedList')}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* AI Assistant */}
        <div className="flex items-center gap-1 px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="h-8 px-2 text-sm"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            AI
          </Button>
          {selectedText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAIEnhance}
              disabled={isAILoading}
              className="h-8 px-2 text-sm"
            >
              {isAILoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Type className="h-4 w-4 mr-1" />
              )}
              Enhance
            </Button>
          )}
        </div>
      </div>

      {/* AI Panel */}
      {showAIPanel && (
        <Card className="m-2 border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">AI Assistant</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask AI to write something..."
                  className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAIGenerate()}
                />
                <Button
                  size="sm"
                  onClick={handleAIGenerate}
                  disabled={!aiPrompt.trim() || isAILoading}
                  className="px-3"
                >
                  {isAILoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        className="flex-1 p-4 border-none outline-none text-base leading-relaxed overflow-y-auto"
        style={{ minHeight: '200px' }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
