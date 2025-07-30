'use client'

import { useState } from 'react'
import { 
  ShoppingCart, 
  Eye, 
  Share2, 
  Scale, 
  ChevronDown, 
  ChevronUp,
  Car,
  Calendar,
  MapPin
} from 'lucide-react'
import { VehicleDetails, PricingBreakdown, ViewMode } from '@/types'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface VehicleCardProps {
  vehicle: VehicleDetails
  pricing: PricingBreakdown
  viewMode: ViewMode
  onAddToCart: (vehicleId: number, priceLevel: 3 | 4) => void
  onViewDetails: (vehicleId: number) => void
  onCompare: (vehicleId: number) => void
  onShare: (vehicleId: number) => void
}

export function VehicleCard({ 
  vehicle, 
  pricing, 
  viewMode, 
  onAddToCart, 
  onViewDetails, 
  onCompare, 
  onShare 
}: VehicleCardProps) {
  const [showPricingDetails, setShowPricingDetails] = useState(false)
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<3 | 4>(3)

  const isListView = viewMode === 'list'

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md",
      isListView ? "flex" : "flex flex-col"
    )}>
      {/* Vehicle Image */}
      <div className={cn(
        "relative",
        isListView ? "w-48 h-32 flex-shrink-0" : "aspect-video"
      )}>
        {vehicle.primaryPhotoUrl ? (
          <img
            src={vehicle.primaryPhotoUrl}
            alt={`${vehicle.modelYear} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Car className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={() => onCompare(vehicle.id)}
          >
            <Scale className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={() => onShare(vehicle.id)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className={cn(
        "p-4 flex-1",
        isListView ? "flex flex-col justify-between" : ""
      )}>
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                {vehicle.modelYear} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-600">
                {vehicle.trim} • {vehicle.driveType}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Spec #{vehicle.primaryIdentification}</div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {vehicle.modelYear}
            </div>
            <div className="flex items-center">
              <Car className="h-3 w-3 mr-1" />
              {vehicle.bodyType}
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {vehicle.driveType}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-3">
          {/* Price Level Selector */}
          <div className="flex space-x-1">
            <Button
              variant={selectedPriceLevel === 3 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPriceLevel(3)}
              className="flex-1 text-xs"
            >
              Level 3
            </Button>
            <Button
              variant={selectedPriceLevel === 4 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPriceLevel(4)}
              className="flex-1 text-xs"
            >
              Level 4
            </Button>
          </div>

          {/* Price Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(pricing.effectivePrice[`level${selectedPriceLevel}` as keyof typeof pricing.effectivePrice])}
            </div>
            <div className="text-sm text-gray-500">
              <span className="line-through">{formatCurrency(pricing.msrp)}</span>
              <span className="text-green-600 ml-2">
                -{formatCurrency(pricing.savings[`level${selectedPriceLevel}` as keyof typeof pricing.savings])}
              </span>
            </div>
          </div>

          {/* Pricing Details Toggle */}
          <button
            onClick={() => setShowPricingDetails(!showPricingDetails)}
            className="w-full text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center"
          >
            {showPricingDetails ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show Details
              </>
            )}
          </button>

          {/* Pricing Details */}
          {showPricingDetails && (
            <div className="bg-gray-50 rounded p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span>MSRP:</span>
                <span>{formatCurrency(pricing.msrp)}</span>
              </div>
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span>{formatCurrency(pricing.factoryDealerInvoice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Dealer Net:</span>
                <span>{formatCurrency(pricing.dealerNet)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Level {selectedPriceLevel} Incentive:</span>
                <span>-{formatCurrency(pricing.incentives[`level${selectedPriceLevel}` as keyof typeof pricing.incentives])}</span>
              </div>
              <div className="border-t pt-1 flex justify-between font-semibold">
                <span>Your Price:</span>
                <span>{formatCurrency(pricing.effectivePrice[`level${selectedPriceLevel}` as keyof typeof pricing.effectivePrice])}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-4">
          <Button
            onClick={() => onAddToCart(vehicle.id, selectedPriceLevel)}
            className="flex-1"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            onClick={() => onViewDetails(vehicle.id)}
            size="sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 