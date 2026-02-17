import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { extractDonationId } from '@/lib/hubtel'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Hubtel webhook payload structure
    const {
      ResponseCode,
      Data,
    } = body

    // Check if payment was successful
    // ResponseCode '0000' indicates success in Hubtel
    if (ResponseCode === '0000' && Data) {
      const {
        ClientReference,
        TransactionId,
        Amount,
        Status,
      } = Data

      // Status should be 'Success' or 'Paid'
      if (Status === 'Success' || Status === 'Paid') {
        // Extract donation ID from client reference using utility function
        const donationId = extractDonationId(ClientReference)
        
        if (!donationId) {
          console.error('Invalid client reference format:', ClientReference)
          return NextResponse.json({ error: 'Invalid reference' }, { status: 400 })
        }

        // Update donation status
        const { error: updateError } = await supabase
          .from('donations')
          .update({
            status: 'completed',
            transaction_reference: ClientReference,
            updated_at: new Date(),
          })
          .eq('id', donationId)

        if (updateError) {
          console.error('Error updating donation:', updateError)
          return NextResponse.json({ error: updateError.message }, { status: 400 })
        }

        console.log(`Donation ${donationId} marked as completed. Transaction ID: ${TransactionId}`)
      } else {
        console.log(`Payment status: ${Status} for reference: ${ClientReference}`)
      }
    } else {
      console.log('Webhook received with non-success response code:', ResponseCode)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}

// Hubtel also supports GET requests for status checks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const clientReference = searchParams.get('clientReference')

    if (status === 'success' && clientReference) {
      // Extract donation ID from client reference using utility function
      const donationId = extractDonationId(clientReference)
      
      if (donationId) {
        // Update donation status
        await supabase
          .from('donations')
          .update({
            status: 'completed',
            transaction_reference: clientReference,
            updated_at: new Date().toISOString(),
          })
          .eq('id', donationId)

        console.log(`Donation ${donationId} marked as completed via GET callback`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('GET callback error:', error)
    return NextResponse.json({ error: 'Callback processing error' }, { status: 500 })
  }
}
