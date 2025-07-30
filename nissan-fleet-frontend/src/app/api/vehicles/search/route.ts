import { NextRequest, NextResponse } from 'next/server'
import { SearchFilters, PaginatedResponse, SearchResult } from '@/types'
import { DatabaseService } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const filters: Partial<SearchFilters> = await request.json()
    
    // Use real database service
    const response = await DatabaseService.searchVehicles(filters)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Vehicle search error:', error)
    return NextResponse.json(
      { error: 'Failed to search vehicles' },
      { status: 500 }
    )
  }
} 