'use client'

import { useState } from 'react'
import { X, Filter, Save, Download } from 'lucide-react'
import { FilterState, SearchFilters } from '@/types'
import { Button } from '@/components/ui/Button'
import { FilterSection } from './FilterSection'

interface FilterSidebarProps {
  filterState: FilterState
  selectedFilters: Partial<SearchFilters>
  onFilterChange: (filters: Partial<SearchFilters>) => void
  onFilterReset: () => void
  onFilterSave: (name: string) => void
  onFilterLoad: (name: string) => void
}

export function FilterSidebar({
  filterState,
  selectedFilters,
  onFilterChange,
  onFilterReset,
  onFilterSave,
  onFilterLoad
}: FilterSidebarProps) {
  const [savedFilterName, setSavedFilterName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFilterChange({ [key]: value })
  }

  const handleSaveFilter = () => {
    if (savedFilterName.trim()) {
      onFilterSave(savedFilterName)
      setSavedFilterName('')
      setShowSaveDialog(false)
    }
  }

  const activeFilterCount = Object.keys(selectedFilters).filter(key => selectedFilters[key as keyof SearchFilters] !== undefined).length

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterReset}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-medium mb-4">Save Filter</h3>
            <input
              type="text"
              placeholder="Enter filter name"
              value={savedFilterName}
              onChange={(e) => setSavedFilterName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveFilter()
                if (e.key === 'Escape') setShowSaveDialog(false)
              }}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSaveFilter} disabled={!savedFilterName.trim()}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Year Filter */}
        <FilterSection
          title="Year"
          options={filterState.years.map(year => ({
            id: year.yearId,
            label: year.year.toString(),
            count: year.vehicleCount
          }))}
          selectedValue={selectedFilters.yearId}
          onChange={(value) => handleFilterChange('yearId', value)}
        />

        {/* Make Filter */}
        <FilterSection
          title="Make"
          options={filterState.makes.map(make => ({
            id: make.makeId,
            label: make.makeName,
            count: make.vehicleCount
          }))}
          selectedValue={selectedFilters.makeId}
          onChange={(value) => handleFilterChange('makeId', value)}
          disabled={!selectedFilters.yearId}
        />

        {/* Model Filter */}
        <FilterSection
          title="Model"
          options={filterState.models.map(model => ({
            id: model.modelId,
            label: model.modelName,
            count: model.vehicleCount
          }))}
          selectedValue={selectedFilters.modelId}
          onChange={(value) => handleFilterChange('modelId', value)}
          disabled={!selectedFilters.makeId}
        />

        {/* Body Type Filter */}
        <FilterSection
          title="Body Type"
          options={filterState.bodyTypes.map(bodyType => ({
            id: bodyType.bodyTypeId,
            label: bodyType.bodyTypeName,
            count: bodyType.vehicleCount
          }))}
          selectedValue={selectedFilters.bodyTypeId}
          onChange={(value) => handleFilterChange('bodyTypeId', value)}
        />

        {/* Drive Type Filter */}
        <FilterSection
          title="Drive Type"
          options={filterState.driveTypes.map(driveType => ({
            id: driveType.driveTypeId,
            label: driveType.driveTypeName,
            count: driveType.vehicleCount
          }))}
          selectedValue={selectedFilters.driveTypeId}
          onChange={(value) => handleFilterChange('driveTypeId', value)}
        />

        {/* Price Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="Min"
                value={selectedFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="Max"
                value={selectedFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Incentive Level Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Incentive Level</h4>
          <div className="space-y-2">
            {filterState.incentiveLevels.map(level => (
              <label key={level.level} className="flex items-center">
                <input
                  type="radio"
                  name="incentiveLevel"
                  value={level.level}
                  checked={selectedFilters.incentiveLevel === level.level}
                  onChange={(e) => handleFilterChange('incentiveLevel', Number(e.target.value))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{level.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Advanced</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.hasPhotos || false}
                onChange={(e) => handleFilterChange('hasPhotos', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Has Photos</span>
            </label>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterReset}
            className="w-full"
          >
            Clear All Filters
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Export filters
              const filterData = JSON.stringify(selectedFilters, null, 2)
              const blob = new Blob([filterData], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'vehicle-filters.json'
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Filters
          </Button>
        </div>
      </div>
    </div>
  )
} 