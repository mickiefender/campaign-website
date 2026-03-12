# TODO: Anonymous Donations Implementation

## Task: Show donor name/email in admin dashboard only if not anonymous

### Steps:

- [x] 1. Fix `app/api/hubtel/initialize/route.ts` - use correct database column names (donor_name, donor_email, donor_phone, anonymous)
- [x] 2. Update `app/api/admin/donations/route.ts` - add masking for anonymous donations (return masked values when anonymous=true)
- [x] 3. Update `app/admin/page.tsx` - show "Anonymous" badge and use display fields for donations table
- [x] 4. Update stats API - handle recent donations display for anonymous donors

## Changes Summary:

### 1. Initialize Route Fix:
- Change `full_name` → `donor_name`
- Change `email` → `donor_email` 
- Change `phone` → `donor_phone`
- Change `isAnonymous` → `anonymous`
- Added `payment_method: 'hubtel'`

### 2. Admin Donations API:
- Return `display_name`: actual name if not anonymous, "Anonymous Donor" if anonymous
- Return `display_email`: actual email if not anonymous, "••••••••" if anonymous
- Return `show_anonymous_badge`: true for anonymous donations

### 3. Admin Dashboard:
- Use `display_name` and `display_email` columns
- Add "Anonymous" badge next to donor name for anonymous donations
- Style hidden email with gray color

### 4. Stats API:
- Handle anonymous donations in recent donations feed
- Show "Anonymous Donor" instead of real name

