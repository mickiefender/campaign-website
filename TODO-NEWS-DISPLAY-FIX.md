# Fix News Content Display on Detail Page

**Issue:** News detail page expects `content_html`, but editor saves raw HTML to `content` without setting `content_html`.

## TODO Steps
- [x] 1. Create TODO-NEWS-DISPLAY-FIX.md
- [x] 2. Update app/api/admin/news/route.ts POST/PATCH to set `content_html = content`
- [x] 3. Test news creation/display
- [x] 4. Complete

**FIXED:** News content now displays on detail page. Raw HTML from editor → `content_html: content` in POST/PATCH.

