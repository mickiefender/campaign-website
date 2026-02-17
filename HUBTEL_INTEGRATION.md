# Hubtel Payment Integration Guide

This document provides detailed information about the Hubtel payment integration for the campaign donation system.

## Overview

The application uses Hubtel's payment gateway to process donations. Hubtel supports multiple payment methods including:
- Mobile Money (MTN Mobile Money, Vodafone Cash, AirtelTigo Money)
- Visa/Mastercard credit and debit cards
- Bank transfers

## Setup Instructions

### 1. Get Hubtel Credentials

1. Sign up for a Hubtel account at [https://unity.hubtel.com](https://unity.hubtel.com)
2. Complete the merchant verification process
3. Navigate to your dashboard and obtain:
   - **Client ID**: Your API client identifier
   - **Client Secret**: Your API secret key
   - **Merchant Account Number**: Your receiving account number

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
HUBTEL_CLIENT_ID=your_client_id
HUBTEL_CLIENT_SECRET=your_client_secret
HUBTEL_MERCHANT_ACCOUNT_NUMBER=your_merchant_account_number
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configure Webhooks

In your Hubtel dashboard:
1. Go to Settings → Webhooks
2. Add your webhook URL: `https://yourdomain.com/api/hubtel/webhook`
3. Enable webhook notifications for payment events

## API Endpoints

### Initialize Payment
**Endpoint**: `POST /api/hubtel/initialize`

**Request Body**:
```json
{
  "amount": 50000,
  "email": "donor@example.com",
  "fullName": "John Doe",
  "phone": "+233241234567",
  "isAnonymous": false,
  "message": "Supporting the campaign"
}
```

**Response**:
```json
{
  "checkoutUrl": "https://checkout.hubtel.com/...",
  "clientReference": "DON-123-1234567890",
  "checkoutId": "abc123"
}
```

### Callback Handler
**Endpoint**: `GET /api/hubtel/callback`

Handles user redirects after payment completion on Hubtel's checkout page. Verifies payment status and redirects users to appropriate status pages.

**Query Parameters**:
- `status`: Payment status ('success', 'cancelled', 'failed')
- `clientReference`: Unique transaction reference (DON-{id}-{timestamp})
- `checkoutId`: Hubtel's checkout session ID (optional)

**Redirects To**:
- `/donate/success` - Payment completed successfully
- `/donate/cancelled` - Payment cancelled by user
- `/donate/pending` - Payment still processing
- `/donate/failed` - Payment failed

### Webhook Handler
**Endpoint**: `POST /api/hubtel/webhook`

Receives server-to-server payment status updates from Hubtel and updates the donation record in the database. This runs independently of the callback handler for redundancy.

**Webhook Payload Example**:
```json
{
  "ResponseCode": "0000",
  "Data": {
    "ClientReference": "DON-123-1234567890",
    "TransactionId": "HT-12345",
    "Amount": 500.00,
    "Status": "Success"
  }
}
```

## Payment Flow

### Complete Payment Flow

1. **User fills donation form** → Frontend collects donation details
2. **Initialize payment** → POST to `/api/hubtel/initialize`
   - Creates donation record in Supabase with status "pending"
   - Generates unique client reference (DON-{id}-{timestamp})
   - Sends payment request to Hubtel API
3. **Redirect to Hubtel** → User is redirected to Hubtel's secure checkout page
4. **Payment processing** → User completes payment via mobile money, card, or bank transfer
5. **Dual confirmation system**:
   - **Callback (User-facing)**: User is redirected to `/api/hubtel/callback`
     - Verifies payment status with Hubtel API
     - Updates donation record
     - Redirects user to appropriate status page
   - **Webhook (Server-to-server)**: Hubtel sends POST to `/api/hubtel/webhook`
     - Provides redundant payment confirmation
     - Updates donation record if not already updated
6. **User sees result** → Redirected to success/cancelled/pending/failed page

### Status Pages

- **Success Page** (`/donate/success`): Shows transaction details, receipt info, and next steps
- **Cancelled Page** (`/donate/cancelled`): Explains cancellation and offers to retry
- **Pending Page** (`/donate/pending`): Auto-checks status every 5 seconds, shows processing info
- **Failed Page** (`/donate/failed`): Shows error details and troubleshooting steps

## Database Schema

The `donations` table structure:

```sql
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  amount DECIMAL(10, 2) NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  transaction_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing

### Local Testing
1. Start the development server: `npm run dev`
2. Navigate to `/donate`
3. Fill in the donation form
4. Use Hubtel's test credentials for testing

### Test Credentials (Sandbox)
Hubtel provides test credentials for sandbox testing. Contact Hubtel support for sandbox access.

### Testing Callbacks and Webhooks Locally
Use a tool like [ngrok](https://ngrok.com/) to expose your local server:
```bash
ngrok http 3000
```

Then update your `.env.local`:
```env
NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io
```

Configure in Hubtel dashboard:
- Webhook URL: `https://your-ngrok-url.ngrok.io/api/hubtel/webhook`
- Return URL: `https://your-ngrok-url.ngrok.io/api/hubtel/callback?status=success&clientReference={reference}`
- Cancellation URL: `https://your-ngrok-url.ngrok.io/api/hubtel/callback?status=cancelled&clientReference={reference}`

### Testing Different Payment Scenarios

**Test Successful Payment:**
1. Complete payment on Hubtel checkout
2. Should redirect to `/donate/success`
3. Check database for status "completed"

**Test Cancelled Payment:**
1. Click cancel on Hubtel checkout
2. Should redirect to `/donate/cancelled`
3. Check database for status "cancelled"

**Test Pending Payment:**
1. Initiate mobile money payment but don't approve
2. Should redirect to `/donate/pending`
3. Page auto-checks status every 5 seconds

**Test Failed Payment:**
1. Use invalid payment details
2. Should redirect to `/donate/failed`
3. Check database for status "failed"

## Error Handling

### Common Errors

1. **Invalid Credentials**
   - Error: "Authentication failed"
   - Solution: Verify your Client ID and Secret are correct

2. **Invalid Merchant Account**
   - Error: "Invalid merchant account number"
   - Solution: Ensure the merchant account number is active and correct

3. **Webhook Signature Mismatch**
   - Error: "Invalid signature"
   - Solution: Verify webhook secret in Hubtel dashboard matches your configuration

4. **Database Connection Issues**
   - Error: "Database error"
   - Solution: Check Supabase credentials and connection

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **HTTPS**: Always use HTTPS in production for webhook endpoints
3. **Webhook Verification**: The webhook handler validates incoming requests
4. **API Keys**: Keep Client ID and Secret secure and rotate regularly
5. **Amount Validation**: Server-side validation prevents amount manipulation

## Production Deployment

### Checklist
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Configure production webhook URL in Hubtel dashboard
- [ ] Configure callback URLs (return and cancellation) in Hubtel dashboard
- [ ] Test all payment scenarios end-to-end
- [ ] Monitor webhook and callback delivery rates
- [ ] Set up error logging and monitoring
- [ ] Configure email notifications for failed payments
- [ ] Test status pages (success, cancelled, pending, failed)
- [ ] Verify payment verification API is working

### Environment Variables for Production
```env
HUBTEL_CLIENT_ID=prod_client_id
HUBTEL_CLIENT_SECRET=prod_client_secret
HUBTEL_MERCHANT_ACCOUNT_NUMBER=prod_merchant_account
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Hubtel Dashboard Configuration

In your Hubtel merchant dashboard, configure:

1. **Webhook URL**: `https://yourdomain.com/api/hubtel/webhook`
2. **Return URL**: `https://yourdomain.com/api/hubtel/callback?status=success&clientReference={reference}`
3. **Cancellation URL**: `https://yourdomain.com/api/hubtel/callback?status=cancelled&clientReference={reference}`

Note: The `{reference}` placeholder will be automatically replaced by Hubtel with the actual client reference.

## Monitoring and Logs

### Key Metrics to Monitor
- Payment success rate
- Webhook delivery rate
- Average payment processing time
- Failed payment reasons

### Logging
The application logs important events:
- Payment initialization
- Webhook callbacks
- Database updates
- Errors and exceptions

Check server logs for debugging:
```bash
# Development
npm run dev

# Production
pm2 logs
```

## Support

### Hubtel Support
- Email: support@hubtel.com
- Phone: +233 30 281 0808
- Documentation: https://developers.hubtel.com

### Application Issues
For issues with the integration code, check:
1. Server logs for error messages
2. Hubtel dashboard for payment status
3. Database records for donation status
4. Network tab in browser for API responses

## Migration Notes

This integration replaced the previous Paystack implementation. Key differences:

| Feature | Paystack | Hubtel |
|---------|----------|--------|
| Authentication | Bearer Token | Basic Auth |
| Amount Format | Pesewas (100 = ₵1) | Cedis (1.00 = ₵1) |
| Mobile Money | Limited | Full support |
| Local Support | International | Ghana-focused |
| Webhook Format | JSON with signature | JSON with response code |

## Utility Functions

The `lib/hubtel.ts` file provides reusable utility functions:

- `verifyPaymentStatus(clientReference)`: Verifies payment status with Hubtel API
- `extractDonationId(clientReference)`: Extracts donation ID from reference
- `generateClientReference(donationId)`: Generates unique reference
- `formatAmountToCedis(pesewas)`: Converts pesewas to cedis
- `formatAmountToPesewas(cedis)`: Converts cedis to pesewas

## Architecture

### Dual Confirmation System

The integration uses both callbacks and webhooks for reliability:

1. **Callback Handler** (`/api/hubtel/callback`):
   - User-facing redirect after payment
   - Verifies status with Hubtel API
   - Provides immediate feedback to user
   - Handles edge cases (pending, failed)

2. **Webhook Handler** (`/api/hubtel/webhook`):
   - Server-to-server notification
   - Redundant confirmation
   - Handles cases where callback fails
   - More reliable for final status

This dual approach ensures payment status is captured even if one method fails.

## Additional Resources

- [Hubtel API Documentation](https://developers.hubtel.com)
- [Hubtel Unity Dashboard](https://unity.hubtel.com)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Supabase Documentation](https://supabase.com/docs)
