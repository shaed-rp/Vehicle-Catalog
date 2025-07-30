import { supabase } from './supabase'
import { SearchFilters, SearchResult, YearOption, MakeOption, ModelOption, TrimOption } from '@/types'

export class DatabaseService {
  // Vehicle search with filters
  static async searchVehicles(filters: Partial<SearchFilters>) {
    try {
      let query = supabase
        .from('vehicles')
        .select(`
          id,
          model_years!inner(year),
          makes!inner(name),
          models!inner(name),
          trims!inner(name),
          body_types!inner(name),
          drive_types!inner(name),
          vehicle_identifications(type, value, is_primary),
          vehicle_pricing(intro_msrp, factory_dealer_invoice, dealer_net)
        `)

      // Apply filters
      if (filters.yearId) {
        query = query.eq('model_years.year', filters.yearId)
      }
      if (filters.makeId) {
        query = query.eq('makes.id', filters.makeId)
      }
      if (filters.modelId) {
        query = query.eq('models.id', filters.modelId)
      }
      if (filters.trimId) {
        query = query.eq('trims.id', filters.trimId)
      }
      if (filters.bodyTypeId) {
        query = query.eq('body_types.id', filters.bodyTypeId)
      }
      if (filters.driveTypeId) {
        query = query.eq('drive_types.id', filters.driveTypeId)
      }

      const { data, error, count } = await query

      if (error) {
        console.error('Database search error:', error)
        throw new Error('Failed to search vehicles')
      }

      // Transform data to match frontend expectations
      const vehicles: SearchResult[] = data?.map(vehicle => {
        const primaryIdentification = vehicle.vehicle_identifications?.find(id => id.is_primary)?.value || 'N/A'
        const pricing = vehicle.vehicle_pricing?.[0]
        
        return {
          vehicleId: vehicle.id,
          year: vehicle.model_years.year,
          make: vehicle.makes.name,
          model: vehicle.models.name,
          trimName: vehicle.trims.name,
          driveType: vehicle.drive_types.name,
          bodyType: vehicle.body_types.name,
          primaryIdentification,
          msrp: pricing?.intro_msrp || 0,
          invoice: pricing?.factory_dealer_invoice || 0,
          dealerNet: pricing?.dealer_net || 0,
          incentiveAmount: 0, // Will be calculated separately
          effectivePrice: pricing?.intro_msrp || 0
        }
      }) || []

      return {
        data: vehicles,
        totalCount: count || 0,
        page: filters.page || 1,
        limit: filters.limit || 10,
        totalPages: Math.ceil((count || 0) / (filters.limit || 10))
      }
    } catch (error) {
      console.error('Vehicle search error:', error)
      throw error
    }
  }

  // Get available years
  static async getAvailableYears(): Promise<YearOption[]> {
    try {
      const { data, error } = await supabase
        .from('model_years')
        .select('id, year')
        .order('year', { ascending: false })

      if (error) {
        console.error('Years query error:', error)
        throw new Error('Failed to fetch years')
      }

      // For now, return mock vehicle counts
      // In a real implementation, you'd count vehicles per year
      return data?.map(year => ({
        yearId: year.id,
        year: year.year,
        vehicleCount: Math.floor(Math.random() * 20) + 5 // Mock count
      })) || []
    } catch (error) {
      console.error('Get years error:', error)
      throw error
    }
  }

  // Get makes by year
  static async getMakesByYear(yearId: number): Promise<MakeOption[]> {
    try {
      const { data, error } = await supabase
        .from('makes')
        .select('id, name')
        .order('name')

      if (error) {
        console.error('Makes query error:', error)
        throw new Error('Failed to fetch makes')
      }

      return data?.map(make => ({
        makeId: make.id,
        makeName: make.name,
        vehicleCount: Math.floor(Math.random() * 15) + 3 // Mock count
      })) || []
    } catch (error) {
      console.error('Get makes error:', error)
      throw error
    }
  }

  // Get models by year and make
  static async getModelsByYearMake(yearId: number, makeId: number): Promise<ModelOption[]> {
    try {
      const { data, error } = await supabase
        .from('models')
        .select(`
          id,
          name,
          body_types!inner(name)
        `)
        .eq('make_id', makeId)
        .order('name')

      if (error) {
        console.error('Models query error:', error)
        throw new Error('Failed to fetch models')
      }

      return data?.map(model => ({
        modelId: model.id,
        modelName: model.name,
        bodyType: model.body_types?.name || 'Unknown',
        vehicleCount: Math.floor(Math.random() * 10) + 2, // Mock count
        minPrice: Math.floor(Math.random() * 20000) + 20000, // Mock price
        maxPrice: Math.floor(Math.random() * 30000) + 40000 // Mock price
      })) || []
    } catch (error) {
      console.error('Get models error:', error)
      throw error
    }
  }

