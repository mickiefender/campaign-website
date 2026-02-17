# Hubtel Callback API Documentation

This document provides detailed information about the Hubtel callback API implementation for handling payment redirects and status verification.

## Overview

The callback API provides a robust system for handling user redirects after payment completion on Hubtel's checkout page. It verifies payment status with Hubtel's API and redirects users to appropriate status pages based on the payment outcome.

## Architecture

### Dual Confirmation System

The implementation uses both **callbacks** and **webhooks** for maximum reliability:

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ 1. Submits donation
       ▼
┌─────────────────────┐
│  Initialize API     │
│  /api/hubtel/       │
│  initialize         │
└──────┬──────────────┘
       │ 2. Creates donation (pending)
       │ 3. Redirects to Hubtel
       ▼
┌─────────────────────┐
│  Hubtel Checkout    │
│  (External)         │
└──────┬──────────────┘
       │ 4. User completes payment
       │
       ├─────────────────────────┬──────────────────────────┐
       │                         │                          │
       ▼                         ▼                          ▼
┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Callback    │      │    Webhook       │      │  Status Pages    │
│  (User)      │      │  (Server)        │      │                  │
│              │      │                  │      │  - Success       │
│ Verifies &   │      │ Confirms &       │      │  - Cancelled     │
│ Redirects    │      │ Updates DB       │      │  - Pending       │
│              │      │                  │      │  - Failed        │
└──────────────┘      └──────────────────┘      └──────────────────┘
```

## API Endpoints

### 1. Callback Handler

**Endpoint**: `GET /api/hubtel/callback`

**Purpose**: Handles user redirects after payment and verifies payment status.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | Yes | Payment status from Hubtel ('success', 'cancelled', 'failed') |
| `clientReference` | string | Yes | Unique transaction reference (DON-{id}-{timestamp}) |
| `checkoutId` | string | No | Hubtel's checkout session ID |

**Example URLs**:
```
Success: /api/hubtel/callback?status=success&clientReference=DON-123-1234567890
Cancelled: /api/hubtel/callback?status=cancelled&clientReference=DON-123-1234567890
```

**Flow**:
1. Validates required parameters
2. Extracts donation ID from client reference
3. Fetches donation record from database
4. Handles different status scenarios:
   - **Already completed**: Redirects to success page
   - **Cancelled**: Updates status and redirects to cancelled page
   - **Success/Unknown**: Verifies with Hubtel API
5. Updates database based on verified status
6. Redirects to appropriate status page

**Redirects**:
- `/donate/success?ref={reference}&amount={amount}` - Payment completed
- `/donate/cancelled?ref={reference}` - Payment cancelled
- `/donate/pending?ref={reference}` - Payment processing
- `/donate/failed?ref={reference}&reason={reason}` - Payment failed

### 2. Payment Verification Utility

**Function**: `verifyPaymentStatus(clientReference: string)`

**Location**: `lib/hubtel.ts`

**Purpose**: Queries Hubtel API to verify actual payment status.

**Returns**:
```typescript
interface HubtelPaymentStatus {
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
```

**Example Usage**:
```typescript
import { verifyPaymentStatus } from '@/lib/hubtel'

const status = await verifyPaymentStatus('DON-123-1234567890')
if (status.success && status.status === 'completed') {
  // Payment confirmed
}
```

## Status Pages

### Success Page (`/donate/success`)

**Features**:
- ✅ Transaction details display
- ✅ Receipt confirmation message
- ✅ Share functionality
- ✅ Next steps (volunteer, stay updated)
- ✅ Celebration animation

**Query Parameters**:
- `ref`: Client reference
- `amount`: Donation amount (optional)

### Cancelled Page (`/donate/cancelled`)

**Features**:
- ℹ️ Cancellation explanation
- ℹ️ Common reasons for cancellation
- ℹ️ Reassurance (no charges made)
- 🔄 Try again button
- 🏠 Return home option

**Query Parameters**:
- `ref`: Client reference

### Pending Page (`/donate/pending`)

**Features**:
- ⏳ Auto-refresh status (every 5 seconds)
- ⏳ Progress indicator
- ⏳ Manual check button
- ⏳ Processing time estimates
- ⏳ Important notes for users

**Query Parameters**:
- `ref`: Client reference

**Auto-Check Behavior**:
- Checks status every 5 seconds
- Maximum 12 checks (1 minute total)
- Automatically redirects when status changes
- Can be disabled by manual check

### Failed Page (`/donate/failed`)

**Features**:
- ❌ Error message display
- ❌ Common failure reasons
- ❌ Troubleshooting steps
- ❌ Alternative payment methods
- ❌ Support contact information

**Query Parameters**:
- `ref`: Client reference
- `error`: Error code
- `reason`: Error message

**Error Codes**:
- `missing_reference`: Payment reference missing
- `invalid_reference`: Invalid reference format
- `donation_not_found`: Donation record not found
- `update_failed`: Database update failed
- `processing_error`: General processing error

## Database Updates

### Donation Status Values

| Status | Description | Set By |
|--------|-------------|--------|
| `pending` | Payment initiated but not completed | Initialize API |
| `completed` | Payment successful | Callback/Webhook |
| `cancelled` | Payment cancelled by user | Callback |
| `failed` | Payment failed | Callback |

### Update Flow

```sql
-- Initial creation (Initialize API)
INSERT INTO donations (status, ...) VALUES ('pending', ...)

-- Success (Callback/Webhook)
UPDATE donations 
SET status = 'completed', 
    transaction_reference = 'DON-123-1234567890',
    updated_at = NOW()
WHERE id = 123

-- Cancelled (Callback)
UPDATE donations 
SET status = 'cancelled',
    updated_at = NOW()
WHERE id = 123

-- Failed (Callback)
UPDATE donations 
SET status = 'failed',
    updated_at = NOW()
WHERE id = 123
```

## Error Handling

### Callback Errors

**Missing Reference**:
```
Error: clientReference parameter is required
Action: Redirect to /donate/failed?error=missing_reference
```

**Invalid Reference Format**:
```
Error: Reference doesn't match DON-{id}-{timestamp} pattern
Action: Redirect to /donate/failed?error=invalid_reference
```

**Donation Not Found**:
```
Error: No donation record found for ID
Action: Redirect to /donate/failed?error=donation_not_found
```

**Database Update Failed**:
```
Error: Failed to update donation status
Action: Redirect to /donate/failed?error=update_failed
```

**Verification Failed**:
```
Error: Hubtel API returned error
Action: Redirect to /donate/failed?reason={error_message}
```

### Retry Logic

The system does NOT automatically retry failed verifications. Instead:
1. User is redirected to failed page
2. User can manually retry by clicking "Try Again"
3. Pending page auto-checks status for 1 minute
4. Webhook provides backup confirmation

## Security Considerations

### 1. Reference Validation
- Client reference format is strictly validated
- Only donations matching the reference can be updated
- Prevents unauthorized status changes

### 2. Status Verification
- Always verifies with Hubtel API before marking as completed
- Doesn't trust client-provided status alone
- Dual confirmation with webhook

### 3. Database Security
- Uses Supabase service role key (server-side only)
- Row-level security policies should be configured
- Prevents client-side manipulation

### 4. URL Security
- All redirects use relative URLs
- Base URL from environment variable
- Prevents open redirect vulnerabilities

## Testing

### Local Testing Setup

1. **Start development server**:
```bash
npm run dev
```

2. **Expose with ngrok**:
```bash
ngrok http 3000
```

3. **Update environment**:
```env
NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io
```

4. **Configure Hubtel dashboard**:
- Return URL: `https://your-ngrok-url.ngrok.io/api/hubtel/callback?status=success&clientReference={reference}`
- Cancellation URL: `https://your-ngrok-url.ngrok.io/api/hubtel/callback?status=cancelled&clientReference={reference}`

### Test Scenarios

**Scenario 1: Successful Payment**
```
1. Submit donation form
2. Complete payment on Hubtel
3. Verify redirect to /donate/success
4. Check database: status = 'completed'
5. Verify webhook also updated record
```

**Scenario 2: Cancelled Payment**
```
1. Submit donation form
2. Click cancel on Hubtel checkout
3. Verify redirect to /donate/cancelled
4. Check database: status = 'cancelled'
```

**Scenario 3: Pending Payment**
```
1. Submit donation form
2. Initiate mobile money but don't approve
3. Verify redirect to /donate/pending
4. Observe auto-check behavior
5. Approve payment on phone
6. Verify auto-redirect to success
```

**Scenario 4: Failed Payment**
```
1. Submit donation form
2. Use invalid payment details
3. Verify redirect to /donate/failed
4. Check database: status = 'failed'
5. Verify error message displayed
```

### Manual Testing URLs

Test callback directly (replace with actual reference):
```
Success: http://localhost:3000/api/hubtel/callback?status=success&clientReference=DON-1-1234567890
Cancelled: http://localhost:3000/api/hubtel/callback?status=cancelled&clientReference=DON-1-1234567890
```

## Monitoring

### Key Metrics

1. **Callback Success Rate**
   - Percentage of callbacks that successfully process
   - Target: >99%

2. **Verification Success Rate**
   - Percentage of successful Hubtel API verifications
   - Target: >95%

3. **Average Processing Time**
   - Time from callback to database update
   - Target: <2 seconds

4. **Status Distribution**
   - Completed: ~85-90%
   - Cancelled: ~5-10%
   - Failed: ~3-5%
   - Pending: ~1-2%

### Logging

Important events to log:
```typescript
// Callback received
console.log('Callback received:', { status, clientReference, checkoutId })

// Verification result
console.log('Payment verification result:', paymentStatus)

// Database update
console.log(`Donation ${donationId} marked as ${status}`)

// Errors
console.error('Callback processing error:', error)
```

## Troubleshooting

### Issue: Callback not triggered

**Possible Causes**:
- Incorrect return URL in Hubtel dashboard
- Network issues
- User closed browser before redirect

**Solution**:
- Verify return URL configuration
- Check Hubtel dashboard logs
- Rely on webhook for backup confirmation

### Issue: Payment verified but status not updated

**Possible Causes**:
- Database connection issue
- Invalid donation ID
- Race condition with webhook

**Solution**:
- Check database logs
- Verify donation exists
- Check if webhook already updated

### Issue: User sees pending page indefinitely

**Possible Causes**:
- Payment actually pending
- Verification API failing
- Network issues

**Solution**:
- Check Hubtel dashboard for payment status
- Verify API credentials
- Check server logs for errors

## Best Practices

1. **Always verify with Hubtel API** - Don't trust URL parameters alone
2. **Handle all status cases** - Success, cancelled, pending, failed
3. **Provide clear user feedback** - Explain what happened and next steps
4. **Log everything** - Helps with debugging and monitoring
5. **Use dual confirmation** - Callback + webhook for reliability
6. **Test all scenarios** - Success, failure, cancellation, pending
7. **Monitor metrics** - Track success rates and processing times
8. **Handle edge cases** - Network failures, timeouts, duplicates

## Support

For issues with the callback API:
1. Check server logs for errors
2. Verify Hubtel dashboard configuration
3. Test with ngrok for local debugging
4. Contact Hubtel support for API issues
5. Review this documentation for troubleshooting

## Changelog

### Version 1.0.0 (Current)
- Initial callback API implementation
- Payment verification utility
- Four status pages (success, cancelled, pending, failed)
- Auto-check functionality on pending page
- Comprehensive error handling
- Dual confirmation with webhook
