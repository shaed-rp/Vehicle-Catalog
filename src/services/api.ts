import { 
  SearchFilters, 
  SearchResult, 
  VehicleDetails, 
  FilterState, 
  VehiclePhoto, 
  PricingBreakdown,
  VehicleIdentification,
  DecodedBodyModel,
  ApiResponse,
  PaginatedResponse
} from '@/types'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// Generic API client
class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new ApiError(response.status, `API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Vehicle Search API
  async searchVehicles(filters: Partial<SearchFilters>): Promise<PaginatedResponse<SearchResult>> {
    return this.request<PaginatedResponse<SearchResult>>('/vehicles/search', {
      method: 'POST',
      body: JSON.stringify(filters),
    })
  }

  async getVehicleDetails(vehicleId: number): Promise<VehicleDetails> {
    return this.request<VehicleDetails>(`/vehicles/${vehicleId}`)
  }

  async getVehiclePhotos(vehicleId: number): Promise<VehiclePhoto[]> {
    return this.request<VehiclePhoto[]>(`/vehicles/${vehicleId}/photos`)
  }

  async getVehiclePricing(vehicleId: number): Promise<PricingBreakdown> {
    return this.request<PricingBreakdown>(`/vehicles/${vehicleId}/pricing`)
  }

  async getVehicleIdentifications(vehicleId: number): Promise<VehicleIdentification[]> {
    return this.request<VehicleIdentification[]>(`/vehicles/${vehicleId}/identifications`)
  }

  // Governance API
  async getAvailableYears(): Promise<FilterState['years']> {
    return this.request<FilterState['years']>('/governance/years')
  }

  async getMakesByYear(yearId: number): Promise<FilterState['makes']> {
    return this.request<FilterState['makes']>(`/governance/makes/${yearId}`)
  }

  async getModelsByYearMake(yearId: number, makeId: number): Promise<FilterState['models']> {
    return this.request<FilterState['models']>(`/governance/models/${yearId}/${makeId}`)
  }

  async getTrimsByYearMakeModel(yearId: number, makeId: number, modelId: number): Promise<FilterState['trims']> {
    return this.request<FilterState['trims']>(`/governance/trims/${yearId}/${makeId}/${modelId}`)
  }

  async getFilterState(filters: Partial<SearchFilters>): Promise<FilterState> {
    return this.request<FilterState>('/governance/filter-state', {
      method: 'POST',
      body: JSON.stringify(filters),
    })
  }

  // Body Model Decoding API
  async decodeBodyModelCode(code: number, makeId: number): Promise<DecodedBodyModel> {
    return this.request<DecodedBodyModel>('/decoding/decode', {
      method: 'POST',
      body: JSON.stringify({ code, makeId }),
    })
  }

  async getDecodingRules(makeId: number): Promise<any[]> {
    return this.request<any[]>(`/decoding/rules/${makeId}`)
  }

  async refreshDecodingCache(codeId?: number): Promise<void> {
    return this.request<void>('/decoding/cache/refresh', {
      method: 'POST',
      body: JSON.stringify({ codeId }),
    })
  }

  // Photo Management API
  async addVehiclePhoto(vehicleId: number, photoData: FormData): Promise<VehiclePhoto> {
    return this.request<VehiclePhoto>(`/vehicles/${vehicleId}/photos`, {
      method: 'POST',
      body: photoData,
      headers: {}, // Let browser set content-type for FormData
    })
  }

  async updatePhoto(photoId: number, updates: Partial<VehiclePhoto>): Promise<VehiclePhoto> {
    return this.request<VehiclePhoto>(`/photos/${photoId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async approvePhoto(photoId: number, approvedBy: string): Promise<void> {
    return this.request<void>(`/photos/${photoId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approvedBy }),
    })
  }

  async deletePhoto(photoId: number): Promise<void> {
    return this.request<void>(`/photos/${photoId}`, {
      method: 'DELETE',
    })
  }

  // Identification Management API
  async addVehicleIdentification(
    vehicleId: number, 
    identification: Omit<VehicleIdentification, 'type'> & { typeCode: string }
  ): Promise<VehicleIdentification> {
    return this.request<VehicleIdentification>(`/vehicles/${vehicleId}/identifications`, {
      method: 'POST',
      body: JSON.stringify(identification),
    })
  }

  async updateVehicleIdentification(
    vehicleId: number,
    type: string,
    value: string,
    updates: Partial<VehicleIdentification>
  ): Promise<VehicleIdentification> {
    return this.request<VehicleIdentification>(`/vehicles/${vehicleId}/identifications/${type}/${value}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async removeVehicleIdentification(vehicleId: number, type: string, value: string): Promise<void> {
    return this.request<void>(`/vehicles/${vehicleId}/identifications/${type}/${value}`, {
      method: 'DELETE',
    })
  }

  // Pricing Management API
  async updateVehiclePricing(vehicleId: number, pricing: PricingBreakdown): Promise<void> {
    return this.request<void>(`/vehicles/${vehicleId}/pricing`, {
      method: 'PUT',
      body: JSON.stringify(pricing),
    })
  }

  async addVehicleIncentive(
    vehicleId: number, 
    incentive: { programId: number; amount: number; effectiveDate: string; expirationDate?: string }
  ): Promise<void> {
    return this.request<void>(`/vehicles/${vehicleId}/incentives`, {
      method: 'POST',
      body: JSON.stringify(incentive),
    })
  }

  async removeVehicleIncentive(vehicleId: number, programId: number): Promise<void> {
    return this.request<void>(`/vehicles/${vehicleId}/incentives/${programId}`, {
      method: 'DELETE',
    })
  }

  // Purchase Order API
  async createPurchaseOrder(poData: {
    company: any
    items: any[]
    requestedDeliveryDate?: string
    specialInstructions?: string
    paymentTerms?: string
    shippingAddress?: any
  }): Promise<{ id: string }> {
    return this.request<{ id: string }>('/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(poData),
    })
  }

  async getPurchaseOrder(poId: string): Promise<any> {
    return this.request<any>(`/purchase-orders/${poId}`)
  }

  async updatePurchaseOrderStatus(poId: string, status: string): Promise<void> {
    return this.request<void>(`/purchase-orders/${poId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Analytics API
  async trackSearch(query: string, filters: Partial<SearchFilters>, results: number): Promise<void> {
    return this.request<void>('/analytics/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters, results }),
    })
  }

  async trackVehicleView(vehicleId: number, source: string): Promise<void> {
    return this.request<void>('/analytics/vehicle-view', {
      method: 'POST',
      body: JSON.stringify({ vehicleId, source }),
    })
  }

  async trackAddToCart(vehicleId: number, priceLevel: 3 | 4): Promise<void> {
    return this.request<void>('/analytics/add-to-cart', {
      method: 'POST',
      body: JSON.stringify({ vehicleId, priceLevel }),
    })
  }

  // Natural Language Search API
  async processNaturalLanguageQuery(query: string): Promise<{
    intent: string
    entities: any
    filters: Partial<SearchFilters>
    suggestions: any[]
  }> {
    return this.request<any>('/search/natural-language', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  }

  async getSearchSuggestions(query: string): Promise<any[]> {
    return this.request<any[]>(`/search/suggestions?q=${encodeURIComponent(query)}`)
  }

  // Cache Management API
  async getCacheStatus(): Promise<{
    filterCache: { size: number; lastUpdated: string }
    photoCache: { size: number; lastUpdated: string }
    vehicleCache: { size: number; lastUpdated: string }
  }> {
    return this.request<any>('/cache/status')
  }

  async clearCache(cacheType?: 'filter' | 'photo' | 'vehicle' | 'all'): Promise<void> {
    return this.request<void>('/cache/clear', {
      method: 'POST',
      body: JSON.stringify({ cacheType }),
    })
  }

  // Health Check API
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    database: boolean
    cache: boolean
    services: Record<string, boolean>
  }> {
    return this.request<any>('/health')
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Convenience functions for common operations
export const vehicleApi = {
  search: apiClient.searchVehicles.bind(apiClient),
  getDetails: apiClient.getVehicleDetails.bind(apiClient),
  getPhotos: apiClient.getVehiclePhotos.bind(apiClient),
  getPricing: apiClient.getVehiclePricing.bind(apiClient),
  getIdentifications: apiClient.getVehicleIdentifications.bind(apiClient),
}

export const governanceApi = {
  getYears: apiClient.getAvailableYears.bind(apiClient),
  getMakes: apiClient.getMakesByYear.bind(apiClient),
  getModels: apiClient.getModelsByYearMake.bind(apiClient),
  getTrims: apiClient.getTrimsByYearMakeModel.bind(apiClient),
  getFilterState: apiClient.getFilterState.bind(apiClient),
}

export const photoApi = {
  add: apiClient.addVehiclePhoto.bind(apiClient),
  update: apiClient.updatePhoto.bind(apiClient),
  approve: apiClient.approvePhoto.bind(apiClient),
  delete: apiClient.deletePhoto.bind(apiClient),
}

export const identificationApi = {
  add: apiClient.addVehicleIdentification.bind(apiClient),
  update: apiClient.updateVehicleIdentification.bind(apiClient),
  remove: apiClient.removeVehicleIdentification.bind(apiClient),
}

export const pricingApi = {
  update: apiClient.updateVehiclePricing.bind(apiClient),
  addIncentive: apiClient.addVehicleIncentive.bind(apiClient),
  removeIncentive: apiClient.removeVehicleIncentive.bind(apiClient),
}

export const purchaseOrderApi = {
  create: apiClient.createPurchaseOrder.bind(apiClient),
  get: apiClient.getPurchaseOrder.bind(apiClient),
  updateStatus: apiClient.updatePurchaseOrderStatus.bind(apiClient),
}

export const analyticsApi = {
  trackSearch: apiClient.trackSearch.bind(apiClient),
  trackVehicleView: apiClient.trackVehicleView.bind(apiClient),
  trackAddToCart: apiClient.trackAddToCart.bind(apiClient),
}

export const searchApi = {
  naturalLanguage: apiClient.processNaturalLanguageQuery.bind(apiClient),
  suggestions: apiClient.getSearchSuggestions.bind(apiClient),
}

export const cacheApi = {
  getStatus: apiClient.getCacheStatus.bind(apiClient),
  clear: apiClient.clearCache.bind(apiClient),
}

export const healthApi = {
  check: apiClient.healthCheck.bind(apiClient),
} 