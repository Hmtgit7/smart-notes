'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Highlighter } from 'lucide-react'

interface HighlightPickerProps {
  onHighlightSelect: (color: string) => void
  className?: string
}

const highlightColors = [
  '#FFFF00', '#FFE066', '#FFCC99', '#FFB3B3', '#B3D9FF', '#B3FFB3',
  '#FFB3E6', '#E6B3FF', '#B3E6FF', '#FFE6B3', '#E6FFB3', '#B3FFE6',
  '#FFD9B3', '#D9B3FF', '#B3D9FF', '#FFB3D9', '#E6FFD9', '#D9FFE6'
]

export function HighlightPicker({ onHighlightSelect, className = "" }: HighlightPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#FFFF00')

  const handleColorClick = (color: string) => {
    setSelectedColor(color)
    onHighlightSelect(color)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <Highlighter className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-10 left-0 z-50 bg-white border rounded-lg shadow-lg p-2">
          <div className="grid grid-cols-6 gap-1 w-48">
            {highlightColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorClick(color)}
                className={`w-6 h-6 rounded border-2 ${
                  selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                } hover:border-gray-600`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
