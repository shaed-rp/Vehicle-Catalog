'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Mic, X, ChevronDown } from 'lucide-react'
import { SearchSuggestion, SearchFilters } from '@/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  onNaturalLanguageQuery: (query: string) => void
  suggestions: SearchSuggestion[]
  filters: Partial<SearchFilters>
  className?: string
}

export function SearchBar({ 
  placeholder = "Search vehicles, models, or ask questions...",
  onSearch,
  onNaturalLanguageQuery,
  suggestions,
  filters,
  className
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedSuggestion(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
            handleSuggestionClick(suggestions[selectedSuggestion])
          } else {
            handleSearch()
          }
          break
        case 'Escape':
          setShowSuggestions(false)
          setSelectedSuggestion(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSuggestions, selectedSuggestion, suggestions])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedSuggestion(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (!query.trim()) return
    
    // Check if it's a natural language query
    const naturalLanguageKeywords = [
      'show me', 'find', 'search for', 'what', 'how', 'which', 'where',
      'under', 'over', 'between', 'around', 'near', 'with', 'without'
    ]
    
    const isNaturalLanguage = naturalLanguageKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    )
    
    if (isNaturalLanguage) {
      onNaturalLanguageQuery(query)
    } else {
      onSearch(query)
    }
    
    setQuery('')
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
    
    // Apply suggestion filter if it has a value
    if (suggestion.value) {
      // Handle different suggestion types
      switch (suggestion.type) {
        case 'year':
          // Update year filter
          break
        case 'make':
          // Update make filter
          break
        case 'model':
          // Update model filter
          break
        case 'bodyType':
          // Update body type filter
          break
        case 'price':
          // Update price filter
          break
        default:
          // Default search
          onSearch(suggestion.text)
      }
    } else {
      onSearch(suggestion.text)
    }
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    setShowSuggestions(value.length > 0)
    setSelectedSuggestion(-1)
  }

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        onNaturalLanguageQuery(transcript)
      }
      
      recognition.start()
    } else {
      alert('Speech recognition is not supported in this browser.')
    }
  }

  const clearQuery = () => {
    setQuery('')
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
    inputRef.current?.focus()
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {query && (
            <button
              onClick={clearQuery}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={handleVoiceSearch}
            className="p-1 text-gray-400 hover:text-gray-600 ml-1"
            title="Voice search"
          >
            <Mic className="h-4 w-4" />
          </button>
          
          <Button
            onClick={handleSearch}
            size="sm"
            className="ml-2"
            disabled={!query.trim()}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <div className="py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                  selectedSuggestion === index && "bg-gray-100"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{suggestion.text}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {suggestion.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null
            
            return (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {key}: {value}
                <button
                  onClick={() => {
                    // Remove filter logic
                    console.log('Remove filter:', key)
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
} 