# Production Deployment Guide for drdwamenaelections.org

## Pre-Deployment Checklist

### 1. Environment Variables
Set these in your hosting platform (Vercel/Netlify/etc.):

```env
NEXT_PUBLIC_APP_URL=https://drdwamenaelections.org
HUBTEL_CLIENT_ID=your_production_client_id
HUBTEL_CLIENT_SECRET=your_production_client_secret
HUBTEL_MERCHANT_ACCOUNT_NUMBER=your_production_merchant_account
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_bcrypt_password_hash
JWT_SECRET=your_jwt_secret
```

### 2. Database Migration
Ensure the `transaction_reference` column exists in your Supabase database:

```sql
ALTER TABLE donations 
ADD COLUMN transaction_reference VARCHAR(50);

CREATE INDEX idx_donations_transaction_reference 
ON donations(transaction_reference);
```

### 3. Hubtel Dashboard Configuration

Login to your Hubtel merchant dashboard and configure:

#### Webhook URL
```
https://drdwamenaelections.org/api/hubtel/webhook
```

#### Return URL (Success)
```
https://drdwamenaelections.org/api/hubtel/callback?status=success&clientReference={reference}
```

#### Cancellation URL
```
https://drdwamenaelections.org/api/hubtel/callback?status=cancelled&clientReference={reference}
```

**Important**: Make sure to use your **production** Hubtel credentials, not test/sandbox credentials.

## Deployment Steps

### Step 1: Update Environment Variables
1. Go to your hosting platform dashboard (e.g., Vercel)
2. Navigate to your project settings
3. Add/update the environment variables listed above
4. Save changes

### Step 2: Deploy Code
```bash
# Commit all changes
git add .
git commit -m "Fix: Hubtel ClientReference length error and amount conversion"

# Push to production branch
git push origin main
```

### Step 3: Verify Deployment
1. Visit https://drdwamenaelections.org/donate
2. Check that the page loads correctly
3. Verify the donation form is functional

### Step 4: Test Payment Flow
1. Make a small test donation (e.g., GH¢5)
2. Verify you're redirected to Hubtel checkout
3. Complete the payment
4. Verify you're redirected back to your site
5. Check the donation appears in the admin dashboard

### Step 5: Configure Hubtel Webhooks
1. Login to Hubtel dashboard
2. Go to Settings → Webhooks
3. Add webhook URL: `https://drdwamenaelections.org/api/hubtel/webhook`
4. Enable webhook notifications for payment events
5. Test webhook delivery

## Post-Deployment Verification

### Test Scenarios

#### 1. Successful Payment
- [ ] Donation form submits successfully
- [ ] Redirected to Hubtel checkout
- [ ] Payment completes successfully
- [ ] Redirected to success page
- [ ] Donation appears in admin dashboard with "completed" status
- [ ] Correct amount is displayed

#### 2. Cancelled Payment
- [ ] Click cancel on Hubtel checkout
- [ ] Redirected to cancelled page
- [ ] Donation appears in admin dashboard with "cancelled" status

#### 3. Failed Payment
- [ ] Use invalid payment details
- [ ] Redirected to failed page
- [ ] Donation appears in admin dashboard with "failed" status

#### 4. Webhook Delivery
- [ ] Check Hubtel dashboard for webhook delivery logs
- [ ] Verify webhook endpoint is receiving notifications
- [ ] Confirm donation status updates via webhook

## Monitoring

### What to Monitor

1. **Payment Success Rate**
   - Check admin dashboard regularly
   - Monitor completed vs failed donations

2. **Webhook Delivery**
   - Check Hubtel dashboard for delivery status
   - Set up alerts for failed webhook deliveries

3. **Error Logs**
   - Monitor server logs for errors
   - Check for any API failures

4. **Database Records**
   - Verify all donations are being recorded
   - Check transaction_reference is being populated

## Troubleshooting

### Issue: Payments Not Completing
**Check**:
1. Hubtel credentials are correct (production, not test)
2. Webhook URL is correctly configured
3. Domain is accessible from Hubtel servers
4. SSL certificate is valid

### Issue: Webhook Not Receiving Notifications
**Check**:
1. Webhook URL is correct in Hubtel dashboard
2. Endpoint is publicly accessible
3. No firewall blocking Hubtel IPs
4. Check Hubtel dashboard for delivery errors

### Issue: Wrong Amounts Displayed
**Check**:
1. Frontend is sending amounts in cedis (not pesewas)
2. Backend is not dividing by 100
3. Database records show correct amounts

### Issue: ClientReference Too Long Error
**Check**:
1. Code has been deployed with the fix
2. `generateClientReference()` function is being used
3. Reference format is `DON-{8chars}-{8digits}` (21 chars total)

## Rollback Plan

If issues occur after deployment:

1. **Immediate**: Revert to previous deployment in hosting platform
2. **Check**: Review error logs to identify the issue
3. **Fix**: Apply necessary fixes
4. **Test**: Test thoroughly in staging/local environment
5. **Redeploy**: Deploy fixed version

## Support Contacts

### Hubtel Support
- Email: support@hubtel.com
- Phone: +233 30 281 0808
- Documentation: https://developers.hubtel.com

### Hosting Platform Support
- Check your hosting platform's support documentation
- Contact support if deployment issues occur

## Success Criteria

Deployment is successful when:
- ✅ Donation form loads correctly
- ✅ Payment initialization works (no ClientReference error)
- ✅ Redirect to Hubtel checkout works
- ✅ Payment completion redirects back correctly
- ✅ Donations appear in admin dashboard
- ✅ Amounts are displayed correctly
- ✅ Webhook notifications are received
- ✅ All payment statuses work (success, cancelled, failed)

## Next Steps After Deployment

1. **Monitor for 24 hours**: Watch for any errors or issues
2. **Test all scenarios**: Complete, cancelled, failed payments
3. **Verify webhooks**: Check delivery logs in Hubtel dashboard
4. **Update documentation**: Document any production-specific configurations
5. **Train staff**: Ensure admin users know how to use the dashboard

## Notes

- The ClientReference length issue has been fixed (21 chars vs 53 chars)
- Amount conversion issue has been fixed (5 cedis = 5 cedis, not 0.05)
- Database schema has been updated with transaction_reference column
- Payment verification API may need production credentials to work
- Webhook is the primary method for payment confirmation

## Deployment Date

Date: _____________
Deployed by: _____________
Version: _____________
Status: _____________

---

For questions or issues, refer to HUBTEL_FIX_SUMMARY.md for detailed technical information.
