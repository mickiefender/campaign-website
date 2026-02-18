import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { generateClientReference } from '@/lib/hubtel'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HUBTEL_CLIENT_ID = process.env.HUBTEL_CLIENT_ID!
const HUBTEL_CLIENT_SECRET = process.env.HUBTEL_CLIENT_SECRET!
const HUBTEL_MERCHANT_ACCOUNT_NUMBER = process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER!
const HUBTEL_BASE_URL = 'https://payproxyapi.hubtel.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, email, fullName, phone, isAnonymous, message } = body

    if (!amount || !email || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create donation record
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert([
        {
          full_name: isAnonymous ? 'Anonymous Donor' : fullName,
          email: email,
          phone: phone || null,
          amount: amount, // Amount is already in cedis from frontend
          is_anonymous: isAnonymous,
          message: message || null,
          status: 'pending',
          created_at: new Date(),
        }
      ])
      .select()

    if (donationError) {
      console.error('Database error:', donationError)
      return NextResponse.json({ error: donationError.message }, { status: 400 })
    }

    const donationId = donation?.[0]?.id

    // Generate unique client reference using utility function
    const clientReference = generateClientReference(donationId)
    
    // Debug: Log the generated reference and its length
    console.log('Generated clientReference:', clientReference)
    console.log('ClientReference length:', clientReference.length)

    // Initialize Hubtel transaction
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const hubtelPayload = {
      totalAmount: amount, // Amount is already in cedis
      description: `Campaign Donation - ${isAnonymous ? 'Anonymous' : fullName}`,
      callbackUrl: `${baseUrl}/api/hubtel/webhook`,
      returnUrl: `${baseUrl}/api/hubtel/callback?status=success&clientReference=${clientReference}`,
      cancellationUrl: `${baseUrl}/api/hubtel/callback?status=cancelled&clientReference=${clientReference}`,
      merchantAccountNumber: HUBTEL_MERCHANT_ACCOUNT_NUMBER,
      clientReference: clientReference,
      customerName: fullName,
      customerEmail: email,
      customerMsisdn: phone || '',
      metadata: JSON.stringify({
        donation_id: donationId,
        is_anonymous: isAnonymous,
        message: message,
      }),
    }

    // Create Basic Auth header
    const authString = Buffer.from(`${HUBTEL_CLIENT_ID}:${HUBTEL_CLIENT_SECRET}`).toString('base64')

    const hubtelResponse = await fetch(`${HUBTEL_BASE_URL}/items/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubtelPayload),
    })

    const hubtelData = await hubtelResponse.json()

    if (!hubtelResponse.ok || hubtelData.responseCode !== '0000') {
      console.error('Hubtel API error:', hubtelData)
      return NextResponse.json(
        { error: hubtelData.message || 'Failed to initialize payment' },
        { status: 400 }
      )
    }

    // Update donation with client reference
    await supabase
      .from('donations')
      .update({ transaction_reference: clientReference })
      .eq('id', donationId)

    return NextResponse.json({
      checkoutUrl: hubtelData.data.checkoutUrl,
      clientReference: clientReference,
      checkoutId: hubtelData.data.checkoutId,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
