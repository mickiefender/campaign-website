# Replace Quill with Textarea + Image Upload

**Status:** Implementation started (1/6) ✅

- [x] 0. Plan created & approved
- [ ] 1. Remove ReactQuill dynamic import
- [ ] 2. Remove quillRef, modules, handleQuillChange, ImageUploadHandler
- [ ] 3. Replace Quill component with Textarea
- [ ] 4. Add content image upload button with cursor insertion
- [ ] 5. Update form submission (simplified)
- [ ] 6. Cleanup Quill CSS & test

**Plan:**
1. Remove ReactQuill dynamic import, quillRef, modules, handleQuillChange
2. Replace `<ReactQuill>` with `<Textarea>` bound to `formData.content`
3. Add "Insert Image" button - upload via `/api/admin/news/upload`, insert `<img src="URL" alt="image">` at cursor
4. Keep featured image upload unchanged
5. Remove Quill CSS from globals.css
6. Update form submission (already uses formData.content)

**Benefits:**
- No external dependencies
- Simple textarea works everywhere
- Image embedding via HTML tags
- Better mobile support
