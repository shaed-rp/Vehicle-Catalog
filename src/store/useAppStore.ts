import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  AppState, 
  SearchFilters, 
  SearchResult, 
  Cart, 
  CartItem, 
  VehicleDetails, 
  FilterState, 
  ChatMessage,
  ViewMode,
  PriceLevel 
} from '@/types'

interface AppStore extends AppState {
  // Search actions
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  setSearchResults: (results: SearchResult[]) => void
  setSearchLoading: (loading: boolean) => void
  setSearchError: (error?: string) => void
  
  // Cart actions
  addToCart: (vehicleId: number, priceLevel: PriceLevel, quantity?: number) => void
  removeFromCart: (vehicleId: number) => void
  updateCartQuantity: (vehicleId: number, quantity: number) => void
  clearCart: () => void
  setCartOpen: (open: boolean) => void
  
  // UI actions
  setViewMode: (mode: ViewMode) => void
  toggleVehicleSelection: (vehicleId: number) => void
  setSelectedVehicles: (vehicleIds: number[]) => void
  setComparisonMode: (enabled: boolean) => void
  
  // Filter actions
  setFilterState: (state: FilterState) => void
  saveFilter: (name: string, filters: Partial<SearchFilters>) => void
  loadFilter: (name: string) => Partial<SearchFilters> | null
  getSavedFilters: () => Record<string, Partial<SearchFilters>>
  
  // Photo actions
  setSelectedPhoto: (photo?: VehicleDetails) => void
  setPhotoGalleryOpen: (open: boolean) => void
  
  // Chat actions
  setChatOpen: (open: boolean) => void
  addChatMessage: (message: ChatMessage) => void
  clearChatHistory: () => void
  
  // Utility actions
  reset: () => void
}

