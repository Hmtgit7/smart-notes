'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Check, X, Loader2, Wand2 } from 'lucide-react'
import { aiService } from '@/lib/ai'
import { stripHtml } from '@/lib/utils'

interface AISuggestionsProps {
  content: string
  onApplySuggestion: (suggestion: string) => void
  className?: string
}

interface Suggestion {
  id: string
  type: 'grammar' | 'style' | 'enhance' | 'summarize'
  original: string
  suggested: string
  confidence: number
  reason: string
}

export function AISuggestions({ content, onApplySuggestion, className = "" }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const generateSuggestions = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const cleanContent = stripHtml(content)
      // Get multiple types of suggestions
      const [grammarResult, styleResult, enhanceResult] = await Promise.allSettled([
        aiService.enhanceContent({ type: 'grammar', content: cleanContent }),
        aiService.enhanceContent({ type: 'improve', content: cleanContent }),
        aiService.enhanceContent({ type: 'enhance', content: cleanContent })
      ])

      const newSuggestions: Suggestion[] = []

      if (grammarResult.status === 'fulfilled') {
        newSuggestions.push({
          id: 'grammar-1',
          type: 'grammar',
          original: cleanContent,
          suggested: grammarResult.value.enhancedContent,
          confidence: grammarResult.value.confidence,
          reason: 'Grammar and spelling improvements'
        })
      }

      if (styleResult.status === 'fulfilled') {
        newSuggestions.push({
          id: 'style-1',
          type: 'style',
          original: cleanContent,
          suggested: styleResult.value.enhancedContent,
          confidence: styleResult.value.confidence,
          reason: 'Style and flow improvements'
        })
      }

      if (enhanceResult.status === 'fulfilled') {
        newSuggestions.push({
          id: 'enhance-1',
          type: 'enhance',
          original: cleanContent,
          suggested: enhanceResult.value.enhancedContent,
          confidence: enhanceResult.value.confidence,
          reason: 'Overall content enhancement'
        })
      }

      setSuggestions(newSuggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion(suggestion.suggested)
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
  }

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
  }

  const handleDismissAll = () => {
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className={className}>
      {/* Generate Suggestions Button */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={generateSuggestions}
          disabled={isLoading || !content.trim()}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Get AI Suggestions'}
        </Button>
        
        {showSuggestions && suggestions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismissAll}
            className="text-gray-500"
          >
            Dismiss All
          </Button>
        )}
      </div>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Suggestion Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {suggestion.reason}
                      </span>
                      <span className="text-xs text-blue-600">
                        ({Math.round(suggestion.confidence * 100)}% confidence)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion)}
                        className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismissSuggestion(suggestion.id)}
                        className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Suggestion Content */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 font-medium">Suggested:</div>
                    <div className="bg-white rounded p-3 border text-sm">
                      {suggestion.suggested}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
