'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useVehicleSearch, useAvailableYears } from '@/hooks/useVehicles'
import { VehicleGrid } from '@/components/vehicles/VehicleGrid'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { SearchBar } from '@/components/search/SearchBar'
import { Button } from '@/components/ui/Button'
import { Grid, List, Filter, X } from 'lucide-react'
import { SearchFilters } from '@/types'

export default function HomePage() {
  const [searchFilters, setSearchFilters] = useState<Partial<SearchFilters>>({})
  const [showFilters, setShowFilters] = useState(false)
  const { setSearchResults, setSearchLoading, setSearchError, viewMode, setViewMode } = useAppStore()

  // Fetch available years for initial filter state
  const { data: years } = useAvailableYears()

  // Search vehicles
  const { data: searchData, isLoading, error } = useVehicleSearch(searchFilters)

  // Update store with search results
  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData.data)
    }
  }, [searchData, setSearchResults])

  useEffect(() => {
    setSearchLoading(isLoading)
  }, [isLoading, setSearchLoading])

  useEffect(() => {
    setSearchError(error?.message)
  }, [error, setSearchError])

  const handleSearch = (query: string) => {
    // Simple text search - could be enhanced with full-text search
    console.log('Search query:', query)
  }

  const handleNaturalLanguageQuery = (query: string) => {
    // Process natural language query
    console.log('Natural language query:', query)
    
    // Example: "Show me 2025 Nissan SUVs under $35k"
    const lowerQuery = query.toLowerCase()
    
    const newFilters: Partial<SearchFilters> = {}
    
    if (lowerQuery.includes('2025')) newFilters.yearId = 2025
    if (lowerQuery.includes('nissan')) newFilters.makeId = 1 // Assuming Nissan is ID 1
    if (lowerQuery.includes('suv')) newFilters.bodyTypeId = 2 // Assuming SUV is ID 2
    
    // Extract price range
    const priceMatch = lowerQuery.match(/under \$(\d+)k/)
    if (priceMatch) {
      newFilters.maxPrice = parseInt(priceMatch[1]) * 1000
    }
    
    setSearchFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleFilterChange = (filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }))
  }

  const handleFilterReset = () => {
    setSearchFilters({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Find Your Perfect
              <span className="text-blue-600"> Fleet Vehicle</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the complete Nissan fleet catalog with advanced search, 
              natural language queries, and comprehensive vehicle details.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar
                placeholder="Try: 'Show me 2025 Nissan SUVs under $35k'"
                onSearch={handleSearch}
                onNaturalLanguageQuery={handleNaturalLanguageQuery}
                suggestions={[]}
                filters={searchFilters}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(false)}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Close Filters
              </Button>
            </div>
            
            <FilterSidebar
              filterState={{
                years: years || [],
                makes: [],
                models: [],
                trims: [],
                bodyTypes: [],
                driveTypes: [],
                priceRange: { min: 0, max: 100000 },
                incentiveLevels: []
              }}
              selectedFilters={searchFilters}
              onFilterChange={handleFilterChange}
              onFilterReset={handleFilterReset}
              onFilterSave={(name) => console.log('Save filter:', name)}
              onFilterLoad={(name) => console.log('Load filter:', name)}
            />
          </div>

          {/* Vehicle Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {searchData?.totalCount || 0} vehicles found
              </div>
            </div>

            {/* Vehicle Grid */}
            <VehicleGrid
              vehicles={searchData?.data || []}
              loading={isLoading}
              error={error?.message}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 