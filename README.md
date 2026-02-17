# NPP Campaign Website

A comprehensive political campaign website for the New Patriotic Party (NPP) of Ghana, featuring donation management with Paystack integration, volunteer registration, news and updates, and an admin dashboard.

## Features

### Public Pages
- **Homepage** - Hero section with campaign overview and key statistics
- **About Page** - Mission, values, leadership, and financial transparency
- **Vision Page** - Six pillars of the campaign vision with implementation timeline
- **News Page** - Searchable and filterable campaign news and updates
- **Volunteer Page** - Registration form for volunteers with role selection
- **Donation Page** - Secure donation system with Paystack payment processing
- **Contact Page** - Contact form and support information
- **Policies Page** - Comprehensive campaign policies and commitments

### Admin Dashboard
- Campaign statistics and KPIs
- Donation tracking and analytics
- Volunteer management
- Contact message management
- Comprehensive reporting

### Technical Features
- **Database**: Supabase PostgreSQL with Row Level Security
- **Payment Processing**: Paystack integration for secure donations
- **Form Submissions**: Volunteer registrations, contact messages, and donations
- **Responsive Design**: Mobile-first design with modern UI
- **NPP Branding**: Red (#CE1126), white, and blue (#007FFF) color scheme

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Paystack Configuration
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### 2. Supabase Setup

The database has been initialized with the following tables:

- **users** - User accounts and authentication
- **donations** - Donation records with status tracking
- **volunteers** - Volunteer registrations
- **blog_posts** - Campaign news and updates
- **contact_messages** - Contact form submissions
- **events** - Campaign events and activities

All tables include Row Level Security (RLS) policies for data protection.

### 3. Paystack Setup

1. Create a Paystack account at https://paystack.com
2. Navigate to Settings → API Keys & Webhooks
3. Copy your Secret Key and Public Key
4. Add to your environment variables
5. Configure webhook URL: `https://your-domain.com/api/paystack/webhook`

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 to see the site.

## Project Structure

```
/app
  /admin - Admin dashboard
  /about - About page
  /vision - Vision page
  /news - Campaign news
  /volunteer - Volunteer registration
  /donate - Donation page
  /contact - Contact form
  /policies - Campaign policies
  /api
    /volunteer - Volunteer form submission API
    /contact - Contact form submission API
    /paystack
      /initialize - Initialize Paystack payment
      /webhook - Paystack webhook handler

/components
  header.tsx - Navigation header
  footer.tsx - Footer component

/scripts
  init-database.sql - Database schema setup
```

## API Routes

### POST /api/volunteer
Submits volunteer registration form. Required fields:
- fullName, email, phone, region, roles, availability, commitment

### POST /api/contact
Submits contact form. Required fields:
- name, email, subject, message

### POST /api/paystack/initialize
Initializes Paystack payment. Required fields:
- amount (in pesewas), email, fullName

### POST /api/paystack/webhook
Handles Paystack webhook callbacks to update donation status.

## Customization

### Colors
Edit `/app/globals.css` design tokens to change the color scheme:
- Primary (Red): `0 76% 44%`
- Secondary (Dark Blue): `240 10% 20%`
- Accent (Blue): `217 100% 44%`

### Content
- Edit `/app/page.tsx` for homepage content
- Update individual pages in `/app/` directories
- Modify footer links in `/components/footer.tsx`

### Navigation
Update navigation items in `/components/header.tsx`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Set environment variables in Vercel dashboard
4. Configure Supabase RLS policies as needed
5. Deploy!

## Security Considerations

- All donations are processed through Paystack's secure servers
- Supabase Row Level Security protects database data
- Contact forms and volunteer registrations are stored securely
- Admin dashboard should be password protected (implement auth)
- Paystack webhook signatures are verified

## Future Enhancements

- Implement admin authentication
- Add email notifications for form submissions
- Create detailed analytics dashboard
- Implement donor management system
- Add volunteer task assignment system
- Create event management system
- Build candidate profile pages
- Add social media integration

## Support

For issues or questions:
- Email: info@nppcampaign.gh
- Phone: +233 XXX XXX XXXX
- Visit: /contact page

## License

© 2024 NPP Campaign. All rights reserved.
