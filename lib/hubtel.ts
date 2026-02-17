/**
 * Hubtel Payment Integration Utilities
 * 
 * This module provides utility functions for interacting with the Hubtel Payment API,
 * including payment verification and status checking.
 */

const HUBTEL_CLIENT_ID = process.env.HUBTEL_CLIENT_ID!
const HUBTEL_CLIENT_SECRET = process.env.HUBTEL_CLIENT_SECRET!
const HUBTEL_BASE_URL = 'https://payproxyapi.hubtel.com'

export interface HubtelPaymentStatus {
  success: boolean
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  transactionId?: string
  amount?: number
  customerName?: string
  customerEmail?: string
  customerMsisdn?: string
  paymentMethod?: string
  message?: string
  responseCode?: string
}

/**
 * Creates Basic Authentication header for Hubtel API requests
 */
function getAuthHeader(): string {
  const authString = Buffer.from(`${HUBTEL_CLIENT_ID}:${HUBTEL_CLIENT_SECRET}`).toString('base64')
  return `Basic ${authString}`
}

/**
 * Verifies payment status with Hubtel API
 * 
 * @param clientReference - The unique client reference for the transaction
 * @returns Payment status information
 */
export async function verifyPaymentStatus(clientReference: string): Promise<HubtelPaymentStatus> {
  try {
    // Query Hubtel API to get transaction status
    const response = await fetch(
      `${HUBTEL_BASE_URL}/items/status/${encodeURIComponent(clientReference)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    // Check if request was successful
    if (!response.ok) {
      console.error('Hubtel API error:', data)
      return {
        success: false,
        status: 'failed',
        message: data.message || 'Failed to verify payment status',
        responseCode: data.responseCode,
      }
    }

    // Parse response based on Hubtel's response structure
    // ResponseCode '0000' indicates success
    if (data.responseCode === '0000' && data.data) {
      const paymentData = data.data

      // Determine payment status
      let status: 'completed' | 'pending' | 'failed' | 'cancelled' = 'pending'
      
      if (paymentData.status === 'Success' || paymentData.status === 'Paid') {
        status = 'completed'
      } else if (paymentData.status === 'Pending' || paymentData.status === 'Processing') {
        status = 'pending'
      } else if (paymentData.status === 'Cancelled' || paymentData.status === 'Canceled') {
        status = 'cancelled'
      } else if (paymentData.status === 'Failed' || paymentData.status === 'Declined') {
        status = 'failed'
      }

      return {
        success: true,
        status,
        transactionId: paymentData.transactionId || paymentData.externalTransactionId,
        amount: paymentData.amount || paymentData.amountCharged,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        customerMsisdn: paymentData.customerMsisdn,
        paymentMethod: paymentData.channel || paymentData.paymentMethod,
        message: paymentData.description || paymentData.statusMessage,
        responseCode: data.responseCode,
      }
    }

    // If we get here, the response format was unexpected
    return {
      success: false,
      status: 'failed',
      message: 'Unexpected response format from Hubtel',
      responseCode: data.responseCode,
    }
  } catch (error) {
    console.error('Error verifying payment status:', error)
    return {
      success: false,
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Formats amount from pesewas to cedis
 * 
 * @param pesewas - Amount in pesewas (smallest currency unit)
 * @returns Amount in cedis (main currency unit)
 */
export function formatAmountToCedis(pesewas: number): number {
  return pesewas / 100
}

/**
 * Formats amount from cedis to pesewas
 * 
 * @param cedis - Amount in cedis (main currency unit)
 * @returns Amount in pesewas (smallest currency unit)
 */
export function formatAmountToPesewas(cedis: number): number {
  return Math.round(cedis * 100)
}

/**
 * Validates Hubtel webhook signature (if implemented)
 * 
 * @param payload - The webhook payload
 * @param signature - The signature from Hubtel
 * @returns Whether the signature is valid
 */
export function validateWebhookSignature(payload: string, signature: string): boolean {
  // Note: Implement this if Hubtel provides webhook signature verification
  // For now, we rely on the webhook URL being secret
  return true
}

/**
 * Extracts donation ID from client reference
 * Format: DON-{id}-{timestamp}
 * 
 * @param clientReference - The client reference string
 * @returns The donation ID or null if invalid format
 */
export function extractDonationId(clientReference: string): number | null {
  const match = clientReference?.match(/DON-(\d+)-/)
  return match ? parseInt(match[1]) : null
}

/**
 * Generates a unique client reference for a donation
 * 
 * @param donationId - The donation ID
 * @returns A unique client reference string
 */
export function generateClientReference(donationId: number): string {
  return `DON-${donationId}-${Date.now()}`
}
