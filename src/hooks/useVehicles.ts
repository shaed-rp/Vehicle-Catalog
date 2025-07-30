import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  vehicleApi, 
  governanceApi, 
  photoApi, 
  identificationApi, 
  pricingApi,
  analyticsApi 
} from '@/services/api'
import { 
  SearchFilters, 
  SearchResult, 
  VehicleDetails, 
  VehiclePhoto, 
  PricingBreakdown,
  VehicleIdentification,
  FilterState
} from '@/types'

// Query keys
export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: Partial<SearchFilters>) => [...vehicleKeys.lists(), filters] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: number) => [...vehicleKeys.details(), id] as const,
  photos: (id: number) => [...vehicleKeys.detail(id), 'photos'] as const,
  pricing: (id: number) => [...vehicleKeys.detail(id), 'pricing'] as const,
  identifications: (id: number) => [...vehicleKeys.detail(id), 'identifications'] as const,
}

export const governanceKeys = {
  all: ['governance'] as const,
  years: () => [...governanceKeys.all, 'years'] as const,
  makes: (yearId: number) => [...governanceKeys.all, 'makes', yearId] as const,
  models: (yearId: number, makeId: number) => [...governanceKeys.all, 'models', yearId, makeId] as const,
  trims: (yearId: number, makeId: number, modelId: number) => [...governanceKeys.all, 'trims', yearId, makeId, modelId] as const,
  filterState: (filters: Partial<SearchFilters>) => [...governanceKeys.all, 'filterState', filters] as const,
}

// Vehicle search hook
export const useVehicleSearch = (filters: Partial<SearchFilters>) => {
  return useQuery({
    queryKey: vehicleKeys.list(filters),
    queryFn: () => vehicleApi.search(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Vehicle details hook
export const useVehicleDetails = (vehicleId: number) => {
  return useQuery({
    queryKey: vehicleKeys.detail(vehicleId),
    queryFn: () => vehicleApi.getDetails(vehicleId),
    enabled: !!vehicleId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Vehicle photos hook
export const useVehiclePhotos = (vehicleId: number) => {
  return useQuery({
    queryKey: vehicleKeys.photos(vehicleId),
    queryFn: () => vehicleApi.getPhotos(vehicleId),
    enabled: !!vehicleId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Vehicle pricing hook
export const useVehiclePricing = (vehicleId: number) => {
  return useQuery({
    queryKey: vehicleKeys.pricing(vehicleId),
    queryFn: () => vehicleApi.getPricing(vehicleId),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Vehicle identifications hook
export const useVehicleIdentifications = (vehicleId: number) => {
  return useQuery({
    queryKey: vehicleKeys.identifications(vehicleId),
    queryFn: () => vehicleApi.getIdentifications(vehicleId),
    enabled: !!vehicleId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Governance hooks
export const useAvailableYears = () => {
  return useQuery({
    queryKey: governanceKeys.years(),
    queryFn: () => governanceApi.getYears(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useMakesByYear = (yearId: number) => {
  return useQuery({
    queryKey: governanceKeys.makes(yearId),
    queryFn: () => governanceApi.getMakes(yearId),
    enabled: !!yearId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useModelsByYearMake = (yearId: number, makeId: number) => {
  return useQuery({
    queryKey: governanceKeys.models(yearId, makeId),
    queryFn: () => governanceApi.getModels(yearId, makeId),
    enabled: !!yearId && !!makeId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useTrimsByYearMakeModel = (yearId: number, makeId: number, modelId: number) => {
  return useQuery({
    queryKey: governanceKeys.trims(yearId, makeId, modelId),
    queryFn: () => governanceApi.getTrims(yearId, makeId, modelId),
    enabled: !!yearId && !!makeId && !!modelId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useFilterState = (filters: Partial<SearchFilters>) => {
  return useQuery({
    queryKey: governanceKeys.filterState(filters),
    queryFn: () => governanceApi.getFilterState(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useAddVehiclePhoto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ vehicleId, photoData }: { vehicleId: number; photoData: FormData }) =>
      photoApi.add(vehicleId, photoData),
    onSuccess: (data, { vehicleId }) => {
      // Invalidate and refetch photos
      queryClient.invalidateQueries({ queryKey: vehicleKeys.photos(vehicleId) })
      
      // Optimistically update the photos list
      queryClient.setQueryData(vehicleKeys.photos(vehicleId), (old: VehiclePhoto[] = []) => [
        ...old,
        data
      ])
    },
  })
}

export const useUpdatePhoto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ photoId, updates }: { photoId: number; updates: Partial<VehiclePhoto> }) =>
      photoApi.update(photoId, updates),
    onSuccess: (data, { photoId }) => {
      // Find and update the photo in all vehicle photo lists
      queryClient.setQueriesData(
        { queryKey: vehicleKeys.photos.flat },
        (old: VehiclePhoto[] = []) => 
          old.map(photo => photo.id === photoId ? { ...photo, ...data } : photo)
      )
    },
  })
}

export const useApprovePhoto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ photoId, approvedBy }: { photoId: number; approvedBy: string }) =>
      photoApi.approve(photoId, approvedBy),
    onSuccess: (data, { photoId }) => {
      // Update photo approval status in all queries
      queryClient.setQueriesData(
        { queryKey: vehicleKeys.photos.flat },
        (old: VehiclePhoto[] = []) => 
          old.map(photo => 
            photo.id === photoId 
              ? { ...photo, isApproved: true, approvedBy: data.approvedBy, approvedAt: new Date() }
              : photo
          )
      )
    },
  })
}

export const useDeletePhoto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (photoId: number) => photoApi.delete(photoId),
    onSuccess: (data, photoId) => {
      // Remove photo from all vehicle photo lists
      queryClient.setQueriesData(
        { queryKey: vehicleKeys.photos.flat },
        (old: VehiclePhoto[] = []) => 
          old.filter(photo => photo.id !== photoId)
      )
    },
  })
}

export const useAddVehicleIdentification = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ vehicleId, identification }: { 
      vehicleId: number; 
      identification: Omit<VehicleIdentification, 'type'> & { typeCode: string } 
    }) => identificationApi.add(vehicleId, identification),
    onSuccess: (data, { vehicleId }) => {
      // Invalidate and refetch identifications
      queryClient.invalidateQueries({ queryKey: vehicleKeys.identifications(vehicleId) })
      
      // Optimistically update the identifications list
      queryClient.setQueryData(vehicleKeys.identifications(vehicleId), (old: VehicleIdentification[] = []) => [
        ...old,
        data
      ])
    },
  })
}

export const useUpdateVehicleIdentification = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ vehicleId, type, value, updates }: {
      vehicleId: number
      type: string
      value: string
      updates: Partial<VehicleIdentification>
    }) => identificationApi.update(vehicleId, type, value, updates),
    onSuccess: (data, { vehicleId }) => {
      // Invalidate and refetch identifications
      queryClient.invalidateQueries({ queryKey: vehicleKeys.identifications(vehicleId) })
    },
  })
}

export const useRemoveVehicleIdentification = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ vehicleId, type, value }: {
      vehicleId: number
      type: string
      value: string
    }) => identificationApi.remove(vehicleId, type, value),
    onSuccess: (data, { vehicleId }) => {
      // Invalidate and refetch identifications
      queryClient.invalidateQueries({ queryKey: vehicleKeys.identifications(vehicleId) })
    },
  })
}

