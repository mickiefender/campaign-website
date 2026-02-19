/**
 * Hubtel SMS Integration Utilities
 * 
 * This module provides utility functions for sending SMS messages via Hubtel SMS API.
 */

const HUBTEL_SMS_CLIENT_ID = process.env.HUBTEL_SMS_CLIENT_ID!
const HUBTEL_SMS_CLIENT_SECRET = process.env.HUBTEL_SMS_CLIENT_SECRET!
const HUBTEL_SMS_SENDER_ID = process.env.HUBTEL_SMS_SENDER_ID || 'DrDwamena'
const HUBTEL_SMS_BASE_URL = 'https://smsc.hubtel.com/v1/messages/send'

export interface SMSResponse {
  success: boolean
  messageId?: string
  status?: string
  message?: string
  error?: string
}

/**
 * Creates Basic Authentication header for Hubtel SMS API requests
 */
function getSMSAuthHeader(): string {
  const authString = Buffer.from(`${HUBTEL_SMS_CLIENT_ID}:${HUBTEL_SMS_CLIENT_SECRET}`).toString('base64')
  return `Basic ${authString}`
}

/**
 * Formats phone number to international format for Hubtel
 * Converts local Ghana numbers (0XX XXX XXXX) to international format (233XXXXXXXXX)
 * 
 * @param phoneNumber - Phone number in any format
 * @returns Formatted phone number in international format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '')
  
  // If number starts with 0, replace with 233 (Ghana country code)
  if (cleaned.startsWith('0')) {
    cleaned = '233' + cleaned.substring(1)
  }
  
  // If number doesn't start with country code, add 233
  if (!cleaned.startsWith('233')) {
    cleaned = '233' + cleaned
  }
  
  return cleaned
}

/**
 * Sends a gratitude SMS to a donor after successful payment
 * 
 * @param donorName - Name of the donor
 * @param donorPhone - Phone number of the donor
 * @param amount - Donation amount in GH¢
 * @returns SMS sending result
 */
export async function sendGratitudeSMS(
  donorName: string,
  donorPhone: string,
  amount: number
): Promise<SMSResponse> {
  try {
    // Validate inputs
    if (!donorPhone) {
      console.error('Cannot send SMS: Phone number is missing')
      return {
        success: false,
        error: 'Phone number is required',
      }
    }

    if (!HUBTEL_SMS_CLIENT_ID || !HUBTEL_SMS_CLIENT_SECRET) {
      console.error('Hubtel SMS credentials not configured')
      return {
        success: false,
        error: 'SMS service not configured',
      }
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(donorPhone)
    console.log('Sending SMS to:', formattedPhone)

    // Create personalized message
    const firstName = donorName.split(' ')[0] || 'Friend'
    const message = `Dear ${firstName}, thank you for your generous donation of GH¢${amount.toLocaleString()} to Dr. Dwamena's campaign. Tetelesai! NyameAye Awie!!`

    // Prepare SMS payload
    const payload = {
      From: HUBTEL_SMS_SENDER_ID,
      To: formattedPhone,
      Content: message,
      RegisteredDelivery: true, // Request delivery report
    }

    console.log('SMS Payload:', { ...payload, Content: message.substring(0, 50) + '...' })

    // Send SMS via Hubtel API
    const response = await fetch(HUBTEL_SMS_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': getSMSAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('Hubtel SMS API response status:', response.status)

    // Parse response
    const responseText = await response.text()
    console.log('Hubtel SMS API response:', responseText)

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse SMS response:', parseError)
      return {
        success: false,
        error: 'Invalid response from SMS service',
      }
    }

    // Check if request was successful
    if (!response.ok) {
      console.error('Hubtel SMS API error:', data)
      return {
        success: false,
        error: data.message || 'Failed to send SMS',
        status: data.status,
      }
    }

    // Hubtel SMS API returns different response formats
    // Success response typically includes MessageId
    if (data.MessageId || data.messageId) {
      console.log('SMS sent successfully:', data.MessageId || data.messageId)
      return {
        success: true,
        messageId: data.MessageId || data.messageId,
        status: data.Status || data.status || 'sent',
        message: 'SMS sent successfully',
      }
    }

    // If response format is unexpected but status is 200, consider it success
    if (response.status === 200 || response.status === 201) {
      console.log('SMS likely sent (status 200/201):', data)
      return {
        success: true,
        message: 'SMS sent successfully',
      }
    }

    // Unexpected response format
    console.warn('Unexpected SMS response format:', data)
    return {
      success: false,
      error: 'Unexpected response from SMS service',
    }
  } catch (error) {
    console.error('Error sending gratitude SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Sends a custom SMS message
 * 
 * @param phoneNumber - Recipient phone number
 * @param message - SMS message content
 * @returns SMS sending result
 */
export async function sendCustomSMS(
  phoneNumber: string,
  message: string
): Promise<SMSResponse> {
  try {
    if (!phoneNumber || !message) {
      return {
        success: false,
        error: 'Phone number and message are required',
      }
    }

    if (!HUBTEL_SMS_CLIENT_ID || !HUBTEL_SMS_CLIENT_SECRET) {
      console.error('Hubtel SMS credentials not configured')
      return {
        success: false,
        error: 'SMS service not configured',
      }
    }

    const formattedPhone = formatPhoneNumber(phoneNumber)

    const payload = {
      From: HUBTEL_SMS_SENDER_ID,
      To: formattedPhone,
      Content: message,
      RegisteredDelivery: true,
    }

    const response = await fetch(HUBTEL_SMS_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': getSMSAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()
    let data: any

    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      return {
        success: false,
        error: 'Invalid response from SMS service',
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to send SMS',
      }
    }

    return {
      success: true,
      messageId: data.MessageId || data.messageId,
      message: 'SMS sent successfully',
    }
  } catch (error) {
    console.error('Error sending custom SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Validates if SMS service is properly configured
 * 
 * @returns Whether SMS service is configured
 */
export function isSMSConfigured(): boolean {
  return !!(HUBTEL_SMS_CLIENT_ID && HUBTEL_SMS_CLIENT_SECRET)
}
