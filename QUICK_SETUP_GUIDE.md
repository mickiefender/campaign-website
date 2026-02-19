# Quick Setup Guide - Video Modal & SMS Integration

## 🚀 Quick Start (5 Minutes)

### Step 1: Add Environment Variables

Add these to your `.env.local` file:

```env
# Hubtel SMS Configuration
HUBTEL_SMS_CLIENT_ID=your-hubtel-sms-client-id
HUBTEL_SMS_CLIENT_SECRET=your-hubtel-sms-client-secret
HUBTEL_SMS_SENDER_ID=DrDwamena
```

### Step 2: Get Hubtel SMS Credentials

1. Go to https://unity.hubtel.com/
2. Login to your account
3. Navigate to **SMS** → **API Settings**
4. Copy your **Client ID** and **Client Secret**
5. Go to **SMS** → **Sender IDs**
6. Register "DrDwamena" as sender ID
7. Wait for approval (24-48 hours)

### Step 3: Test Locally

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Step 4: Test Features

**Test Video Modal:**
1. Open homepage in incognito/private window
2. Video should auto-open after 1 second
3. Close video and refresh - should NOT open again
4. Clear localStorage to test again:
   ```javascript
   localStorage.removeItem('campaign-video-seen')
   ```

**Test SMS (after Hubtel approval):**
1. Make a test donation
2. Complete payment successfully
3. Check console logs for SMS status
4. Verify SMS received on donor's phone

### Step 5: Deploy

```bash
# Build for production
npm run build

# Deploy to your hosting platform
# Don't forget to add environment variables!
```

---

## 📋 Environment Variables Checklist

Make sure you have ALL these variables:

```env
# ✅ Admin Authentication
JWT_SECRET=your-jwt-secret

# ✅ Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ✅ Hubtel Payment
HUBTEL_CLIENT_ID=your-payment-client-id
HUBTEL_CLIENT_SECRET=your-payment-client-secret
HUBTEL_MERCHANT_ACCOUNT=your-merchant-account

# ✅ Hubtel SMS (NEW)
HUBTEL_SMS_CLIENT_ID=your-sms-client-id
HUBTEL_SMS_CLIENT_SECRET=your-sms-client-secret
HUBTEL_SMS_SENDER_ID=DrDwamena
```

---

## 🧪 Testing Commands

### Clear Video Modal Flag
```javascript
// In browser console
localStorage.removeItem('campaign-video-seen')
```

### Check SMS Configuration
```javascript
// In browser console (on success page)
console.log('SMS Config:', {
  clientId: process.env.HUBTEL_SMS_CLIENT_ID ? '✅' : '❌',
  clientSecret: process.env.HUBTEL_SMS_CLIENT_SECRET ? '✅' : '❌',
  senderId: process.env.HUBTEL_SMS_SENDER_ID
})
```

### Test Phone Number Formatting
```javascript
// In Node.js or browser console
const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '233' + cleaned.substring(1)
  }
  if (!cleaned.startsWith('233')) {
    cleaned = '233' + cleaned
  }
  return cleaned
}

console.log(formatPhoneNumber('0241234567')) // Should be: 233241234567
```

---

## 🐛 Common Issues & Quick Fixes

### Issue: Video opens every time
**Fix:** Check if localStorage is enabled in browser

### Issue: SMS not sending
**Fix:** 
1. Check environment variables are set
2. Verify Hubtel credentials are correct
3. Ensure sender ID is approved

### Issue: Wrong SMS sender name
**Fix:** Update `HUBTEL_SMS_SENDER_ID` in `.env.local`

### Issue: SMS to wrong number
**Fix:** Check donation form captures phone correctly

---

## 📱 SMS Message Preview

Your donors will receive:

```
Dear John, thank you for your generous donation of GH¢100 to Dr. Dwamena's campaign. Tetelesai! NyameAye Awie!!
```

To customize, edit `lib/hubtel-sms.ts`:
```typescript
const message = `Your custom message here`
```

---

## 💰 Cost Estimate

**SMS Costs (Ghana):**
- Per SMS: ~GH¢0.03 - GH¢0.05
- 100 donations/month: ~GH¢3 - GH¢5
- 500 donations/month: ~GH¢15 - GH¢25

**Video Modal:**
- Cost: FREE (uses localStorage)

---

## 📚 Full Documentation

For detailed information, see:

- **Video Modal**: `VIDEO_MODAL_AUTO_DISPLAY.md`
- **SMS Integration**: `HUBTEL_SMS_IMPLEMENTATION.md`
- **Complete Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Environment Setup**: `ENV_VARIABLES.md`

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Hubtel SMS credentials verified
- [ ] Sender ID approved by Hubtel
- [ ] Video modal tested locally
- [ ] SMS sending tested locally
- [ ] Code committed to repository
- [ ] Documentation reviewed

---

## 🆘 Need Help?

**Hubtel Support:**
- Email: support@hubtel.com
- Dashboard: https://unity.hubtel.com/

**Documentation:**
- Hubtel API: https://developers.hubtel.com/

---

**Setup Time:** ~5 minutes (+ 24-48 hours for sender ID approval)

**Status:** ✅ Ready to Deploy

**Last Updated:** December 2024