export const useUpdateVehiclePricing = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ vehicleId, pricing }: { vehicleId: number; pricing: PricingBreakdown }) =>
      pricingApi.update(vehicleId, pricing),
    onSuccess: (data, { vehicleId }) => {
      // Invalidate and refetch pricing
      queryClient.invalidateQueries({ queryKey: vehicleKeys.pricing(vehicleId) })
    },
  })
}

export const useAddVehicleIncentive = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ vehicleId, incentive }: {
      vehicleId: number
      incentive: { programId: number; amount: number; effectiveDate: string; expirationDate?: string }
    }) => pricingApi.addIncentive(vehicleId, incentive),
    onSuccess: (data, { vehicleId }) => {
      // Invalidate and refetch pricing
      queryClient.invalidateQueries({ queryKey: vehicleKeys.pricing(vehicleId) })
    },
  })
}

export const useRemoveVehicleIncentive = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ vehicleId, programId }: { vehicleId: number; programId: number }) =>
      pricingApi.removeIncentive(vehicleId, programId),
    onSuccess: (data, { vehicleId }) => {
      // Invalidate and refetch pricing
      queryClient.invalidateQueries({ queryKey: vehicleKeys.pricing(vehicleId) })
    },
  })
}

// Analytics hooks
export const useTrackSearch = () => {
  return useMutation({
    mutationFn: ({ query, filters, results }: {
      query: string
      filters: Partial<SearchFilters>
      results: number
    }) => analyticsApi.trackSearch(query, filters, results),
  })
}

export const useTrackVehicleView = () => {
  return useMutation({
    mutationFn: ({ vehicleId, source }: { vehicleId: number; source: string }) =>
      analyticsApi.trackVehicleView(vehicleId, source),
  })
}

export const useTrackAddToCart = () => {
  return useMutation({
    mutationFn: ({ vehicleId, priceLevel }: { vehicleId: number; priceLevel: 3 | 4 }) =>
      analyticsApi.trackAddToCart(vehicleId, priceLevel),
  })
}

// Utility hooks
export const usePrefetchVehicleDetails = () => {
  const queryClient = useQueryClient()
  
  return (vehicleId: number) => {
    queryClient.prefetchQuery({
      queryKey: vehicleKeys.detail(vehicleId),
      queryFn: () => vehicleApi.getDetails(vehicleId),
      staleTime: 10 * 60 * 1000,
    })
  }
}

export const usePrefetchVehiclePhotos = () => {
  const queryClient = useQueryClient()
  
  return (vehicleId: number) => {
    queryClient.prefetchQuery({
      queryKey: vehicleKeys.photos(vehicleId),
      queryFn: () => vehicleApi.getPhotos(vehicleId),
      staleTime: 15 * 60 * 1000,
    })
  }
}

export const usePrefetchVehiclePricing = () => {
  const queryClient = useQueryClient()
  
  return (vehicleId: number) => {
    queryClient.prefetchQuery({
      queryKey: vehicleKeys.pricing(vehicleId),
      queryFn: () => vehicleApi.getPricing(vehicleId),
      staleTime: 5 * 60 * 1000,
    })
  }
} 