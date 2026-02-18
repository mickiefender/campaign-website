import { NextRequest, NextResponse } from 'next/server'
import { createSession, verifyAdminCredentials } from '@/lib/auth'

// Force dynamic rendering to prevent static optimization
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Verify credentials against database
    const { valid, user } = await verifyAdminCredentials(email, password)

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session
    await createSession(user.id, user.email, user.role || 'admin')

    return NextResponse.json(
      { success: true, message: 'Login successful', user: { email: user.email, role: user.role } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
