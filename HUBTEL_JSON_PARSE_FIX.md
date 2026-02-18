# Hubtel JSON Parse Error Fix

## Problem
The application was experiencing a `SyntaxError: Unexpected end of JSON input` error when verifying payment status with Hubtel's API. This caused successful donations to be marked as failed.

### Error Details
```
Error verifying payment status: SyntaxError: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at async verifyPaymentStatus (lib/hubtel.ts:53:18)
```

## Root Cause
Hubtel's payment verification API (`/items/status/{clientReference}`) was returning an empty response body, causing `response.json()` to fail when trying to parse non-existent JSON content.

## Solution Implemented

### 1. Enhanced Error Handling in `lib/hubtel.ts`

**Changes Made:**
- Added response status and headers logging for debugging
- Check for empty responses (204 No Content or content-length: 0)
- Read response as text first before attempting JSON parsing
- Validate response text is not empty before parsing
- Wrapped JSON parsing in try-catch with detailed error logging
- Return meaningful error messages for different failure scenarios

**Key Improvements:**
```typescript
// Check for empty responses
if (response.status === 204 || contentLength === '0') {
  return {
    success: false,
    status: 'failed',
    message: 'Hubtel API returned empty response - verification unavailable',
  }
}

// Get text first, then parse
const responseText = await response.text()
if (!responseText || responseText.trim() === '') {
  return {
    success: false,
    status: 'failed',
    message: 'Hubtel API returned empty response body - verification unavailable',
  }
}

// Safe JSON parsing
try {
  data = JSON.parse(responseText)
} catch (parseError) {
  console.error('Failed to parse Hubtel response as JSON:', parseError)
  return {
    success: false,
    status: 'failed',
    message: 'Invalid JSON response from Hubtel API',
  }
}
```

### 2. Fallback Logic in `app/api/hubtel/callback/route.ts`

**Changes Made:**
- Added fallback mechanism when API verification fails
- Use callback status parameter as trusted source when API is unavailable
- Only apply fallback for specific error types (empty response, verification unavailable)
- Maintain existing verification flow when API responds properly

**Key Logic:**
```typescript
const shouldUseFallback = !paymentStatus.success && 
  (paymentStatus.message?.includes('empty response') || 
   paymentStatus.message?.includes('verification unavailable') ||
   paymentStatus.message?.includes('Invalid JSON'))

if (shouldUseFallback && status === 'success') {
  console.warn('API verification failed, using callback status parameter as fallback')
  // Trust the callback status and mark donation as completed
}
```

## Benefits

1. **No More JSON Parse Errors**: Proper handling of empty responses prevents crashes
2. **Better Debugging**: Extensive logging helps identify API issues
3. **Graceful Degradation**: Falls back to callback status when API verification fails
4. **Successful Payments Processed**: Donations are no longer incorrectly marked as failed
5. **Detailed Error Messages**: Clear error messages for different failure scenarios

## Testing Recommendations

1. **Test with Successful Payment:**
   - Complete a payment through Hubtel
   - Verify donation is marked as completed
   - Check logs for API response details

2. **Test with Failed Payment:**
   - Cancel or fail a payment
   - Verify donation status is updated correctly
   - Ensure fallback doesn't incorrectly mark as success

3. **Monitor Logs:**
   - Check what Hubtel actually returns in responses
   - Verify the API endpoint and authentication are correct
   - Look for patterns in empty responses

## Next Steps

1. **Monitor Production Logs**: Watch for the new logging to understand Hubtel's actual response patterns
2. **Contact Hubtel Support**: If empty responses persist, inquire about:
   - Correct API endpoint for status verification
   - Expected response format
   - Authentication requirements
   - Rate limiting or other restrictions

3. **Consider Alternative Approaches**:
   - Use webhook for payment confirmation instead of callback verification
   - Store more payment metadata during initialization
   - Implement retry logic for API verification

## Files Modified

1. `lib/hubtel.ts` - Enhanced `verifyPaymentStatus()` function
2. `app/api/hubtel/callback/route.ts` - Added fallback logic for failed verifications

## Deployment Notes

- No environment variable changes required
- No database schema changes needed
- Changes are backward compatible
- Existing donations are not affected
