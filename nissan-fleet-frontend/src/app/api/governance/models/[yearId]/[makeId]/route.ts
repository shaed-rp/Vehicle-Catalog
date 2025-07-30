import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { yearId: string; makeId: string } }
) {
  try {
    const yearId = parseInt(params.yearId)
    const makeId = parseInt(params.makeId)
    const models = await DatabaseService.getModelsByYearMake(yearId, makeId)
    return NextResponse.json(models)
  } catch (error) {
    console.error('Models API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
} 