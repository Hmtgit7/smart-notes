import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

export interface AIEnhancementRequest {
  type: 'enhance' | 'summarize' | 'improve' | 'expand' | 'grammar' | 'tone'
  content: string
  context?: string
}

export interface AIEnhancementResponse {
  enhancedContent: string
  suggestions: string[]
  confidence: number
}

export class AIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  async enhanceContent(request: AIEnhancementRequest): Promise<AIEnhancementResponse> {
    try {
      const prompt = this.buildPrompt(request)
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return this.parseResponse(text)
    } catch (error) {
      console.error('AI enhancement error:', error)
      throw new Error('Failed to enhance content with AI')
    }
  }

  private buildPrompt(request: AIEnhancementRequest): string {
    const { type, content, context } = request

    const baseInstructions = {
      enhance: 'Improve the writing quality, clarity, and structure while maintaining the original meaning and tone.',
      summarize: 'Create a concise summary that captures the key points and main ideas.',
      improve: 'Enhance the content by improving grammar, style, and flow while keeping the original intent.',
      expand: 'Expand on the ideas with more detail, examples, and explanations while maintaining coherence.',
      grammar: 'Fix grammar, spelling, and punctuation errors while maintaining the original style.',
      tone: 'Adjust the tone to be more professional, friendly, or formal as appropriate.'
    }

    let prompt = `Please ${baseInstructions[type]} the following content:\n\n${content}\n\n`

    if (context) {
      prompt += `Context: ${context}\n\n`
    }

    prompt += `Please provide your response in the following JSON format:
{
  "enhancedContent": "The improved content here",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "confidence": 0.85
}

Make sure the enhanced content is well-formatted and ready to use.`

    return prompt
  }

  private parseResponse(text: string): AIEnhancementResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          enhancedContent: parsed.enhancedContent || text,
          suggestions: parsed.suggestions || [],
          confidence: parsed.confidence || 0.8
        }
      }

      // Fallback if no JSON found
      return {
        enhancedContent: text,
        suggestions: [],
        confidence: 0.7
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
      return {
        enhancedContent: text,
        suggestions: [],
        confidence: 0.5
      }
    }
  }

  async generateTitle(content: string): Promise<string> {
    try {
      const prompt = `Generate a concise, descriptive title for the following content. Return only the title, no quotes or extra text:\n\n${content}`
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text().trim().replace(/['"]/g, '')
    } catch (error) {
      console.error('Title generation error:', error)
      return 'Untitled'
    }
  }

  async generateTags(content: string): Promise<string[]> {
    try {
      const prompt = `Generate 3-5 relevant tags for the following content. Return only the tags separated by commas, no extra text:\n\n${content}`
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const tags = response.text().trim().split(',').map(tag => tag.trim().toLowerCase())
      
      return tags.filter(tag => tag.length > 0 && tag.length < 20)
    } catch (error) {
      console.error('Tag generation error:', error)
      return []
    }
  }

  async suggestImprovements(content: string): Promise<string[]> {
    try {
      const prompt = `Analyze the following content and provide 3-5 specific suggestions for improvement. Focus on clarity, structure, and engagement. Return each suggestion on a new line:\n\n${content}`
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const suggestions = response.text().trim().split('\n').filter(line => line.trim().length > 0)
      
      return suggestions.slice(0, 5)
    } catch (error) {
      console.error('Improvement suggestions error:', error)
      return []
    }
  }
}

export const aiService = new AIService()
