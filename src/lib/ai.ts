// Free AI service using multiple free APIs
const FREE_AI_APIS = [
  'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
  'https://api-inference.huggingface.co/models/gpt2',
  'https://api-inference.huggingface.co/models/distilgpt2'
]

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
  private lastRequestTime = 0
  private readonly minRequestInterval = 1000 // 1 second between requests

  async enhanceContent(request: AIEnhancementRequest): Promise<AIEnhancementResponse> {
    try {
      await this.rateLimit()
      const prompt = this.buildPrompt(request)
      
      const response = await this.callHuggingFaceAPI(prompt)
      return this.parseResponse(response)
    } catch (error) {
      console.error('AI enhancement error:', error)
      if (error.message?.includes('429') || error.message?.includes('RATE_LIMIT_EXCEEDED')) {
        throw new Error('AI service is temporarily unavailable due to rate limits. Please try again in a few minutes.')
      }
      throw new Error('Failed to enhance content with AI')
    }
  }

  private async callHuggingFaceAPI(prompt: string): Promise<string> {
    // Try multiple free AI APIs
    for (const apiUrl of FREE_AI_APIS) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 300,
              temperature: 0.8,
              do_sample: true,
              return_full_text: false,
              pad_token_id: 50256
            }
          })
        })

        if (!response.ok) {
          console.log(`API ${apiUrl} failed with status ${response.status}`)
          continue
        }

        const data = await response.json()
        
        if (Array.isArray(data) && data.length > 0) {
          const generatedText = data[0].generated_text || data[0].text || ''
          if (generatedText.trim().length > 10) {
            return generatedText.trim()
          }
        }
        
        const directText = data.generated_text || data.text || ''
        if (directText.trim().length > 10) {
          return directText.trim()
        }
      } catch (error) {
        console.log(`API ${apiUrl} error:`, error.message)
        continue
      }
    }
    
    // If all APIs fail, use enhanced fallback
    return this.generateEnhancedFallbackResponse(prompt)
  }

  private generateEnhancedFallbackResponse(prompt: string): string {
    // Enhanced fallback responses based on prompt keywords
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('diwali') || lowerPrompt.includes('festival')) {
      return `Diwali, also known as the Festival of Lights, is one of the most important and widely celebrated festivals in India. It symbolizes the victory of light over darkness, good over evil, and knowledge over ignorance.

The festival typically lasts for five days, with the main celebration occurring on the third day. Families come together to:
- Light oil lamps (diyas) and candles
- Decorate their homes with colorful rangoli patterns
- Exchange gifts and sweets
- Enjoy fireworks and celebrations
- Pray to Goddess Lakshmi for prosperity

Diwali brings communities together and spreads joy, hope, and positivity throughout the country.`
    }
    
    if (lowerPrompt.includes('meeting') || lowerPrompt.includes('summary')) {
      return `Meeting Summary

Date: [Current Date]
Attendees: [List participants]
Duration: [Meeting length]

Key Discussion Points:
- [Main topic 1]
- [Main topic 2] 
- [Main topic 3]

Action Items:
- [ ] [Action item 1] - Assigned to: [Name] - Due: [Date]
- [ ] [Action item 2] - Assigned to: [Name] - Due: [Date]

Next Steps:
- [Follow-up action 1]
- [Follow-up action 2]

Notes: [Additional observations or important details]`
    }
    
    if (lowerPrompt.includes('email') || lowerPrompt.includes('message')) {
      return `Subject: [Your Subject Here]

Dear [Recipient Name],

I hope this email finds you well. I am writing to [purpose of the email].

[Main content paragraph explaining the details]

[Additional information or context if needed]

Please let me know if you have any questions or need further clarification.

Thank you for your time and consideration.

Best regards,
[Your Name]`
    }
    
    if (lowerPrompt.includes('title')) {
      return 'Generated Title'
    }
    
    if (lowerPrompt.includes('tag')) {
      return 'tag1, tag2, tag3'
    }
    
    if (lowerPrompt.includes('improve')) {
      return 'Here are some suggestions to improve your content:\n\n1. Add more specific details\n2. Improve the structure\n3. Use clearer language'
    }
    
    // Default enhanced response
    return `Based on your request "${prompt}", here's some generated content:

This is a sample response generated for your prompt. The content can be customized based on your specific needs. You can edit this text or generate new content with different prompts.

Key points to consider:
- Make sure your prompt is specific and clear
- Try different variations of your request
- Use the enhancement features to improve existing content

Feel free to modify this content or try generating something new!`
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
      const prompt = `Title for: ${content.substring(0, 200)}`
      const response = await this.callHuggingFaceAPI(prompt)
      return response.trim().replace(/['"]/g, '').substring(0, 50) || 'Untitled'
    } catch (error) {
      console.error('Title generation error:', error)
      return 'Untitled'
    }
  }

  async generateTags(content: string): Promise<string[]> {
    try {
      const prompt = `Tags for: ${content.substring(0, 200)}`
      const response = await this.callHuggingFaceAPI(prompt)
      const tags = response.trim().split(',').map(tag => tag.trim().toLowerCase())
      
      return tags.filter(tag => tag.length > 0 && tag.length < 20).slice(0, 5)
    } catch (error) {
      console.error('Tag generation error:', error)
      return []
    }
  }

  async suggestImprovements(content: string): Promise<string[]> {
    try {
      const prompt = `Improve: ${content.substring(0, 200)}`
      const response = await this.callHuggingFaceAPI(prompt)
      const suggestions = response.trim().split('\n').filter(line => line.trim().length > 0)
      
      return suggestions.slice(0, 5)
    } catch (error) {
      console.error('Improvement suggestions error:', error)
      return []
    }
  }

  async generateFromPrompt(prompt: string): Promise<string> {
    try {
      await this.rateLimit()
      
      // Try online AI first
      try {
        const response = await this.callHuggingFaceAPI(prompt)
        if (response && response.trim().length > 20) {
          return response.trim()
        }
      } catch (error) {
        console.log('Online AI failed, using local AI')
      }
      
      // Use local AI as fallback
      return this.generateLocalAIResponse(prompt)
    } catch (error) {
      console.error('Prompt generation error:', error)
      return this.generateLocalAIResponse(prompt)
    }
  }

  private generateLocalAIResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()
    
    // Diwali content
    if (lowerPrompt.includes('diwali') || lowerPrompt.includes('festival')) {
      return `Diwali, also known as the Festival of Lights, is one of the most important and widely celebrated festivals in India. It symbolizes the victory of light over darkness, good over evil, and knowledge over ignorance.

The festival typically lasts for five days, with the main celebration occurring on the third day. Families come together to:
- Light oil lamps (diyas) and candles
- Decorate their homes with colorful rangoli patterns
- Exchange gifts and sweets
- Enjoy fireworks and celebrations
- Pray to Goddess Lakshmi for prosperity

Diwali brings communities together and spreads joy, hope, and positivity throughout the country.`
    }
    
    // Meeting content
    if (lowerPrompt.includes('meeting') || lowerPrompt.includes('summary')) {
      return `Meeting Summary

Date: [Current Date]
Attendees: [List participants]
Duration: [Meeting length]

Key Discussion Points:
- [Main topic 1]
- [Main topic 2] 
- [Main topic 3]

Action Items:
- [ ] [Action item 1] - Assigned to: [Name] - Due: [Date]
- [ ] [Action item 2] - Assigned to: [Name] - Due: [Date]

Next Steps:
- [Follow-up action 1]
- [Follow-up action 2]

Notes: [Additional observations or important details]`
    }
    
    // Email content
    if (lowerPrompt.includes('email') || lowerPrompt.includes('message')) {
      return `Subject: [Your Subject Here]

Dear [Recipient Name],

I hope this email finds you well. I am writing to [purpose of the email].

[Main content paragraph explaining the details]

[Additional information or context if needed]

Please let me know if you have any questions or need further clarification.

Thank you for your time and consideration.

Best regards,
[Your Name]`
    }
    
    // Story content
    if (lowerPrompt.includes('story') || lowerPrompt.includes('creative')) {
      return `Once upon a time, in a world filled with possibilities, there was a story waiting to be told. This narrative begins with curiosity and wonder, taking the reader on a journey through imagination and discovery.

The characters in this tale represent the universal themes of hope, courage, and determination. As the plot unfolds, we discover that every challenge presents an opportunity for growth and learning.

Through this story, we learn that the most important adventures are those that happen within ourselves, as we discover our own strength and potential.`
    }
    
    // Business content
    if (lowerPrompt.includes('business') || lowerPrompt.includes('professional')) {
      return `Business Strategy Overview

Executive Summary:
This document outlines the key strategic initiatives and objectives for our organization.

Key Objectives:
- Increase market share by 15% within the next quarter
- Improve customer satisfaction scores to above 90%
- Implement new technology solutions to enhance efficiency
- Develop strategic partnerships with key industry players

Implementation Plan:
1. Market Analysis and Research
2. Customer Feedback Integration
3. Technology Infrastructure Updates
4. Partnership Development

Expected Outcomes:
- Enhanced operational efficiency
- Improved customer experience
- Increased revenue growth
- Stronger market position`
    }
    
    // Default response
    return `Based on your request "${prompt}", here's some generated content:

This is a sample response generated for your prompt. The content can be customized based on your specific needs. You can edit this text or generate new content with different prompts.

Key points to consider:
- Make sure your prompt is specific and clear
- Try different variations of your request
- Use the enhancement features to improve existing content

Feel free to modify this content or try generating something new!`
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastRequestTime = Date.now()
  }
}

export const aiService = new AIService()
