# TODO: Fix News Share URLs on Production

## Steps (Vercel Deployment)

### 1. Code Fix ✅ (Completed by BlackboxAI)
- Updated `app/news/[slug]/page.tsx` baseUrl to auto-detect Vercel prod/preview/localhost
- Created dynamic baseUrl using window.location (client), Vercel env vars (server), fallback to placeholder

### 2. Local Dev Setup
```
# Add to .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
- Restart dev server: `pnpm dev`
- Test: Open news article → Share buttons/copy link use localhost:3000

### 3. Vercel Production Setup
**Project Settings > Environment Variables:**
```
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
```
- Redeploy after adding env var
- Test: Share buttons use production domain
- Validate OG: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 4. Verify
- Localhost: Shares localhost:3000
- Vercel Preview: Shares preview-domain.vercel.app
- Vercel Production: Shares custom domain (if set)

**Status: Ready for env var setup & deploy**

