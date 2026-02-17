# Admin User Setup Guide

## Overview

The admin authentication system now uses **email and password** stored securely in the database with bcrypt hashing. This guide will help you create your first admin user.

## Prerequisites

1. ✅ Database migration completed (see `DATABASE_MIGRATION_GUIDE.md`)
2. ✅ `admin_users` table created in Supabase
3. ✅ Environment variables configured

## Method 1: Using the Registration API (Recommended)

### Step 1: Set Admin Setup Key

Add this to your `.env.local` file:

```env
ADMIN_SETUP_KEY=your-secret-setup-key-here
```

**Important**: Use a strong, random string. This key prevents unauthorized admin creation.

### Step 2: Create Admin User via API

Use curl, Postman, or any HTTP client to call the registration endpoint:

```bash
curl -X POST http://localhost:3001/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "YourSecurePassword123!",
    "name": "Admin User",
    "secretKey": "your-secret-setup-key-here"
  }'
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "admin": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

### Step 3: Login

1. Navigate to `http://localhost:3001/admin`
2. You'll be redirected to the login page
3. Enter your email and password
4. Access the admin dashboard!

## Method 2: Direct Database Insert

If you prefer to create the admin user directly in the database:

### Step 1: Generate Password Hash

Create a simple Node.js script to hash your password:

```javascript
// hash-password.js
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Password hash:', hash);
}

hashPassword('YourSecurePassword123!');
```

Run it:
```bash
node hash-password.js
```

### Step 2: Insert into Database

Go to Supabase SQL Editor and run:

```sql
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@example.com',
  'Camp@china2028',
  'Admin User',
  'admin'
);
```

### Step 3: Verify

Query to check if admin was created:

```sql
SELECT id, email, name, role, created_at 
FROM admin_users 
WHERE email = 'admin@example.com';
```

## Method 3: Using Supabase Dashboard

### Step 1: Navigate to Table Editor

1. Go to your Supabase project
2. Click on **Table Editor**
3. Select `admin_users` table
4. Click **Insert row**

### Step 2: Fill in Details

- **email**: `admin@example.com`
- **password_hash**: Use the hash from Method 2, Step 1
- **name**: `Admin User`
- **role**: `admin`
- Leave `id`, `created_at`, `updated_at` as default

### Step 3: Save and Test

Click **Save** and try logging in at `/admin/login`

## Security Best Practices

### Password Requirements

Your admin password should:
- ✅ Be at least 12 characters long
- ✅ Include uppercase and lowercase letters
- ✅ Include numbers
- ✅ Include special characters
- ✅ Not be a common password
- ✅ Be unique (not used elsewhere)

### Example Strong Passwords

```
Campaign2024!Admin@NPP
Secure#Ghana$2024
NPP@dmin!Str0ng#2024
```

### After Setup

1. **Remove or Disable Registration Endpoint** (Production):
   - Comment out or delete `app/api/auth/register-admin/route.ts`
   - Or add additional security checks

2. **Rotate Setup Key**:
   - Change `ADMIN_SETUP_KEY` after creating admin users
   - Or remove it from `.env.local`

3. **Enable 2FA** (Future Enhancement):
   - Consider adding two-factor authentication
   - Use services like Authy or Google Authenticator

## Creating Additional Admin Users

### Option 1: Via Registration API

Use the same curl command with different email/password:

```bash
curl -X POST http://localhost:3001/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin2@example.com",
    "password": "AnotherSecurePassword!",
    "name": "Second Admin",
    "secretKey": "your-secret-setup-key-here"
  }'
```

### Option 2: Via Admin Panel (Future Feature)

You can build an admin user management page in the dashboard to:
- Create new admin users
- Update admin details
- Deactivate admin accounts
- Manage roles and permissions

## Troubleshooting

### Error: "Invalid setup key"

**Solution**: Verify `ADMIN_SETUP_KEY` in `.env.local` matches the `secretKey` in your request.

### Error: "Admin user with this email already exists"

**Solution**: The email is already registered. Use a different email or update the existing admin.

### Error: "Cannot connect to database"

**Solution**: 
1. Check Supabase credentials in `.env.local`
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. Ensure database migration was run successfully

### Error: "Invalid email or password" (Login)

**Solution**:
1. Verify email is correct
2. Ensure password matches what you set
3. Check if admin user exists in database:
   ```sql
   SELECT * FROM admin_users WHERE email = 'your-email@example.com';
   ```

### Password Hash Not Working

**Solution**:
1. Ensure bcryptjs is installed: `npm install bcryptjs`
2. Verify the hash was generated correctly
3. Try regenerating the hash and updating the database

## Environment Variables

Required in `.env.local`:

```env
# Admin Setup (for creating first admin)
ADMIN_SETUP_KEY=your-secret-setup-key-here

# JWT Secret (for session management)
JWT_SECRET=your-32-plus-character-random-string

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing Your Setup

### 1. Create Admin User

```bash
curl -X POST http://localhost:3001/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test Admin",
    "secretKey": "your-secret-setup-key-here"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### 3. Access Dashboard

Navigate to `http://localhost:3001/admin` in your browser.

## Next Steps

After creating your admin user:

1. ✅ Test login functionality
2. ✅ Access admin dashboard
3. ✅ Verify all tabs work (Overview, Donations, Volunteers, Messages, Reports)
4. ✅ Test data management features
5. ✅ Change default passwords
6. ✅ Secure the registration endpoint for production

## Support

If you encounter issues:

1. Check the server logs: `npm run dev` output
2. Check browser console for errors
3. Verify database migration was successful
4. Review Supabase logs in the dashboard
5. Ensure all environment variables are set correctly

---

**Security Note**: Never commit `.env.local` to version control. Keep your admin credentials secure and change them regularly.
