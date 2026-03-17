# Fix: Deleted news no longer shows in related posts ✓

**Completed:**
1. ✅ Added `revalidateTag('news-all')` to DELETE in `app/api/admin/news/route.ts`
2. ✅ Added `export const dynamic = 'force-dynamic'` to `app/news/[slug]/page.tsx`

**Result:** After delete, related posts now refresh excluding deleted news.

**Test:** Admin → Delete news → Check slug page related section.

**Next.js cache invalidated + dynamic fetch fixes stale data issue.**

