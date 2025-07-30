// =====================================================
// CORE VEHICLE TYPES
// =====================================================

export interface Vehicle {
  id: number
  bodyModelCodeId?: number
  modelYearId: number
  makeId: number
  modelId: number
  trimId: number
  bodyTypeId: number
  driveTypeId: number
  primaryIdentificationId?: number
  createdAt: Date
  updatedAt: Date
}

export interface VehicleDetails {
  id: number
  primaryIdentification: string
  primaryIdentificationType: string
  vin?: string
  identifications: VehicleIdentification[]
  primaryPhotoUrl?: string
  actualPhotoCount: number
  stockPhotoCount: number
  bodyModel?: number
  bodyModelDescription?: string
  bodyModelInfo?: DecodedBodyModel
  modelYear: number
  make: string
  makeLogoUrl?: string
  model: string
  trim: string
  bodyType: string
  driveType: string
  introMsrp?: number
  factoryDealerInvoice?: number
  dealerNet?: number
  createdAt: Date
  updatedAt: Date
}

// =====================================================
// IDENTIFICATION SYSTEM
// =====================================================

export interface VehicleIdentification {
  type: 'vin' | 'spec_number' | 'stock_number' | 'asset_number' | 'order_number' | 'purchase_order' | 'quote_number' | 'invoice_number' | 'internal_id'
  value: string
  isPrimary: boolean
  issuedBy?: string
  issuedDate?: Date
  metadata?: Record<string, any>
}

export interface IdentificationType {
  id: number
  typeCode: string
  typeName: string
  description?: string
  isSystemGenerated: boolean
  requiresUnique: boolean
  isActive: boolean
}

// =====================================================
// BODY MODEL CODE SYSTEM
// =====================================================

export interface BodyModelCode {
  id: number
  code: number
  makeId: number
  modelId: number
  description?: string
  isActive: boolean
  decodedCache?: DecodedBodyModel
  decodedCacheUpdatedAt?: Date
}

export interface DecodedBodyModel {
  originalCode: number
  makeId: number
  seriesCode?: number
  seriesName?: string
  vehicleType?: string
  trimLevel?: string
  trimTier?: number
  drivetrain?: string
  drivetrainCode?: string
  decodedAt: Date
  decoderVersion: string
}

export interface DecodeRule {
  id: number
  makeId: number
  ruleName: string
  ruleType: 'range' | 'pattern' | 'exact' | 'function'
  priority: number
  conditions: Record<string, any>
  decodeLogic: Record<string, any>
  isActive: boolean
  effectiveDate: Date
  expirationDate?: Date
}

// =====================================================
// PRICING & INCENTIVES
// =====================================================

export interface VehiclePricing {
  id: number
  vehicleId: number
  introMsrp: number
  factoryDealerInvoice: number
  dealerNet: number
}

export interface IncentiveProgram {
  id: number
  name: string
  level: 3 | 4
  description?: string
  isActive: boolean
}

export interface VehicleIncentive {
  id: number
  vehicleId: number
  incentiveProgramId: number
  incentiveAmount: number
  effectiveDate: Date
  expirationDate?: Date
}

export interface PricingBreakdown {
  msrp: number
  factoryDealerInvoice: number
  dealerNet: number
  incentives: {
    level3: number
    level4: number
  }
  effectivePrice: {
    level3: number
    level4: number
  }
  savings: {
    level3: number
    level4: number
  }
}

// =====================================================
// PHOTO SYSTEM
// =====================================================

export interface PhotoType {
  id: number
  typeCode: string
  typeName: string
  description?: string
  isActive: boolean
}

export interface PhotoViewAngle {
  id: number
  angleCode: string
  angleName: string
  description?: string
  sortOrder: number
  isActive: boolean
}

export interface StockPhoto {
  id: number
  modelYearId: number
  makeId: number
  modelId: number
  trimId?: number
  bodyTypeId?: number
  photoTypeId: number
  viewAngleId?: number
  url: string
  thumbnailUrl?: string
  cdnUrl?: string
  fileName?: string
  fileSizeBytes?: number
  widthPx?: number
  heightPx?: number
  mimeType?: string
  isPrimary: boolean
  displayOrder: number
  colorCode?: string
  colorName?: string
  photographer?: string
  copyrightInfo?: string
  altText?: string
  caption?: string
  isActive: boolean
  validFrom: Date
  validUntil?: Date
}

export interface VehiclePhoto {
  id: number
  vehicleId: number
  photoTypeId: number
  viewAngleId?: number
  url: string
  thumbnailUrl?: string
  cdnUrl?: string
  fileName?: string
  fileSizeBytes?: number
  widthPx?: number
  heightPx?: number
  mimeType?: string
  isPrimary: boolean
  displayOrder: number
  takenDate?: Date
  photographer?: string
  location?: string
  notes?: string
  altText?: string
  isActive: boolean
  isApproved: boolean
  approvedBy?: string
  approvedAt?: Date
}

