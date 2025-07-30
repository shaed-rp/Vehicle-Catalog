import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { yearId: string; makeId: string; modelId: string } }
) {
  try {
    const yearId = parseInt(params.yearId)
    const makeId = parseInt(params.makeId)
    const modelId = parseInt(params.modelId)
    const trims = await DatabaseService.getTrimsByYearMakeModel(yearId, makeId, modelId)
    return NextResponse.json(trims)
  } catch (error) {
    console.error('Trims API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trims' },
      { status: 500 }
    )
  }
} 