const initialState: AppState = {
  // Search state
  searchFilters: {},
  searchResults: [],
  searchLoading: false,
  searchError: undefined,
  
  // Cart state
  cart: {
    items: [],
    totalValue: 0,
    totalSavings: 0,
    totalEffectiveValue: 0
  },
  cartOpen: false,
  
  // UI state
  viewMode: 'grid',
  selectedVehicles: [],
  comparisonMode: false,
  
  // Filter state
  filterState: {
    years: [],
    makes: [],
    models: [],
    trims: [],
    bodyTypes: [],
    driveTypes: [],
    priceRange: { min: 0, max: 100000 },
    incentiveLevels: []
  },
  savedFilters: {},
  
  // Photo state
  selectedPhoto: undefined,
  photoGalleryOpen: false,
  
  // Chat state
  chatOpen: false,
  chatHistory: []
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Search actions
      setSearchFilters: (filters) => set({ searchFilters: { ...get().searchFilters, ...filters } }),
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchLoading: (loading) => set({ searchLoading: loading }),
      setSearchError: (error) => set({ searchError: error }),
      
      // Cart actions
      addToCart: (vehicleId, priceLevel, quantity = 1) => {
        const { cart, searchResults } = get()
        const vehicle = searchResults.find(v => v.vehicleId === vehicleId)
        
        if (!vehicle) return
        
        // Check if vehicle already in cart
        const existingItem = cart.items.find(item => item.vehicleId === vehicleId && item.priceLevel === priceLevel)
        
        if (existingItem) {
          // Update quantity
          const updatedItems = cart.items.map(item => 
            item.vehicleId === vehicleId && item.priceLevel === priceLevel
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
          
          const updatedCart = calculateCartTotals(updatedItems)
          set({ cart: updatedCart })
        } else {
          // Add new item
          const newItem: CartItem = {
            vehicleId,
            vehicle: {
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
            },
            quantity,
            priceLevel,
            pricing: {
              msrp: vehicle.msrp,
              factoryDealerInvoice: vehicle.invoice,
              dealerNet: vehicle.dealerNet,
              incentives: {
                level3: priceLevel === 3 ? vehicle.incentiveAmount : 0,
                level4: priceLevel === 4 ? vehicle.incentiveAmount : 0
              },
              effectivePrice: {
                level3: vehicle.dealerNet - (priceLevel === 3 ? vehicle.incentiveAmount : 0),
                level4: vehicle.dealerNet - (priceLevel === 4 ? vehicle.incentiveAmount : 0)
              },
              savings: {
                level3: priceLevel === 3 ? vehicle.incentiveAmount : 0,
                level4: priceLevel === 4 ? vehicle.incentiveAmount : 0
              }
            },
            identifications: [],
            photos: [],
            unitPrice: vehicle.dealerNet - vehicle.incentiveAmount,
            totalPrice: (vehicle.dealerNet - vehicle.incentiveAmount) * quantity,
            savings: vehicle.incentiveAmount * quantity,
            effectivePrice: vehicle.dealerNet - vehicle.incentiveAmount
          }
          
          const updatedItems = [...cart.items, newItem]
          const updatedCart = calculateCartTotals(updatedItems)
          set({ cart: updatedCart })
        }
      },
      
      removeFromCart: (vehicleId) => {
        const { cart } = get()
        const updatedItems = cart.items.filter(item => item.vehicleId !== vehicleId)
        const updatedCart = calculateCartTotals(updatedItems)
        set({ cart: updatedCart })
      },
      
      updateCartQuantity: (vehicleId, quantity) => {
        const { cart } = get()
        const updatedItems = cart.items.map(item => 
          item.vehicleId === vehicleId 
            ? { ...item, quantity, totalPrice: item.unitPrice * quantity, savings: item.savings * quantity }
            : item
        )
        const updatedCart = calculateCartTotals(updatedItems)
        set({ cart: updatedCart })
      },
      
      clearCart: () => set({ 
        cart: {
          items: [],
          totalValue: 0,
          totalSavings: 0,
          totalEffectiveValue: 0
        }
      }),
      
      setCartOpen: (open) => set({ cartOpen: open }),
      
      // UI actions
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleVehicleSelection: (vehicleId) => {
        const { selectedVehicles } = get()
        const updated = selectedVehicles.includes(vehicleId)
          ? selectedVehicles.filter(id => id !== vehicleId)
          : [...selectedVehicles, vehicleId]
        set({ selectedVehicles: updated })
      },
      setSelectedVehicles: (vehicleIds) => set({ selectedVehicles: vehicleIds }),
      setComparisonMode: (enabled) => set({ comparisonMode: enabled }),
      
      // Filter actions
      setFilterState: (state) => set({ filterState: state }),
      saveFilter: (name, filters) => {
        const { savedFilters } = get()
        set({ savedFilters: { ...savedFilters, [name]: filters } })
      },
      loadFilter: (name) => {
        const { savedFilters } = get()
        return savedFilters[name] || null
      },
      getSavedFilters: () => {
        const { savedFilters } = get()
        return savedFilters
      },
      
      // Photo actions
      setSelectedPhoto: (photo) => set({ selectedPhoto: photo }),
      setPhotoGalleryOpen: (open) => set({ photoGalleryOpen: open }),
      
      // Chat actions
      setChatOpen: (open) => set({ chatOpen: open }),
      addChatMessage: (message) => {
        const { chatHistory } = get()
        set({ chatHistory: [...chatHistory, message] })
      },
      clearChatHistory: () => set({ chatHistory: [] }),
      
      // Utility actions
      reset: () => set(initialState)
    }),
    {
      name: 'nissan-fleet-store',
      partialize: (state) => ({
        cart: state.cart,
        viewMode: state.viewMode,
        savedFilters: state.savedFilters,
        chatHistory: state.chatHistory
      })
    }
  )
)

// Helper function to calculate cart totals
function calculateCartTotals(items: CartItem[]): Cart {
  const totalValue = items.reduce((sum, item) => sum + (item.pricing.msrp * item.quantity), 0)
  const totalSavings = items.reduce((sum, item) => sum + item.savings, 0)
  const totalEffectiveValue = items.reduce((sum, item) => sum + item.totalPrice, 0)
  
  return {
    items,
    totalValue,
    totalSavings,
    totalEffectiveValue
  }
}

// Selector hooks for better performance
export const useSearchFilters = () => useAppStore(state => state.searchFilters)
export const useSearchResults = () => useAppStore(state => state.searchResults)
export const useSearchLoading = () => useAppStore(state => state.searchLoading)
export const useCart = () => useAppStore(state => state.cart)
export const useCartOpen = () => useAppStore(state => state.cartOpen)
export const useViewMode = () => useAppStore(state => state.viewMode)
export const useSelectedVehicles = () => useAppStore(state => state.selectedVehicles)
export const useFilterState = () => useAppStore(state => state.filterState)
export const useChatOpen = () => useAppStore(state => state.chatOpen) 