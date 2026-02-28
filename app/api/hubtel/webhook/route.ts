import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * ============================================
 * HUBTEL SERVER WEBHOOK (SOURCE OF TRUTH)
 * ============================================
 * This endpoint is called by Hubtel servers.
 * It is the ONLY place where payments are finalized.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 🔥 IMPORTANT: Keep this for Hubtel review evidence
    console.log('🔥 Hubtel webhook payload:', JSON.stringify(body, null, 2))

    const { ResponseCode, Data } = body

    // Basic validation
    if (!ResponseCode || !Data) {
      console.warn('Invalid webhook payload structure')
      return NextResponse.json({ success: true })
    }

    const {
      ClientReference,
      TransactionId,
      Status,
      Amount,
    } = Data

    if (!ClientReference) {
      console.warn('Missing ClientReference in webhook')
      return NextResponse.json({ success: true })
    }

    // Hubtel success codes
    const successStatuses = ['Success', 'Paid', 'Successful', 'Completed']

    const isSuccessful =
      ResponseCode === '0000' && successStatuses.includes(Status)

    if (!isSuccessful) {
      console.log(
        `Payment not successful. ResponseCode=${ResponseCode}, Status=${Status}`
      )
      return NextResponse.json({ success: true })
    }

    // 🔒 IDEMPOTENCY CHECK (prevent double processing)
    const { data: existingDonation, error: fetchError } = await supabase
      .from('donations')
      .select('id, status')
      .eq('transaction_reference', ClientReference)
      .single()

    if (fetchError || !existingDonation) {
      console.error(
        'Donation not found for reference:',
        ClientReference,
        fetchError
      )
      return NextResponse.json({ success: true })
    }

    // If already completed, ignore duplicate webhook
    if (existingDonation.status === 'completed') {
      console.log('✅ Duplicate webhook ignored:', ClientReference)
      return NextResponse.json({ success: true })
    }

    // ✅ Update donation to completed
    const { error: updateError } = await supabase
      .from('donations')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingDonation.id)

    if (updateError) {
      console.error('Error updating donation:', updateError)
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    console.log(
      `✅ Donation ${ClientReference} marked completed. Transaction ID: ${TransactionId}, Amount: ${Amount}`
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 500 }
    )
  }
}

/**
 * ============================================
 * GET HANDLER (ACKNOWLEDGEMENT ONLY)
 * ============================================
 * ⚠️ NEVER finalize payments here.
 * This exists only because some gateways ping GET.
 */
export async function GET() {
  return NextResponse.json({ success: true })
}
