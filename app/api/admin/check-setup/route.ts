import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Check if any admin user exists
    const { data: admins, error, count } = await supabase
      .from('admin_users')
      .select('id', { count: 'exact', head: true })

    if (error) {
      console.error('Error checking admin setup:', error)
      return NextResponse.json(
        { error: 'Failed to check admin setup status' },
        { status: 500 }
      )
    }

    const adminExists = count && count > 0

    return NextResponse.json({
      setupComplete: adminExists,
      adminCount: count || 0
    })
  } catch (error) {
    console.error('Check setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
