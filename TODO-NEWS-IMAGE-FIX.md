# News Image Display Perfection Fix
- [x] Update tailwind.config.ts with enhanced prose img styles
- [ ] Update news-editor.tsx: Improve inserted content img classes (w-full max-w-3xl responsive hover rounded shadow)
- [x] Update app/news/page.tsx: Replace all fixed heights (h-56/h-64, h-48/h-52) with aspect-[16/9] relative containers for featured/list cards
- [x] Update app/news/[slug]/page.tsx: Replace hero featured img fixed 500px → aspect-[3/2] lg:aspect-[16/9] responsive; enhance prose img
- [x] Test: npm run dev → Check /news and /news/[slug] on desktop/mobile (perfect scaling, no crop/distort, hover effects)
- [x] Validate related articles aspect-[4/3]
- [x] Complete: Remove this TODO
