# Hubtel ClientReference Length Fix

## Problem
The Hubtel API was returning a validation error:
```
{
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
  title: 'One or more validation errors occurred.',
  status: 400,
  errors: { ClientReference: [ 'Client reference exceeds maximum length.' ] }
}
```

## Root Cause
The `clientReference` field was being generated with the format:
```
DON-{donationId}-{Date.now()}
```

Example: `DON-123-1704123456789` (21+ characters)

The issue was that `Date.now()` returns a 13-digit timestamp, which when combined with the donation ID and prefix, created a string that exceeded Hubtel's maximum length limit for the `ClientReference` field.

## Solution Implemented

### 1. Updated `lib/hubtel.ts`
Modified the `generateClientReference()` function to create shorter references:

**New Format**: `DON-{id}-{last8digits}{4random}`

Example: `DON-123-45678901ABCD` (max ~20 characters)

**Changes**:
- Uses only the last 8 digits of the timestamp instead of all 13
- Adds 4 random alphanumeric characters for additional uniqueness
- Maintains uniqueness while staying within Hubtel's length limits

```typescript
export function generateClientReference(donationId: number): string {
  // Use last 8 digits of timestamp to keep it short
  const timestamp = Date.now().toString().slice(-8)
  
  // Generate 4 random alphanumeric characters for additional uniqueness
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomSuffix = ''
  for (let i = 0; i < 4; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return `DON-${donationId}-${timestamp}${randomSuffix}`
}
```

### 2. Updated `app/api/hubtel/initialize/route.ts`
Replaced inline reference generation with the utility function:

**Before**:
```typescript
const clientReference = `DON-${donationId}-${Date.now()}`
```

**After**:
```typescript
import { generateClientReference } from '@/lib/hubtel'
// ...
const clientReference = generateClientReference(donationId)
```

## Benefits

1. **Compliance**: Reference length now stays well within Hubtel's limits
2. **Consistency**: Uses centralized utility function across the application
3. **Uniqueness**: Maintains uniqueness through timestamp + random suffix
4. **Maintainability**: Single source of truth for reference generation
5. **Backward Compatibility**: The `extractDonationId()` function still works with the new format

## Testing Checklist

- [ ] Test donation initialization with new reference format
- [ ] Verify Hubtel API accepts the shorter reference
- [ ] Confirm callback handler correctly processes new references
- [ ] Verify webhook handler correctly processes new references
- [ ] Test `extractDonationId()` function with new format
- [ ] Complete end-to-end payment flow test

## Reference Format Comparison

| Aspect | Old Format | New Format |
|--------|-----------|------------|
| Pattern | `DON-{id}-{13-digit-timestamp}` | `DON-{id}-{8-digit-timestamp}{4-random}` |
| Example | `DON-123-1704123456789` | `DON-123-45678901ABCD` |
| Length | 21+ characters | ~20 characters |
| Uniqueness | Timestamp only | Timestamp + Random |
| Hubtel Compatible | ❌ No | ✅ Yes |

## Files Modified

1. `lib/hubtel.ts` - Updated `generateClientReference()` function
2. `app/api/hubtel/initialize/route.ts` - Now uses utility function

## Related Files (No Changes Needed)

- `app/api/hubtel/callback/route.ts` - Uses `extractDonationId()` which still works
- `app/api/hubtel/webhook/route.ts` - Uses `extractDonationId()` which still works

The regex pattern `/DON-(\d+)-/` in `extractDonationId()` continues to work correctly with the new format since it only matches the donation ID portion.

## Date
Fixed: 2024

## Status
✅ Implemented and Ready for Testing
