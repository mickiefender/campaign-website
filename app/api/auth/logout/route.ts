import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'

// Force dynamic rendering to prevent static optimization
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    await deleteSession()

    return NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
