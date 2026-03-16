# Dr. Charles Dwamena NPP Campaign Website - Full Features Documentation

## Overview
Modern Next.js 16 political campaign website for Dr. Charles Dwamena's bid for NPP General Secretary 2026. Features responsive design, Supabase backend, Hubtel payments/SMS, full admin dashboard.

**Key Highlights:**
- Mobile-first responsive UI with animations
- Secure donation processing via Hubtel (*713*2028# dial)
- Auto-gratitude SMS to donors
- News management with rich editor
- Volunteer/contact management
- Admin CRUD for all data
- Real-time stats and search/filter/pagination

## Public-Facing Features

### Homepage (`app/page.tsx`)
- **Scrolling Marquee**: Fixed top banner \"Lets rebuild to restore the love!!!\" (red theme).
- **Hero Section**: TypingName animation (Dr. Charles Dwamena), NPP GS-2026 badge, donation CTA dial *713*2028#, animated contestant card (rotating gradient background).
- **Animated Cards**: \"Join Our Team\" (volunteer link), \"Send Message\" (contact link).
- **About Section**: Flyer image, campaign story, AchievementTabs (education/political experience).
- **Vision Section**: 6 interactive pillars (Leadership Restoration, Firm Leadership, Good Decisions, Enabling Environment, In-Touch Leadership, Member Welfare). Click opens VisionModal with details.
- **Dynamic News**: Featured news carousel from `/api/news?featured=true` (title, summary, image, category badge, date/author). Links to `/news/[slug]`.
- **Ghana Map**: Interactive SVG map (`components/ghana-map.tsx`) with nationwide stats (16 regions, 3K+ communities, 480+ events, 83% coverage).
- **Auto Video Modal**: Plays `/compressed-2EgY30rG.mp4` on first visit (localStorage tracked), floating button for replays.
- **Header**: Fixed nav (Home/About/Vision/Contact/News), mobile hamburger, logo.
- **Footer**: From `components/footer.tsx`.

### Static Pages
| Page | Features |
|------|----------|
| `/about` | Mission, values, leadership, financial transparency. |
| `/vision` | Detailed 6 pillars. |
| `/news` & `/news/[slug]` | Searchable/filterable news, categories, rich previews. |
| `/volunteer` | Form (name/email/phone/region/roles/availability/commitment) → `/api/volunteer`. |
| `/donate` | Hubtel payment form (daily/monthly?), status pages (/success, /pending, /failed, /cancelled). |
| `/contact` | Form (name/email/subject/message) → `/api/contact`. |
| `/policies` | Campaign policies/commits. |

### UI/UX Features
- **Responsive**: Tailwind mobile-first, shadcn/ui components.
- **Animations**: SVG flags, card hovers/bounces, typing effect, modals, map interactions.
- **Theme**: NPP red/white/blue, dark mode support (`next-themes`).
- **Loading**: RouteLoader spinner.
- **Notifications**: Sonner toasts.

## Admin Panel (`/admin`)
Protected by `middleware.ts` (JWT auth via lib/auth.ts, default password: `admin123`).

### Authentication (`/admin/login`)
- Password login → JWT cookie (7-day expiry).
- Auto-redirect to dashboard.

### Dashboard (`/admin/page.tsx`)
- **Stats Cards**: Total donations (₵), donors, volunteers, messages, trends, today's messages.
- **Recent Activity**: Latest 5 donations/volunteers.

### Management Tables (`components/admin/*`)
All tables: Pagination (10/page), search, filters (status/region), status badges, actions (edit/approve/delete).

| Section | API | Features |
|---------|-----|----------|
| **Donations** | `/api/admin/donations` (GET/PATCH/EXPORT) | Status update (pending→completed), search name/email. |
| **Volunteers** | `/api/admin/volunteers` (GET/PATCH/region-stats) | Approve/reject, region filters, details dialog. |
| **Messages** | `/api/admin/messages` (GET/PATCH/EXPORT/DELETE) | Mark read/replied, search subject/email. |
| **News** | `/api/admin/news` (CRUD, categories, upload, `[id]`) | Quill rich editor (`components/admin/news-editor.tsx`), image upload, categories, list/editor (`news-management.tsx`, `news-list.tsx`). |
| **Stats** | `/api/admin/stats` | Aggregated KPIs. |

## Integrations & Backend
- **Database**: Supabase PostgreSQL (RLS enabled). Tables: `users`, `donations`, `volunteers`, `blog_posts` (news), `contact_messages`, `events`.
- **Payments/SMS**: Hubtel (replaced Paystack).
  - Dial *713*2028# for donations.
  - APIs: `/api/hubtel/initialize`, `/api/hubtel/callback` (SMS thanks via `lib/hubtel-sms.ts`), `/api/hubtel/webhook`.
  - Libs: `lib/hubtel.ts`, `lib/hubtel-sms.ts` (personalized: \"Dear [Name], thank you for GH¢[Amount]... Tetelesai!\").
- **Auth**: `lib/auth.ts` (bcrypt, jose JWT).
- **APIs** (public): `/api/news` (categories/route), `/api/volunteer`, `/api/contact`, `/api/auth/logout`.

## Components & Utilities
- **UI**: `header.tsx`, `footer.tsx`, `video-modal.tsx` (auto-open), `vision-modal.tsx`, `ghana-map.tsx`, `achievement-tabs.tsx`, `typing-name.tsx`, `route-loader.tsx`, admin tables/dialogs/editor.
- **Hooks**: `use-mobile.tsx`, `use-toast.ts`.
- **Libs**: `utils.ts`.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 18, TypeScript.
- **Styling**: Tailwind CSS, shadcn/ui, clsx/cva, lucide-react icons, Quill editor.
- **State/UI**: React Hook Form, Zod, Sonner toasts.
- **Backend/DB**: Supabase (auth/data).
- **Other**: Recharts (charts?), jsPDF/jspdf-autotable (exports?), next-themes.

## Setup & Deployment
See README.md for env vars (Supabase keys, Hubtel SMS_CLIENT_ID/SECRET, ADMIN_PASSWORD, JWT_SECRET).

1. `pnpm install`
2. Set `.env.local`.
3. `pnpm dev` → localhost:3000.
4. Admin: `/admin` (change password!).

**Production**: Vercel (set env vars), see PRODUCTION_DEPLOYMENT.md.

## Future/TODOs
- Anonymous donations, PDF/CSV exports, Ghana map enhancements, news styling fixes (see TODO*.md).

**Last Updated**: Based on codebase analysis.

