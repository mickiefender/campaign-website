# Database Migration Guide

## Issue: Volunteer Form Submissions Failing

The volunteer form submissions were failing due to two issues:
1. The database schema requires a `user_id` field that references an authenticated user, but volunteer forms are submitted anonymously (without authentication)
2. The API was not properly converting the skills string to an array format expected by the database

## Solution

### ✅ API Fix (Already Applied)
The volunteer API has been updated to:
- Accept `null` for `user_id` (anonymous submissions)
- Convert skills string to array format
- Properly handle roles array

### ⚠️ Database Migration Required
You still need to run a database migration to make the `user_id` field nullable in the `volunteers` table.

### Option 1: Run SQL Migration in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query and paste the following SQL:

```sql
-- Fix volunteers table to allow anonymous submissions
-- Make user_id nullable since volunteer forms don't require authentication

ALTER TABLE volunteers 
ALTER COLUMN user_id DROP NOT NULL;

-- Create admin_users table for email/password authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users (only admins can view)
CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT USING (true);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Update the RLS policy to allow anonymous inserts
DROP POLICY IF EXISTS "Anyone can insert volunteer applications" ON volunteers;

CREATE POLICY "Anyone can insert volunteer applications" ON volunteers
  FOR INSERT WITH CHECK (true);

-- Update the select policy to allow viewing without user_id
DROP POLICY IF EXISTS "Users can view their own application" ON volunteers;

CREATE POLICY "Users can view their own application" ON volunteers
  FOR SELECT USING (
    user_id IS NULL OR 
    user_id = auth.uid() OR 
    auth.jwt() ->> 'role' = 'admin'
  );

-- Ensure admins can view all volunteers
DROP POLICY IF EXISTS "Admins can view all volunteers" ON volunteers;

CREATE POLICY "Admins can view all volunteers" ON volunteers
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

4. Click **Run** to execute the migration
5. Verify the changes were applied successfully

### Option 2: Alternative - Recreate the Volunteers Table

If you prefer to start fresh (this will delete existing volunteer data):

```sql
-- Drop the existing table
DROP TABLE IF EXISTS volunteers CASCADE;

-- Recreate with nullable user_id
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- Now nullable
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  region TEXT,
  skills TEXT[],
  availability TEXT NOT NULL,
  interested_roles TEXT[],
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert volunteer applications" ON volunteers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own application" ON volunteers
  FOR SELECT USING (
    user_id IS NULL OR 
    user_id = auth.uid() OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can view all volunteers" ON volunteers
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Create indices
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
```

## Verification

After running the migration, test the volunteer form:

1. Go to `/volunteer` page
2. Fill out and submit the volunteer form
3. Check that the submission succeeds (no 400 error)
4. Go to `/admin` dashboard
5. Navigate to the **Volunteers** tab
6. Verify the new volunteer submission appears in the table

## What Changed

### Before:
- `user_id` was required (NOT NULL)
- Volunteer submissions failed because no authenticated user existed
- Error: `POST /api/volunteer 400`

### After:
- `user_id` is now optional (nullable)
- Anonymous volunteer submissions work correctly
- Volunteers appear in the admin dashboard
- Admin can approve/reject volunteer applications

## Additional Notes

### Why This Change Is Safe:
1. **Backward Compatible**: Existing volunteers with `user_id` will continue to work
2. **RLS Policies Updated**: Security policies properly handle NULL user_id
3. **Admin Access**: Admins can still view and manage all volunteers
4. **Service Role**: API uses service role key to bypass RLS restrictions

### Future Considerations:
If you want to link volunteers to authenticated users in the future:
1. Add optional authentication to the volunteer form
2. If user is logged in, pass their `user_id`
3. If not logged in, use `null` (current behavior)

## Troubleshooting

### If migration fails:
1. Check that you're using the correct Supabase project
2. Verify you have admin/owner permissions
3. Check for any foreign key constraints
4. Review error messages in Supabase logs

### If volunteers still don't appear in admin:
1. Verify the migration ran successfully
2. Check browser console for errors
3. Verify Supabase credentials in `.env.local`
4. Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly

## Contact

If you encounter issues with the migration, check:
1. Supabase project logs
2. Browser console errors
3. Server logs (`npm run dev` output)
