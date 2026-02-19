# Environment Variables Configuration

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ============================================
# ADMIN AUTHENTICATION
# ============================================

# Secret key for JWT token signing
# MUST be a strong random string (32+ characters minimum)
# Generate using: openssl rand -base64 32
JWT_SECRET=your-32-plus-character-random-string-for-jwt-signing

# ============================================
# SUPABASE DATABASE
# ============================================

# Your Supabase project URL
# Found in: Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase service role key (secret key with admin privileges)
# Found in: Supabase Dashboard > Settings > API > service_role key
# WARNING: Keep this secret! Never expose in client-side code
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# ============================================
# HUBTEL PAYMENT INTEGRATION (Optional)
# ============================================

# Hubtel API credentials for payment processing
# Get these from your Hubtel merchant account
HUBTEL_CLIENT_ID=your-hubtel-client-id
HUBTEL_CLIENT_SECRET=your-hubtel-client-secret
HUBTEL_MERCHANT_ACCOUNT=your-merchant-account-number

# ============================================
# HUBTEL SMS INTEGRATION (Optional)
# ============================================

# Hubtel SMS API credentials for sending gratitude messages
# Get these from your Hubtel SMS account
# Note: These may be the same as payment credentials or separate
HUBTEL_SMS_CLIENT_ID=your-hubtel-sms-client-id
HUBTEL_SMS_CLIENT_SECRET=your-hubtel-sms-client-secret

# SMS Sender ID (the name that appears as sender)
# Must be registered with Hubtel (max 11 characters)
# Examples: "DrDwamena", "NPP", "Campaign"
HUBTEL_SMS_SENDER_ID=DrDwamena

# ============================================
# NEXT.JS CONFIGURATION
# ============================================

# Set to 'production' when deploying
NODE_ENV=development
```

## How to Generate Secure Keys

### JWT Secret

**Option 1: Using OpenSSL (Recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Using Online Generator**
Visit: https://generate-secret.vercel.app/32

## Environment-Specific Configuration

### Development (.env.local)

```env
NODE_ENV=development
JWT_SECRET=dev-jwt-secret-change-in-production-32chars
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key
```

### Production (.env.production)

```env
NODE_ENV=production
JWT_SECRET=prod-jwt-secret-must-be-very-secure-32plus-chars
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
HUBTEL_CLIENT_ID=your-prod-hubtel-client-id
HUBTEL_CLIENT_SECRET=your-prod-hubtel-client-secret
HUBTEL_MERCHANT_ACCOUNT=your-prod-merchant-account
HUBTEL_SMS_CLIENT_ID=your-prod-sms-client-id
HUBTEL_SMS_CLIENT_SECRET=your-prod-sms-client-secret
HUBTEL_SMS_SENDER_ID=DrDwamena
```

## Security Best Practices

### ✅ DO:
- Use different keys for development and production
- Generate random, cryptographically secure keys
- Keep `.env.local` in `.gitignore`
- Rotate keys periodically (every 90 days recommended)
- Use environment variables in your hosting platform (Vercel, Netlify, etc.)
- Limit access to production environment variables

### ❌ DON'T:
- Commit `.env.local` to version control
- Share environment variables via email or chat
- Use simple or predictable keys
- Reuse keys across different projects
- Expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code

## Verifying Your Configuration

### Check if variables are loaded:

Create a test file `test-env.js`:

```javascript
console.log('Environment Variables Check:')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing')
```

Run: `node test-env.js`

## Deployment

### Vercel

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add each variable with its value
4. Select environment (Production, Preview, Development)
5. Save and redeploy

### Netlify

1. Go to **Site settings** > **Build & deploy** > **Environment**
2. Click **Edit variables**
3. Add each variable
4. Save and redeploy

### Other Platforms

Consult your hosting platform's documentation for setting environment variables.

## Troubleshooting

### Error: "JWT_SECRET is not defined"

**Solution**: Ensure `.env.local` exists and contains `JWT_SECRET`

### Error: "Cannot connect to Supabase"

**Solution**: 
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `SUPABASE_SERVICE_ROLE_KEY` is the service role key (not anon key)
3. Ensure no trailing spaces in the values

### Variables not loading

**Solution**:
1. Restart the development server: `npm run dev`
2. Check file is named exactly `.env.local` (not `.env.local.txt`)
3. Ensure file is in the project root directory
4. Check for syntax errors (no spaces around `=`)

## Example .env.local File

```env
# Copy this template and fill in your actual values

# Admin Authentication
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Hubtel Payment (Optional)
HUBTEL_CLIENT_ID=your-client-id
HUBTEL_CLIENT_SECRET=your-client-secret
HUBTEL_MERCHANT_ACCOUNT=your-merchant-account

# Hubtel SMS (Optional)
HUBTEL_SMS_CLIENT_ID=your-sms-client-id
HUBTEL_SMS_CLIENT_SECRET=your-sms-client-secret
HUBTEL_SMS_SENDER_ID=DrDwamena

# Environment
NODE_ENV=development
```

---

**Important**: After creating `.env.local`, restart your development server for changes to take effect.
