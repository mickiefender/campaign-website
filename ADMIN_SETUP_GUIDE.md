# Admin Panel Setup Guide

This guide will help you set up and use the admin panel for the NPP Campaign Website.

## 🚀 Quick Start

### 1. Install Dependencies

The required dependencies have already been installed:
- `jose` - For JWT token management
- `bcryptjs` - For password hashing (optional, currently using simple encoding)
- `@types/bcryptjs` - TypeScript types

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (copy from `.env.example`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Admin Authentication
ADMIN_PASSWORD=admin123
JWT_SECRET=your-secret-jwt-key-change-this-in-production

# Hubtel Payment Configuration (if not already set)
HUBTEL_CLIENT_ID=your_hubtel_client_id
HUBTEL_CLIENT_SECRET=your_hubtel_client_secret
HUBTEL_MERCHANT_ACCOUNT_NUMBER=your_merchant_account_number
```

**Important Security Notes:**
- Change `ADMIN_PASSWORD` from the default `admin123` to a strong password
- Generate a secure random string for `JWT_SECRET` (at least 32 characters)
- Never commit `.env.local` to version control

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Access the Admin Panel

Navigate to: `http://localhost:3000/admin`

You will be automatically redirected to the login page if not authenticated.

## 🔐 Login Credentials

**Default Password:** `admin123`

⚠️ **Change this immediately in production!**

To change the password, update the `ADMIN_PASSWORD` environment variable in `.env.local`.

## 📊 Admin Dashboard Features

### Overview Tab
- **Real-time Statistics**
  - Total donations amount
  - Total number of donors
  - Total volunteers registered
  - Contact messages count
  - Monthly trends for donations and volunteers
  
- **Recent Activity**
  - Latest 5 donations with donor names and amounts
  - Latest 5 volunteer registrations

### Donations Tab
- View all donations in a paginated table
- **Filters:**
  - Status: All, Completed, Pending, Failed
  - Search by donor name or email
- **Actions:**
  - Mark pending donations as completed
  - View full donation details
- **Columns:** Donor Name, Email, Amount, Status, Date

### Volunteers Tab
- View all volunteer applications
- **Filters:**
  - Status: All, Pending, Approved, Rejected
  - Region: All regions or specific region
  - Search by name or email
- **Actions:**
  - Approve pending applications
  - Reject applications
  - View full volunteer details
- **Columns:** Name, Email, Phone, Region, Status, Date

### Messages Tab
- View all contact form submissions
- **Filters:**
  - Status: All, New, Read, Replied
  - Search by name, email, or subject
- **Actions:**
  - Mark new messages as read
  - Mark read messages as replied
  - View full message content
- **Columns:** Name, Email, Subject, Status, Date

### Reports Tab
- Placeholder for future report generation features
- Will include:
  - Monthly campaign reports
  - Financial statements
  - Volunteer engagement reports
  - Regional analytics

## 🔒 Security Features

### Authentication
- Password-based login system
- JWT tokens with 7-day expiration
- HTTP-only cookies for session storage
- Automatic session refresh

### Route Protection
- Middleware protects all `/admin/*` routes
- Automatic redirect to login for unauthenticated users
- Session validation on every request

### API Security
- All admin API endpoints require authentication
- Session validation using JWT tokens
- Supabase service role key for database access

## 🛠️ Technical Implementation

### File Structure
```
app/
├── admin/
│   ├── page.tsx              # Main admin dashboard
│   └── login/
│       └── page.tsx          # Login page
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts      # Login API endpoint
│   │   └── logout/
│   │       └── route.ts      # Logout API endpoint
│   └── admin/
│       ├── stats/
│       │   └── route.ts      # Statistics API
│       ├── donations/
│       │   └── route.ts      # Donations management API
│       ├── volunteers/
│       │   └── route.ts      # Volunteers management API
│       └── messages/
│           └── route.ts      # Messages management API
components/
└── admin/
    └── data-table.tsx        # Reusable data table component
lib/
└── auth.ts                   # Authentication utilities
middleware.ts                 # Route protection middleware
```

### Database Tables Used
- `donations` - Stores donation records
- `volunteers` - Stores volunteer applications
- `contact_messages` - Stores contact form submissions

## 📝 Common Tasks

### Changing the Admin Password

1. Open `.env.local`
2. Update `ADMIN_PASSWORD=your_new_secure_password`
3. Restart the development server
4. Use the new password to login

### Adding Multiple Admins

Currently, the system supports a single admin password. To add multiple admins:

1. Extend the database schema to include an `admin_users` table (already exists in schema)
2. Modify `lib/auth.ts` to check against database records
3. Implement user management in the admin panel

### Exporting Data

To export data (future enhancement):
1. Add export buttons to each tab
2. Implement CSV/Excel generation
3. Use libraries like `papaparse` or `xlsx`

### Customizing the Dashboard

To add new features:
1. Create new API routes in `app/api/admin/`
2. Add new tabs in `app/admin/page.tsx`
3. Update the navigation tabs array
4. Implement the UI and data fetching logic

## 🐛 Troubleshooting

### Cannot Login
- Verify `ADMIN_PASSWORD` is set in `.env.local`
- Check browser console for errors
- Ensure the development server is running
- Clear browser cookies and try again

### Data Not Loading
- Verify Supabase credentials in `.env.local`
- Check that database tables exist (run `scripts/init-database.sql`)
- Verify `SUPABASE_SERVICE_ROLE_KEY` has proper permissions
- Check browser console and server logs for errors

### Session Expires Too Quickly
- JWT tokens expire after 7 days by default
- To change, modify the expiration in `lib/auth.ts`:
  ```typescript
  .setExpirationTime('7d') // Change to desired duration
  ```

### Middleware Not Working
- Ensure `middleware.ts` is in the root directory
- Check that the matcher pattern includes `/admin/:path*`
- Restart the development server after changes

## 🚀 Production Deployment

### Before Deploying:

1. **Change Default Password**
   ```bash
   ADMIN_PASSWORD=your_very_secure_password_here
   ```

2. **Generate Secure JWT Secret**
   ```bash
   # Generate a random 32-character string
   JWT_SECRET=$(openssl rand -base64 32)
   ```

3. **Set Environment Variables**
   - Add all environment variables to your hosting platform
   - Ensure `NODE_ENV=production`

4. **Enable HTTPS**
   - Cookies are set with `secure: true` in production
   - Requires HTTPS for proper security

5. **Test Authentication**
   - Test login/logout flow
   - Verify session persistence
   - Check all admin features

### Recommended Hosting Platforms:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Railway
- Render

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the implementation files
3. Check browser console and server logs
4. Verify environment variables are set correctly

## 🔄 Future Enhancements

Planned features:
- [ ] Data export (CSV/Excel)
- [ ] Charts and analytics
- [ ] Email notifications
- [ ] Bulk actions
- [ ] Role-based access control
- [ ] Audit logs
- [ ] Two-factor authentication
- [ ] Password reset functionality
- [ ] Activity dashboard
- [ ] Advanced filtering and search

---

**Last Updated:** 2024
**Version:** 1.0.0
