'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'

interface ColorPickerProps {
  onColorSelect: (color: string) => void
  className?: string
}

const colors = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#00CCFF', '#0066FF',
  '#6600FF', '#FF00CC', '#FF0066', '#CC6600', '#99CC00', '#00CC99',
  '#0099FF', '#6600CC', '#CC0099', '#FF3366', '#FF9933', '#CCFF33',
  '#33FF99', '#33CCFF', '#3366FF', '#9933FF', '#FF33CC', '#FF6699'
]

export function ColorPicker({ onColorSelect, className = "" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')

  const handleColorClick = (color: string) => {
    setSelectedColor(color)
    onColorSelect(color)
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
        <Palette className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-10 left-0 z-50 bg-white border rounded-lg shadow-lg p-2">
          <div className="grid grid-cols-6 gap-1 w-48">
            {colors.map((color) => (
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
