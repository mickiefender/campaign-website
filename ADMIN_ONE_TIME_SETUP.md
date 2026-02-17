# Admin One-Time Setup Implementation

## Overview

The admin account creation has been implemented as a **one-time only** process. Once an admin account is created, the setup page becomes inaccessible and no additional admin accounts can be created.

## Changes Made

### 1. API: `app/api/auth/register-admin/route.ts`
- Added check to prevent creating admin if one already exists
- Returns 403 error with message: "Admin account already exists. Setup is complete."
- This ensures only ONE admin can ever be created through the API

### 2. API: `app/api/admin/check-setup/route.ts` (NEW)
- Created new endpoint to check if admin setup is complete
- Returns `{ setupComplete: boolean, adminCount: number }`
- Used by setup page to determine if it should redirect

### 3. Page: `app/admin/setup/page.tsx`
- Added check on page load to see if admin already exists
- If admin exists, automatically redirects to `/admin/login`
- Shows loading spinner while checking setup status
- Added `Loader2` import for the loading animation

### 4. Middleware: `middleware.ts`
- Added `checkAdminExists()` function to query database
- If NO admin exists:
  - Redirects all `/admin/*` routes to `/admin/setup`
  - Only allows access to setup page
- If admin EXISTS:
  - Redirects `/admin/setup` to `/admin/login`
  - Normal authentication flow applies

## User Flow

### First Time Setup (No Admin Exists)
1. User navigates to `/admin` or `/admin/login`
2. Middleware detects no admin exists
3. User is redirected to `/admin/setup`
4. User creates admin account with setup key
5. After creation, user is redirected to login
6. Setup page now redirects to login if accessed again

### After Setup Complete (Admin Exists)
1. User navigates to `/admin/setup`
2. Setup page checks status and redirects to `/admin/login`
3. API returns 403 if someone tries to create another admin
4. Only one admin account exists in the system

## Security Features

1. **Setup Key Protection**: Requires `ADMIN_SETUP_KEY` from environment variables
2. **One-Time Only**: Cannot create multiple admin accounts
3. **Automatic Redirects**: Setup page inaccessible after creation
4. **API Protection**: Registration endpoint blocks additional admin creation
5. **Middleware Protection**: Server-side redirects prevent bypassing

## Environment Variables Required

```env
# Admin Setup (for creating first admin)
ADMIN_SETUP_KEY=your-secret-setup-key-here

# JWT Secret (for session management)
JWT_SECRET=your-32-plus-character-random-string

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing the Implementation

### Test 1: First Admin Creation
```bash
# 1. Ensure no admin exists in database
# 2. Navigate to /admin/setup
# 3. Fill in form with valid data and setup key
# 4. Account should be created successfully
# 5. Should redirect to login after 2 seconds
```

### Test 2: Setup Page After Admin Exists
```bash
# 1. After creating admin, navigate to /admin/setup
# 2. Should immediately redirect to /admin/login
# 3. No form should be visible
```

### Test 3: API Blocks Additional Admin
```bash
curl -X POST http://localhost:3001/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "another@example.com",
    "password": "Password123!",
    "name": "Another Admin",
    "secretKey": "your-secret-setup-key-here"
  }'

# Expected response:
# {
#   "error": "Admin account already exists. Setup is complete."
# }
# Status: 403 Forbidden
```

### Test 4: Check Setup Endpoint
```bash
curl http://localhost:3001/api/admin/check-setup

# Expected response (after setup):
# {
#   "setupComplete": true,
#   "adminCount": 1
# }
```

## Notes

- The implementation ensures **only one admin** can ever exist in the system
- If you need to reset the admin (e.g., lost credentials), you must manually delete the admin user from the database
- The setup key provides an additional layer of security during the initial setup
- All redirects happen both client-side (React) and server-side (Middleware) for security
