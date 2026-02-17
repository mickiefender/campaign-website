import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentStatus, extractDonationId } from '@/lib/hubtel'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Hubtel Callback Handler
 * 
 * This endpoint handles user redirects after payment completion on Hubtel's checkout page.
 * It verifies the payment status with Hubtel's API and updates the donation record accordingly.
 * 
 * Query Parameters:
 * - status: 'success' | 'cancelled' | 'failed'
 * - clientReference: The unique reference for the transaction (DON-{id}-{timestamp})
 * - checkoutId: Hubtel's checkout session ID (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const clientReference = searchParams.get('clientReference')
    const checkoutId = searchParams.get('checkoutId')

    console.log('Callback received:', { status, clientReference, checkoutId })

    // Validate required parameters
    if (!clientReference) {
      console.error('Missing clientReference in callback')
      return NextResponse.redirect(
        new URL('/donate/failed?error=missing_reference', request.url)
      )
    }

    // Extract donation ID from client reference
    const donationId = extractDonationId(clientReference)
    if (!donationId) {
      console.error('Invalid client reference format:', clientReference)
      return NextResponse.redirect(
        new URL('/donate/failed?error=invalid_reference', request.url)
      )
    }

    // Fetch the donation record
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .single()

    if (fetchError || !donation) {
      console.error('Donation not found:', donationId, fetchError)
      return NextResponse.redirect(
        new URL('/donate/failed?error=donation_not_found', request.url)
      )
    }

    // If donation is already completed, redirect to success page
    if (donation.status === 'completed') {
      console.log('Donation already completed:', donationId)
      return NextResponse.redirect(
        new URL(`/donate/success?ref=${clientReference}`, request.url)
      )
    }

    // Handle cancelled status
    if (status === 'cancelled' || status === 'canceled') {
      console.log('Payment cancelled by user:', donationId)
      
      // Update donation status to cancelled
      await supabase
        .from('donations')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', donationId)

      return NextResponse.redirect(
        new URL(`/donate/cancelled?ref=${clientReference}`, request.url)
      )
    }

    // For success or unknown status, verify with Hubtel API
    console.log('Verifying payment status with Hubtel:', clientReference)
    const paymentStatus = await verifyPaymentStatus(clientReference)

    console.log('Payment verification result:', paymentStatus)

    // Update donation based on verified status
    if (paymentStatus.success && paymentStatus.status === 'completed') {
      // Payment confirmed as successful
      const { error: updateError } = await supabase
        .from('donations')
        .update({
          status: 'completed',
          transaction_reference: clientReference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', donationId)

      if (updateError) {
        console.error('Error updating donation:', updateError)
        return NextResponse.redirect(
          new URL('/donate/failed?error=update_failed', request.url)
        )
      }

      console.log(`Donation ${donationId} marked as completed`)
      return NextResponse.redirect(
        new URL(`/donate/success?ref=${clientReference}&amount=${donation.amount}`, request.url)
      )
    } else if (paymentStatus.status === 'pending') {
      // Payment is still processing
      const { error: updateError } = await supabase
        .from('donations')
        .update({
          status: 'pending',
          transaction_reference: clientReference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', donationId)

      if (updateError) {
        console.error('Error updating donation to pending:', updateError)
      }

      console.log(`Donation ${donationId} is pending`)
      return NextResponse.redirect(
        new URL(`/donate/pending?ref=${clientReference}`, request.url)
      )
    } else if (paymentStatus.status === 'cancelled') {
      // Payment was cancelled
      await supabase
        .from('donations')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', donationId)

      console.log(`Donation ${donationId} was cancelled`)
      return NextResponse.redirect(
        new URL(`/donate/cancelled?ref=${clientReference}`, request.url)
      )
    } else {
      // Payment failed or unknown status
      const { error: updateError } = await supabase
        .from('donations')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', donationId)

      if (updateError) {
        console.error('Error updating donation to failed:', updateError)
      }

      console.log(`Donation ${donationId} failed:`, paymentStatus.message)
      return NextResponse.redirect(
        new URL(`/donate/failed?ref=${clientReference}&reason=${encodeURIComponent(paymentStatus.message || 'Payment failed')}`, request.url)
      )
    }
  } catch (error) {
    console.error('Callback processing error:', error)
    return NextResponse.redirect(
      new URL('/donate/failed?error=processing_error', request.url)
    )
  }
}

/**
 * POST handler for alternative callback method
 * Some payment gateways may POST callback data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('POST callback received:', body)

    // Extract parameters from body
    const { status, clientReference, checkoutId } = body

    // Redirect to GET handler with query parameters
    const callbackUrl = new URL('/api/hubtel/callback', request.url)
    if (status) callbackUrl.searchParams.set('status', status)
    if (clientReference) callbackUrl.searchParams.set('clientReference', clientReference)
    if (checkoutId) callbackUrl.searchParams.set('checkoutId', checkoutId)

    return NextResponse.redirect(callbackUrl)
  } catch (error) {
    console.error('POST callback error:', error)
    return NextResponse.json(
      { error: 'Invalid callback data' },
      { status: 400 }
    )
  }
}
