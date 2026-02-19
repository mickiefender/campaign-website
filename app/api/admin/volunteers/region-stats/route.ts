import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all volunteers with their region
    const { data, error } = await supabase
      .from('volunteers')
      .select('region')

    if (error) {
      console.error('Error fetching volunteer regions:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Group volunteers by region and count
    const regionCounts: Record<string, number> = {}

    for (const volunteer of data || []) {
      const region = volunteer.region?.trim() || 'Unknown'
      regionCounts[region] = (regionCounts[region] || 0) + 1
    }

    // Convert to array format for recharts
    const regionStats = Object.entries(regionCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count) // Sort by count descending

    return NextResponse.json({ regionStats, total: data?.length || 0 })
  } catch (error) {
    console.error('Region stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
