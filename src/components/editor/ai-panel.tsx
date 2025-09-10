'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Sparkles, 
  Wand2, 
  FileText, 
  Hash, 
  Lightbulb, 
  CheckCircle,
  Loader2,
  Copy,
  RefreshCw
} from 'lucide-react'
import { aiService, type AIEnhancementRequest } from '@/lib/ai'
import { cn } from '@/lib/utils'

interface AIPanelProps {
  content: string
  onInsertContent: (content: string) => void
  onUpdateTitle?: (title: string) => void
  onUpdateTags?: (tags: string[]) => void
}

export function AIPanel({ content, onInsertContent, onUpdateTitle, onUpdateTags }: AIPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [enhancedContent, setEnhancedContent] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<AIEnhancementRequest['type']>('enhance')
  const [customPrompt, setCustomPrompt] = useState('')

  const enhancementTypes = [
    { type: 'enhance' as const, label: 'Enhance', icon: Sparkles, description: 'Improve writing quality and clarity' },
    { type: 'summarize' as const, label: 'Summarize', icon: FileText, description: 'Create a concise summary' },
    { type: 'improve' as const, label: 'Improve', icon: Wand2, description: 'Fix grammar and style' },
    { type: 'expand' as const, label: 'Expand', icon: RefreshCw, description: 'Add more detail and examples' },
    { type: 'grammar' as const, label: 'Grammar', icon: CheckCircle, description: 'Fix grammar and spelling' },
    { type: 'tone' as const, label: 'Tone', icon: Lightbulb, description: 'Adjust tone and style' }
  ]

  const handleEnhance = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const request: AIEnhancementRequest = {
        type: selectedType,
        content: content,
        context: customPrompt || undefined
      }

      const response = await aiService.enhanceContent(request)
      setEnhancedContent(response.enhancedContent)
      setSuggestions(response.suggestions)
    } catch (error) {
      console.error('AI enhancement failed:', error)
      setEnhancedContent('Sorry, AI enhancement failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInsertContent = () => {
    if (enhancedContent) {
      onInsertContent(enhancedContent)
      setEnhancedContent('')
      setSuggestions([])
    }
  }

  const handleGenerateTitle = async () => {
    if (!content.trim() || !onUpdateTitle) return

    setIsLoading(true)
    try {
      const title = await aiService.generateTitle(content)
      onUpdateTitle(title)
    } catch (error) {
      console.error('Title generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateTags = async () => {
    if (!content.trim() || !onUpdateTags) return

    setIsLoading(true)
    try {
      const tags = await aiService.generateTags(content)
      onUpdateTags(tags)
    } catch (error) {
      console.error('Tag generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* AI Enhancement Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            AI Enhancement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {enhancementTypes.map(({ type, label, icon: Icon, description }) => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => setSelectedType(type)}
                disabled={isLoading}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Custom Instructions (Optional)
            </label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add specific instructions for the AI enhancement..."
              className="min-h-[80px]"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleEnhance} 
            disabled={!content.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Enhance Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Content */}
      {enhancedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-emerald-600" />
                Enhanced Content
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(enhancedContent)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleInsertContent}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Insert
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {enhancedContent}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-yellow-700">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {onUpdateTitle && (
              <Button
                variant="outline"
                onClick={handleGenerateTitle}
                disabled={!content.trim() || isLoading}
                className="h-auto p-3 flex flex-col items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span className="text-xs">Generate Title</span>
              </Button>
            )}
            
            {onUpdateTags && (
              <Button
                variant="outline"
                onClick={handleGenerateTags}
                disabled={!content.trim() || isLoading}
                className="h-auto p-3 flex flex-col items-center gap-2"
              >
                <Hash className="h-4 w-4" />
                <span className="text-xs">Generate Tags</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
