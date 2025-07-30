import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET() {
  try {
    const years = await DatabaseService.getAvailableYears()
    return NextResponse.json(years)
  } catch (error) {
    console.error('Years API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch years' },
      { status: 500 }
    )
  }
} 