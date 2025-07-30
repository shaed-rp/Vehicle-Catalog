'use client'

import { SearchResult, ViewMode } from '@/types'
import { VehicleCard } from './VehicleCard'
import { useAppStore } from '@/store/useAppStore'
import { Loader2, AlertCircle } from 'lucide-react'

interface VehicleGridProps {
  vehicles: SearchResult[]
  loading: boolean
  error?: string
  viewMode: ViewMode
}

export function VehicleGrid({ vehicles, loading, error, viewMode }: VehicleGridProps) {
  const { addToCart } = useAppStore()

  const handleAddToCart = (vehicleId: number, priceLevel: 3 | 4) => {
    addToCart(vehicleId, priceLevel)
  }

  const handleViewDetails = (vehicleId: number) => {
    // Navigate to vehicle details page
    console.log('View details for vehicle:', vehicleId)
  }

  const handleCompare = (vehicleId: number) => {
    // Add to comparison
    console.log('Add to comparison:', vehicleId)
  }

  const handleShare = (vehicleId: number) => {
    // Share vehicle
    console.log('Share vehicle:', vehicleId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Error loading vehicles: {error}</p>
        </div>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.vehicleId}
          vehicle={{
            id: vehicle.vehicleId,
            primaryIdentification: vehicle.primaryIdentification,
            primaryIdentificationType: 'spec_number',
            modelYear: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            trim: vehicle.trimName,
            bodyType: vehicle.bodyType,
            driveType: vehicle.driveType,
            introMsrp: vehicle.msrp,
            factoryDealerInvoice: vehicle.invoice,
            dealerNet: vehicle.dealerNet,
            identifications: [],
            photos: [],
            actualPhotoCount: 0,
            stockPhotoCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          }}
          pricing={{
            msrp: vehicle.msrp,
            factoryDealerInvoice: vehicle.invoice,
            dealerNet: vehicle.dealerNet,
            incentives: {
              level3: vehicle.incentiveAmount,
              level4: vehicle.incentiveAmount
            },
            effectivePrice: {
              level3: vehicle.effectivePrice,
              level4: vehicle.effectivePrice
            },
            savings: {
              level3: vehicle.incentiveAmount,
              level4: vehicle.incentiveAmount
            }
          }}
          viewMode={viewMode}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
          onCompare={handleCompare}
          onShare={handleShare}
        />
      ))}
    </div>
  )
} 