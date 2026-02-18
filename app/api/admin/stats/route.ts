import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

// Force dynamic rendering to prevent static optimization
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client inside the handler
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

    // Fetch total donations
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('amount, status, created_at')

    if (donationsError) {
      console.error('Error fetching donations:', donationsError)
    }

    // Calculate donation stats
    const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0
    const completedDonations = donations?.filter(d => d.status === 'completed') || []
    const totalDonors = donations?.length || 0

    // Get donations from last month for trend calculation
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const lastMonthDonations = donations?.filter(
      d => new Date(d.created_at) >= lastMonth
    ) || []
    const donationTrend = donations && donations.length > 0
      ? Math.round((lastMonthDonations.length / donations.length) * 100)
      : 0

    // Fetch total volunteers
    const { data: volunteers, error: volunteersError } = await supabase
      .from('volunteers')
      .select('id, created_at, status')

    if (volunteersError) {
      console.error('Error fetching volunteers:', volunteersError)
    }

    const totalVolunteers = volunteers?.length || 0
    const lastMonthVolunteers = volunteers?.filter(
      v => new Date(v.created_at) >= lastMonth
    ) || []
    const volunteerTrend = volunteers && volunteers.length > 0
      ? Math.round((lastMonthVolunteers.length / volunteers.length) * 100)
      : 0

    // Fetch contact messages
    const { data: messages, error: messagesError } = await supabase
      .from('contact_messages')
      .select('id, created_at, status')

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
    }

    const totalMessages = messages?.length || 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayMessages = messages?.filter(
      m => new Date(m.created_at) >= today
    ) || []

    // Get recent donations for activity feed
    const { data: recentDonations } = await supabase
      .from('donations')
      .select('id, donor_name, amount, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent volunteers for activity feed
    const { data: recentVolunteers } = await supabase
      .from('volunteers')
      .select('id, full_name, region, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      stats: {
        totalDonations,
        totalDonors,
        totalVolunteers,
        totalMessages,
        donationTrend,
        volunteerTrend,
        todayMessages: todayMessages.length,
      },
      recentDonations: recentDonations || [],
      recentVolunteers: recentVolunteers || [],
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
