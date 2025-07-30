'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface FilterOption {
  id: number
  label: string
  count: number
}

interface FilterSectionProps {
  title: string
  options: FilterOption[]
  selectedValue?: number
  onChange: (value: number | undefined) => void
  disabled?: boolean
}

export function FilterSection({ 
  title, 
  options, 
  selectedValue, 
  onChange, 
  disabled = false 
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (disabled || options.length === 0) {
    return (
      <div className="opacity-50">
        <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
        <p className="text-xs text-gray-500">No options available</p>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3"
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <label key={option.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="radio"
                  name={title.toLowerCase().replace(/\s+/g, '-')}
                  value={option.id}
                  checked={selectedValue === option.id}
                  onChange={(e) => onChange(Number(e.target.value))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
              <span className="text-xs text-gray-500">({option.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
} 