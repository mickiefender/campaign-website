import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

// Force dynamic rendering to prevent static optimization
export const dynamic = 'force-dynamic'

// CSV helper function to generate CSV content
function generateCSV(data: any[]): string {
  if (data.length === 0) {
    return 'No donations to export'
  }

  // Get all unique keys from all donations
  const headers = Object.keys(data[0])
  
  // Create CSV header row
  const headerRow = headers.join(',')
  
  // Create data rows
  const dataRows = data.map((donation: any) => {
    return headers.map((header: string) => {
      const value = donation[header]
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  }).join('\n')
  
  return `${headerRow}\n${dataRows}`
}

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client inside the handler
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Export route: Missing Supabase configuration')
      return NextResponse.json(
        { error: 'Database configuration missing. Please contact administrator.' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check authentication
    const session = await getSession()
    if (!session) {
      console.log('Export route: No session found')
      return NextResponse.json({ error: 'Unauthorized - Please login again' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    // Build query - fetch all donations without pagination
    let query = supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Fetch all donations
    const { data, error } = await query

    if (error) {
      console.error('Error fetching donations:', error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 400 })
    }

    // Process donations for export
    const processedDonations = (data || []).map((donation: any) => {
      const isAnonymous = donation.anonymous === true
      const hasValidName = donation.donor_name && donation.donor_name !== 'Anonymous Donor'
      
      return {
        'Donor Name': isAnonymous || !hasValidName ? 'Anonymous Donor' : donation.donor_name,
        'Email': isAnonymous || !hasValidName ? 'N/A' : (donation.donor_email || 'N/A'),
        'Amount (GHS)': donation.amount || 0,
        'Status': donation.status || 'unknown',
        'Payment Method': donation.payment_method || 'N/A',
        'Anonymous': isAnonymous ? 'Yes' : 'No',
        'Date': donation.created_at ? new Date(donation.created_at).toLocaleString() : 'N/A',
        'Transaction Reference': donation.transaction_reference || 'N/A',
      }
    })

    // Generate CSV
    const csvContent = generateCSV(processedDonations)

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0]
    const filename = `donations_report_${date}.csv`

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error('Export donations error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

