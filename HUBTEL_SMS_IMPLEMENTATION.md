# Hubtel SMS Integration - Implementation Guide

## Overview

This document describes the implementation of Hubtel SMS integration for sending gratitude messages to donors after successful payment completion.

## Features Implemented

### 1. Automatic Gratitude SMS
- **Trigger**: Sent automatically after successful donation payment
- **Message**: "Dear [Name], thank you for your generous donation of GH¢[Amount] to Dr. Dwamena's campaign. Tetelesai! NyameAye Awie!!"
- **Non-blocking**: SMS sending doesn't block payment completion
- **Error Handling**: Graceful failure - payment success is not affected by SMS failures

### 2. Phone Number Formatting
- Automatically converts local Ghana numbers (0XX XXX XXXX) to international format (233XXXXXXXXX)
- Handles various phone number formats
- Validates phone numbers before sending

## Files Created/Modified

### New Files
1. **`lib/hubtel-sms.ts`**
   - Core SMS utility functions
   - Phone number formatting
   - Hubtel SMS API integration
   - Error handling and logging

### Modified Files
1. **`app/api/hubtel/callback/route.ts`**
   - Added SMS sending after successful payment
   - Integrated with donation completion flow
   - Non-blocking SMS dispatch

2. **`ENV_VARIABLES.md`**
   - Added SMS-specific environment variables documentation
   - Configuration examples

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Hubtel SMS API Credentials
HUBTEL_SMS_CLIENT_ID=your-hubtel-sms-client-id
HUBTEL_SMS_CLIENT_SECRET=your-hubtel-sms-client-secret
HUBTEL_SMS_SENDER_ID=DrDwamena
```

### Getting Hubtel SMS Credentials

1. **Login to Hubtel Dashboard**: https://unity.hubtel.com/
2. **Navigate to SMS Section**: Go to SMS > API Settings
3. **Get Credentials**:
   - Client ID (API Key)
   - Client Secret (API Secret)
4. **Register Sender ID**:
   - Go to SMS > Sender IDs
   - Register "DrDwamena" or your preferred sender name
   - Wait for approval (usually 24-48 hours)

### Important Notes

- **Sender ID**: Must be registered and approved by Hubtel
- **Character Limit**: Sender ID max 11 characters
- **Same Credentials**: You may use the same credentials as payment API or separate ones
- **Testing**: Use Hubtel sandbox for testing before production

## SMS Message Template

The current message template is:

```
Dear [FirstName], thank you for your generous donation of GH¢[Amount] to Dr. Dwamena's campaign. Tetelesai! NyameAye Awie!!
```

### Customizing the Message

To change the SMS message, edit the `sendGratitudeSMS` function in `lib/hubtel-sms.ts`:

```typescript
const message = `Your custom message here with ${firstName} and ${amount}`
```

## API Integration Details

### Hubtel SMS API Endpoint
```
POST https://smsc.hubtel.com/v1/messages/send
```

### Authentication
- **Method**: Basic Authentication
- **Format**: Base64 encoded `CLIENT_ID:CLIENT_SECRET`

### Request Payload
```json
{
  "From": "DrDwamena",
  "To": "233XXXXXXXXX",
  "Content": "Your SMS message here",
  "RegisteredDelivery": true
}
```

### Response Format
```json
{
  "MessageId": "unique-message-id",
  "Status": "sent",
  "NetworkId": "network-id"
}
```

## Flow Diagram

```
Donation Payment Success
         ↓
Update Database (status: completed)
         ↓
Check SMS Configuration
         ↓
    [Configured?]
    ↙         ↘
  Yes          No
   ↓            ↓
Format Phone   Skip SMS
   ↓            ↓
Send SMS    Log Warning
   ↓
[Success?]
↙       ↘
Yes      No
↓        ↓
Log     Log Error
Success  (Continue)
   ↓
