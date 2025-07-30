import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function POST() {
  try {
    await DatabaseService.initializeDatabase()
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
} 