export interface PhotoCollection {
  id: number
  collectionName: string
  collectionType?: string
  description?: string
  isActive: boolean
}

export interface PhotoCollectionItem {
  id: number
  collectionId: number
  stockPhotoId?: number
  vehiclePhotoId?: number
  displayOrder: number
  caption?: string
}

// =====================================================
// GOVERNANCE SYSTEM
// =====================================================

export interface ModelYear {
  id: number
  year: number
}

export interface Make {
  id: number
  name: string
  logoUrl?: string
}

export interface Model {
  id: number
  makeId: number
  name: string
}

export interface Trim {
  id: number
  name: string
}

export interface BodyType {
  id: number
  name: string
}

export interface DriveType {
  id: number
  name: string
}

export interface ModelYearMake {
  id: number
  modelYearId: number
  makeId: number
  isActive: boolean
  effectiveDate: Date
  expirationDate?: Date
}

export interface ModelYearMakeModel {
  id: number
  modelYearMakeId: number
  modelId: number
  isActive: boolean
  launchDate?: Date
  discontinueDate?: Date
}

export interface ModelYearMakeModelTrim {
  id: number
  modelYearMakeModelId: number
  trimId: number
  isActive: boolean
  trimLevelOrder?: number
}

// =====================================================
// SEARCH & FILTERS
// =====================================================

export interface SearchFilters {
  // Basic filters
  yearId?: number
  makeId?: number
  modelId?: number
  trimId?: number
  driveTypeId?: number
  bodyTypeId?: number
  
  // Advanced filters
  bodyModelCodeId?: number
  minPrice?: number
  maxPrice?: number
  incentiveLevel?: 3 | 4
  
  // Identification filters
  identificationType?: string
  identificationValue?: string
  
  // Photo filters
  hasPhotos?: boolean
  photoType?: string
  colorCode?: string
  
  // Pagination
  page?: number
  limit?: number
  sortBy?: 'price' | 'year' | 'make' | 'model' | 'trim'
  sortOrder?: 'asc' | 'desc'
  
  // Response options
  includePhotos?: boolean
  includeIdentifications?: boolean
  includePricing?: boolean
  includeIncentives?: boolean
  includeBodyModelInfo?: boolean
}

export interface FilterState {
  years: YearOption[]
  makes: MakeOption[]
  models: ModelOption[]
  trims: TrimOption[]
  bodyTypes: BodyTypeOption[]
  driveTypes: DriveTypeOption[]
  priceRange: PriceRange
  incentiveLevels: IncentiveLevelOption[]
}

export interface YearOption {
  yearId: number
  year: number
  vehicleCount: number
}

export interface MakeOption {
  makeId: number
  makeName: string
  vehicleCount: number
}

export interface ModelOption {
  modelId: number
  modelName: string
  bodyType: string
  vehicleCount: number
  minPrice: number
  maxPrice: number
}

export interface TrimOption {
  trimId: number
  trimName: string
  driveTypeId: number
  driveTypeName: string
  vehicleId: number
  primaryIdentification: string
  msrp: number
  invoice: number
  dealerNet: number
  level3Incentive: number
  level4Incentive: number
}

export interface BodyTypeOption {
  bodyTypeId: number
  bodyTypeName: string
  vehicleCount: number
}

export interface DriveTypeOption {
  driveTypeId: number
  driveTypeName: string
  vehicleCount: number
}

export interface PriceRange {
  min: number
  max: number
}

export interface IncentiveLevelOption {
  level: 3 | 4
  name: string
  description: string
}

// =====================================================
// SEARCH RESULTS
// =====================================================

export interface SearchResult {
  vehicleId: number
  year: number
  make: string
  model: string
  trimName: string
  driveType: string
  bodyType: string
  bodyModelCode?: number
  bodyModelInfo?: DecodedBodyModel
  primaryIdentification: string
  msrp: number
  invoice: number
  dealerNet: number
  incentiveAmount: number
  effectivePrice: number
}

export interface SearchResults {
  vehicles: SearchResult[]
  totalCount: number
  filterState: FilterState
  suggestions: SearchSuggestion[]
}

export interface SearchSuggestion {
  text: string
  type: 'year' | 'make' | 'model' | 'trim' | 'bodyType' | 'price' | 'feature'
  value: any
}

// =====================================================
// CART & E-COMMERCE
// =====================================================

