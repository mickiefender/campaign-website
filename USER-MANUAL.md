# Dr. Charles Dwamena NPP Campaign Website - User Manual

## Welcome 🎉
Thank you for visiting the official campaign website for **Dr. Charles Dwamena**, candidate for **NPP General Secretary 2026**. This modern, responsive site helps you learn about the campaign, get involved, donate securely, and stay updated.

**Quick Links**:
- [Homepage](#homepage)
- [Donate](#donate) (Dial *713*2028# or online)
- [Volunteer](#volunteer)
- [News](#news)
- [Admin Dashboard](#admin) (campaign staff)

**Site Theme**: NPP red/white/blue. Mobile-friendly. Auto-video on first visit (campaign message).

## Navigation
- **Fixed Header** (below red marquee \"Let's rebuild to restore the love!!!\"): Home, About, Vision, News, Volunteer, Contact, Donate.
- **Mobile**: Hamburger menu.
- **Footer**: Links, contact, social.

---

## 1. Homepage
**URL**: `/` (default)

**Features**:
- **Hero**: Typing \"Dr. Charles Dwamena\" + GS-2026 badge. **Donate CTA**: Dial *713*2028# (Hubtel mobile money).
- **Cards**: [Volunteer](#volunteer) | [Contact](#contact).
- **About**: Flyer image + achievements tabs (Education/Political Experience).
- **Vision**: 6 clickable pillars (e.g., \"Leadership Restoration\") → modal details.
- **Featured News**: Carousel (title/summary/image/category/date) → /news/[slug].
- **Ghana Map**: Interactive SVG (16 regions, 3K+ communities, 480+ events, 83% coverage). Hover/click stats.
- **Video**: Auto-plays campaign video on first visit (localStorage; replay button).

**Pro Tip**: Clear browser storage to re-see video.

---

## 2. Donate
**URL**: `/donate`

**Quick Donate**: Dial ***713*2028#** (Hubtel – mobile money/card).

**Online Flow**:
1. Select category (Daily/Weekly/Monthly/One-Time).
2. Choose amount (presets or custom GH¢5+).
3. Enter name/email/phone (optional anonymous checkbox).
4. Add message → **Pay Now** → Hubtel checkout (redirect).
5. **Status Pages**:
   | Status | URL | What Happens |
   |--------|-----|-------------|
   | Success | /donate/success | Receipt + personalized SMS thanks (\"Dear [Name], thank you for GH¢[Amount]... Tetelesai!\") |
   | Pending | /donate/pending | Auto-polls status (5s) |
   | Failed/Cancelled | /donate/failed or /cancelled | Retry option |

**Security**: Hubtel (PCI-compliant). Anonymous hides name/email in admin.

---

## 3. Volunteer
**URL**: `/volunteer`

**Form Fields**:
- Personal: Name*, Email*, Phone*, Region* (16 options).
- Roles*: Checkboxes (Campaign Ambassador, Events, Canvassing, Social Media, Fundraising, Admin).
- Skills (textarea), Availability* (Weekends/Evenings/Full-time/Flexible), Commitment* (Occasional/Regular/Dedicated).
- Message.

**Submit** → Confirmation. Data saved (admin reviews/approves).

**Benefits**: Flexible roles, community impact.

---

## 4. News
**URL**: `/news` (list) | `/news/[slug]` (detail)

**List**:
- **Featured**: Top carousel/grid.
- **All**: Grid (12+), category badges, search/filter planned.
- Each: Image, title/summary, category/date/author/views → detail.

**Detail**: Full article (Quill rich text/images).

**Admin publishes** via dashboard.

---

## 5. Other Pages
| Page | URL | Highlights |
|------|-----|------------|
| About | /about | Mission/values/leadership/transparency. |
| Vision | /vision | 6 pillars details. |
| Contact | /contact | Form (name/email/subject/message) → admin queue. |
| Policies | /policies | Commitments. |

---

## 6. Admin Dashboard (Campaign Staff Only)
**URL**: `/admin`

**Login**: Password `admin123` (change via ENV_VARIABLES.md). Auto-redirect if logged out.

**Dashboard Tabs** (search/filter/paginate/export):
1. **Overview**: Stats (donations/donors/volunteers/messages/trends), recent feeds, charts (donations bar/line), region pie (volunteers).
2. **Donations**: List (name/email/amount/status), update pending→completed, PDF export (anon-masked).
3. **Volunteers**: List (name/email/phone/region/status), approve/reject, details dialog (full form data), region filter.
4. **Messages**: List (name/email/subject/preview/status), mark read→replied, CSV export.
5. **News**: Management (Quill editor, image upload, categories, list CRUD).
6. **Reports**: Upcoming (monthly/financial/volunteer/regional).

**Logout**: Top-right icon.

**Security**: JWT (7-day), middleware protection.

---

## Troubleshooting
| Issue | Solution |
|-------|----------|
| Video replays | Clear localStorage (`campaign-video-seen`). |
| Donate fails | Check phone/network; retry *713*2028#. Contact support. |
| Form submit error | Refresh; check internet. Data queued. |
| Admin login fails | Default `admin123`; check env vars. |
| No news | Admin publishes first. |
| Mobile issues | Use Chrome/Safari latest. |

**Support**: /contact form or campaign phone/email (footer).

## For Campaign Admins (Setup)
1. `.env.local`: See [ENV_VARIABLES.md](ENV_VARIABLES.md).
2. `pnpm dev` → localhost:3000.
3. Supabase: Run scripts/*.sql.
4. Hubtel: Unity dashboard (payment/SMS creds).

**Version**: Based on current codebase. Questions? Contact dev.

© 2024 Dr. Charles Dwamena Campaign. All rights reserved.

