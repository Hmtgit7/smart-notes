'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Loader2, Send } from 'lucide-react'
import { aiService } from '@/lib/ai'

interface AIPanelProps {
  content: string
  onInsertContent: (content: string) => void
}

export function AIPanel({ content, onInsertContent }: AIPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setShowActions(false)
    try {
      // Use the AI service to generate content based on the prompt
      const result = await aiService.generateFromPrompt(prompt)
      setGeneratedText(result)
      setShowActions(true)
    } catch (error) {
      console.error('AI generation failed:', error)
      const errorMessage = error.message?.includes('rate limits') 
        ? 'AI service is temporarily unavailable due to rate limits. Please try again in a few minutes.'
        : 'Sorry, AI generation failed. Please try again.'
      setGeneratedText(errorMessage)
      setShowActions(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInsert = () => {
    if (generatedText) {
      onInsertContent(generatedText)
      setGeneratedText('')
      setPrompt('')
      setShowActions(false)
    }
  }

  const handleCancel = () => {
    setGeneratedText('')
    setPrompt('')
    setShowActions(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* AI Prompt Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              What would you like me to write?
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Write a professional email about project updates, Create a summary of the meeting notes, Write a creative story about..."
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={!prompt.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Text
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedText && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                Generated Content
              </CardTitle>
              {showActions && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInsert}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Insert into Note
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="whitespace-pre-wrap text-sm text-gray-800">
                {generatedText}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