export interface CartItem {
  vehicleId: number
  vehicle: VehicleDetails
  quantity: number
  priceLevel: 3 | 4
  pricing: PricingBreakdown
  identifications: VehicleIdentification[]
  photos: VehiclePhoto[]
  
  // Calculated values
  unitPrice: number
  totalPrice: number
  savings: number
  effectivePrice: number
}

export interface Cart {
  items: CartItem[]
  totalValue: number
  totalSavings: number
  totalEffectiveValue: number
}

export interface PurchaseOrder {
  id: string
  company: CompanyInfo
  items: CartItem[]
  totalValue: number
  totalSavings: number
  totalEffectiveValue: number
  
  // PO details
  requestedDeliveryDate?: Date
  specialInstructions?: string
  paymentTerms?: string
  shippingAddress?: Address
  
  // Status tracking
  status: 'draft' | 'submitted' | 'approved' | 'fulfilled' | 'cancelled'
  submittedAt: Date
  approvedAt?: Date
  fulfilledAt?: Date
}

export interface CompanyInfo {
  name: string
  contactEmail: string
  contactPhone: string
  address?: Address
  taxId?: string
  fleetSize?: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// =====================================================
// API RESPONSES
// =====================================================

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

// =====================================================
// UI COMPONENT PROPS
// =====================================================

export interface VehicleCardProps {
  vehicle: VehicleDetails
  photos?: VehiclePhoto[]
  pricing?: PricingBreakdown
  viewMode: 'grid' | 'list' | 'comparison'
  onAddToCart: (vehicleId: number, priceLevel: 3 | 4) => void
  onViewDetails: (vehicleId: number) => void
  onCompare: (vehicleId: number) => void
  onShare: (vehicleId: number) => void
}

export interface FilterSidebarProps {
  filterState: FilterState
  selectedFilters: Partial<SearchFilters>
  onFilterChange: (filters: Partial<SearchFilters>) => void
  onFilterReset: () => void
  onFilterSave: (name: string) => void
  onFilterLoad: (name: string) => void
}

export interface PhotoGalleryProps {
  photos: VehiclePhoto[]
  collections?: PhotoCollection[]
  viewAngles?: PhotoViewAngle[]
  colorVariants?: any[]
  showStockPhotos?: boolean
  showActualPhotos?: boolean
  showColorVariants?: boolean
  showCollections?: boolean
  onPhotoClick?: (photo: VehiclePhoto) => void
  onAngleChange?: (angle: PhotoViewAngle) => void
  onColorChange?: (color: any) => void
  onCollectionSelect?: (collection: PhotoCollection) => void
}

export interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  onNaturalLanguageQuery: (query: string) => void
  suggestions: SearchSuggestion[]
  filters: Partial<SearchFilters>
}

export interface CartProps {
  items: CartItem[]
  totalValue: number
  totalSavings: number
  totalEffectiveValue: number
  onQuantityChange: (vehicleId: number, quantity: number) => void
  onRemoveItem: (vehicleId: number) => void
  onCheckout: () => void
  onClearCart: () => void
}

// =====================================================
// STATE MANAGEMENT
// =====================================================

export interface AppState {
  // Search state
  searchFilters: Partial<SearchFilters>
  searchResults: SearchResult[]
  searchLoading: boolean
  searchError?: string
  
  // Cart state
  cart: Cart
  cartOpen: boolean
  
  // UI state
  viewMode: 'grid' | 'list' | 'comparison'
  selectedVehicles: number[]
  comparisonMode: boolean
  
  // Filter state
  filterState: FilterState
  savedFilters: Record<string, Partial<SearchFilters>>
  
  // Photo state
  selectedPhoto?: VehiclePhoto
  photoGalleryOpen: boolean
  
  // Chat state
  chatOpen: boolean
  chatHistory: ChatMessage[]
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  vehicleSuggestions?: VehicleDetails[]
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type SortOption = 'price' | 'year' | 'make' | 'model' | 'trim'
export type SortOrder = 'asc' | 'desc'
export type ViewMode = 'grid' | 'list' | 'comparison'
export type PriceLevel = 3 | 4
export type PhotoSource = 'actual' | 'stock'
export type PhotoTypeCode = 'stock_catalog' | 'stock_exterior' | 'stock_interior' | 'stock_360' | 'actual_exterior' | 'actual_interior' | 'actual_damage' | 'actual_feature'
export type IdentificationTypeCode = 'vin' | 'spec_number' | 'stock_number' | 'asset_number' | 'order_number' | 'purchase_order' | 'quote_number' | 'invoice_number' | 'internal_id'
export type PurchaseOrderStatus = 'draft' | 'submitted' | 'approved' | 'fulfilled' | 'cancelled' 