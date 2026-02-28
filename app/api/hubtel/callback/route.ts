import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * ============================================
 * HUBTEL BROWSER CALLBACK (REDIRECT ONLY)
 * ============================================
 * This handles the user's browser redirect from Hubtel.
 * DO NOT verify payment here - the webhook is the source of truth.
 * Just check the database and show appropriate UI.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const clientReference = searchParams.get('clientReference')

    if (!clientReference) {
      return NextResponse.redirect(
        new URL('/donation?error=invalid_reference', request.nextUrl.origin)
      )
    }

    // Get donation details from database
    const { data: donation, error } = await supabase
      .from('donations')
      .select('id, status, amount')
      .eq('transaction_reference', clientReference)
      .single()

    if (error || !donation) {
      console.error('Donation not found:', clientReference)
      return NextResponse.redirect(
        new URL('/donate?error=donation_not_found', request.nextUrl.origin)
      )
    }

    // Handle successful payments by updating database immediately
    if (status === 'success') {
      // Update donation status to completed
      await supabase
        .from('donations')
        .update({ status: 'completed' })
        .eq('transaction_reference', clientReference)

      return NextResponse.redirect(
        new URL(
          `/donate/success?amount=${donation.amount}&reference=${clientReference}`,
          request.nextUrl.origin
        )
      )
    } else if (status === 'cancel') {
      // Update donation status to cancelled
      await supabase
        .from('donations')
        .update({ status: 'cancelled' })
        .eq('transaction_reference', clientReference)

      return NextResponse.redirect(
        new URL(
          `/donate/cancelled?reference=${clientReference}`,
          request.nextUrl.origin
        )
      )
    } else if (status === 'failed') {
      // Update donation status to failed
      await supabase
        .from('donations')
        .update({ status: 'failed' })
        .eq('transaction_reference', clientReference)

      return NextResponse.redirect(
        new URL(
          `/donate/failed?reference=${clientReference}`,
          request.nextUrl.origin
        )
      )
    }

    // No status parameter - redirect to pending
    return NextResponse.redirect(
      new URL(
        `/donate/pending?reference=${clientReference}`,
        request.nextUrl.origin
      )
    )
  } catch (error) {
    console.error('❌ Callback error:', error)
    return NextResponse.redirect(
      new URL('/donation?error=callback_error', request.nextUrl.origin)
    )
  }
}