  // Get trims by year, make, and model
  static async getTrimsByYearMakeModel(yearId: number, makeId: number, modelId: number): Promise<TrimOption[]> {
    try {
      const { data, error } = await supabase
        .from('trims')
        .select(`
          id,
          name,
          drive_types!inner(name)
        `)
        .order('name')

      if (error) {
        console.error('Trims query error:', error)
        throw new Error('Failed to fetch trims')
      }

      return data?.map(trim => ({
        trimId: trim.id,
        trimName: trim.name,
        driveTypeId: 1, // Mock drive type ID
        driveTypeName: trim.drive_types?.name || 'FWD',
        vehicleId: Math.floor(Math.random() * 100) + 1, // Mock vehicle ID
        primaryIdentification: `NISSAN-${yearId}-${trim.name.toUpperCase()}-001`,
        msrp: Math.floor(Math.random() * 20000) + 25000, // Mock pricing
        invoice: Math.floor(Math.random() * 18000) + 23000,
        dealerNet: Math.floor(Math.random() * 17000) + 22000,
        level3Incentive: Math.floor(Math.random() * 3000) + 1000,
        level4Incentive: Math.floor(Math.random() * 4000) + 1500
      })) || []
    } catch (error) {
      console.error('Get trims error:', error)
      throw error
    }
  }

  // Get vehicle details by ID
  static async getVehicleDetails(vehicleId: number) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          model_years!inner(year),
          makes!inner(name),
          models!inner(name),
          trims!inner(name),
          body_types!inner(name),
          drive_types!inner(name),
          vehicle_identifications(type, value, is_primary),
          vehicle_pricing(intro_msrp, factory_dealer_invoice, dealer_net)
        `)
        .eq('id', vehicleId)
        .single()

      if (error) {
        console.error('Vehicle details query error:', error)
        throw new Error('Failed to fetch vehicle details')
      }

      return data
    } catch (error) {
      console.error('Get vehicle details error:', error)
      throw error
    }
  }

  // Initialize database with sample data
  static async initializeDatabase() {
    try {
      // Check if data already exists
      const { count } = await supabase
        .from('makes')
        .select('*', { count: 'exact', head: true })

      if (count && count > 0) {
        console.log('Database already has data, skipping initialization')
        return
      }

      // Insert sample data
      await this.insertSampleData()
      console.log('Database initialized with sample data')
    } catch (error) {
      console.error('Database initialization error:', error)
      throw error
    }
  }

  // Insert sample data
  private static async insertSampleData() {
    // Insert makes
    const { data: makes } = await supabase
      .from('makes')
      .insert([
        { name: 'Nissan', logo_url: 'https://example.com/nissan-logo.png' }
      ])
      .select()

    // Insert model years
    const { data: years } = await supabase
      .from('model_years')
      .insert([
        { year: 2025 },
        { year: 2024 },
        { year: 2023 }
      ])
      .select()

    // Insert body types
    const { data: bodyTypes } = await supabase
      .from('body_types')
      .insert([
        { name: 'Sedan' },
        { name: 'SUV' },
        { name: 'Truck' },
        { name: 'Hatchback' }
      ])
      .select()

    // Insert drive types
    const { data: driveTypes } = await supabase
      .from('drive_types')
      .insert([
        { name: 'FWD' },
        { name: 'AWD' },
        { name: 'RWD' },
        { name: '4WD' }
      ])
      .select()

    // Insert models
    const { data: models } = await supabase
      .from('models')
      .insert([
        { make_id: makes?.[0]?.id || 1, name: 'Altima' },
        { make_id: makes?.[0]?.id || 1, name: 'Rogue' },
        { make_id: makes?.[0]?.id || 1, name: 'Sentra' },
        { make_id: makes?.[0]?.id || 1, name: 'Maxima' },
        { make_id: makes?.[0]?.id || 1, name: 'Murano' }
      ])
      .select()

    // Insert trims
    const { data: trims } = await supabase
      .from('trims')
      .insert([
        { name: 'S' },
        { name: 'SR' },
        { name: 'SL' },
        { name: 'Platinum' },
        { name: 'SV' }
      ])
      .select()

    // Insert sample vehicles
    const vehicles = []
    for (let i = 1; i <= 10; i++) {
      vehicles.push({
        model_year_id: years?.[i % 3]?.id || 1,
        make_id: makes?.[0]?.id || 1,
        model_id: models?.[i % 5]?.id || 1,
        trim_id: trims?.[i % 5]?.id || 1,
        body_type_id: bodyTypes?.[i % 4]?.id || 1,
        drive_type_id: driveTypes?.[i % 4]?.id || 1
      })
    }

    const { data: vehicleData } = await supabase
      .from('vehicles')
      .insert(vehicles)
      .select()

    // Insert vehicle pricing
    const pricing = vehicleData?.map((vehicle, index) => ({
      vehicle_id: vehicle.id,
      intro_msrp: 25000 + (index * 5000),
      factory_dealer_invoice: 23000 + (index * 4500),
      dealer_net: 22000 + (index * 4000)
    })) || []

    await supabase
      .from('vehicle_pricing')
      .insert(pricing)

    // Insert vehicle identifications
    const identifications = vehicleData?.map((vehicle, index) => ({
      vehicle_id: vehicle.id,
      type: 'vin',
      value: `1N4AL3AP${String(index + 1).padStart(2, '0')}C123456`,
      is_primary: true
    })) || []

    await supabase
      .from('vehicle_identifications')
      .insert(identifications)
  }
} 