import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { yearId: string } }
) {
  try {
    const yearId = parseInt(params.yearId)
    const makes = await DatabaseService.getMakesByYear(yearId)
    return NextResponse.json(makes)
  } catch (error) {
    console.error('Makes API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch makes' },
      { status: 500 }
    )
  }
} 