Redirect to Success Page
```

## Error Handling

### SMS Failures Don't Block Payment
- If SMS sending fails, the payment is still marked as successful
- Errors are logged for debugging
- User is redirected to success page regardless

### Common Error Scenarios

1. **SMS Not Configured**
   - Warning logged: "SMS service not configured"
   - Payment proceeds normally

2. **Missing Phone Number**
   - Warning logged: "Donor phone number not available"
   - Payment proceeds normally

3. **Invalid Phone Number**
   - SMS sending fails gracefully
   - Error logged with details

4. **Hubtel API Error**
   - Error logged with API response
   - Payment proceeds normally

## Testing

### Test SMS Sending

1. **Configure Environment Variables**
   ```bash
   # Add to .env.local
   HUBTEL_SMS_CLIENT_ID=your-test-client-id
   HUBTEL_SMS_CLIENT_SECRET=your-test-client-secret
   HUBTEL_SMS_SENDER_ID=DrDwamena
   ```

2. **Make a Test Donation**
   - Use Hubtel test credentials
   - Complete payment flow
   - Check console logs for SMS status

3. **Verify SMS Delivery**
   - Check recipient phone for SMS
   - Check Hubtel dashboard for delivery status

### Test Phone Number Formats

The system handles these formats:
- `0241234567` → `233241234567`
- `233241234567` → `233241234567`
- `+233241234567` → `233241234567`
- `024 123 4567` → `233241234567`

## Monitoring and Logs

### Console Logs

**Success:**
```
Sending gratitude SMS to donor: 233XXXXXXXXX
SMS sent successfully: message-id-12345
```

**Configuration Missing:**
```
SMS service not configured - skipping gratitude SMS
```

**Phone Missing:**
```
Donor phone number not available - skipping gratitude SMS
```

**Error:**
```
Failed to send gratitude SMS: [error message]
```

### Hubtel Dashboard

Monitor SMS delivery in Hubtel dashboard:
1. Login to https://unity.hubtel.com/
2. Go to SMS > Message History
3. View delivery status and reports

## Cost Considerations

- **SMS Cost**: Each SMS costs based on Hubtel pricing
- **Delivery Reports**: Enabled by default (`RegisteredDelivery: true`)
- **Failed Messages**: Not charged for failed deliveries

### Estimated Costs (Ghana)
- Local SMS: ~GH¢0.03 - GH¢0.05 per SMS
- International SMS: Higher rates apply
- Bulk discounts available

## Security Best Practices

1. **Never Commit Credentials**
   - Keep `.env.local` in `.gitignore`
   - Use environment variables in production

2. **Rotate Credentials Regularly**
   - Change API keys every 90 days
   - Update in all environments

3. **Monitor Usage**
   - Check Hubtel dashboard regularly
   - Set up usage alerts

4. **Validate Phone Numbers**
   - System validates before sending
   - Prevents sending to invalid numbers

## Troubleshooting

### SMS Not Sending

1. **Check Environment Variables**
   ```bash
   # Verify variables are set
   echo $HUBTEL_SMS_CLIENT_ID
   echo $HUBTEL_SMS_CLIENT_SECRET
   echo $HUBTEL_SMS_SENDER_ID
   ```

2. **Check Sender ID Status**
   - Login to Hubtel dashboard
   - Verify sender ID is approved

3. **Check Console Logs**
   - Look for error messages
   - Verify API responses

4. **Test API Credentials**
   - Use Postman or curl to test directly
   - Verify credentials work outside app

### SMS Delayed

- **Normal Delay**: 1-5 seconds
- **Network Issues**: Up to 1 minute
- **Peak Times**: May take longer

### Wrong Sender Name

- Verify `HUBTEL_SMS_SENDER_ID` is correct
- Ensure sender ID is approved in Hubtel
- Check for typos in environment variable

## Future Enhancements

Potential improvements:

1. **SMS Templates**
   - Multiple message templates
   - Language selection (English, Twi, etc.)

2. **Delivery Tracking**
   - Store SMS delivery status in database
   - Retry failed messages

3. **Bulk SMS**
   - Send campaign updates to all donors
   - Newsletter via SMS

4. **SMS Preferences**
   - Allow donors to opt-out
   - Preference management

## Support

For issues or questions:

1. **Hubtel Support**: support@hubtel.com
2. **Documentation**: https://developers.hubtel.com/
3. **Dashboard**: https://unity.hubtel.com/

## Changelog

### Version 1.0.0 (Current)
- Initial implementation
- Automatic gratitude SMS after donation
- Phone number formatting
- Error handling and logging
- Non-blocking SMS dispatch

---

**Last Updated**: December 2024
**Author**: Campaign Development Team
