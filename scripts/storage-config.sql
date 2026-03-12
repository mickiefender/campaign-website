-- =====================================================
-- STORAGE CONFIGURATION FOR NEWS IMAGES
-- =====================================================

-- Create storage bucket for news images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for news documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-documents',
  'news-documents',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Storage policies for news-images bucket

-- Allow anyone to view news images
CREATE POLICY "Public access to news images" ON storage.objects
  FOR SELECT USING (bucket_id = 'news-images');

-- Allow authenticated users to upload news images
CREATE POLICY "Authenticated users can upload news images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update news images
CREATE POLICY "Authenticated users can update news images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete news images
CREATE POLICY "Authenticated users can delete news images" ON storage.objects
  FOR DELETE USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');

-- Storage policies for news-documents bucket

-- Allow anyone to view news documents
CREATE POLICY "Public access to news documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'news-documents');

-- Allow authenticated users to upload news documents
CREATE POLICY "Authenticated users can upload news documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'news-documents' AND auth.role() = 'authenticated');

-- Allow authenticated users to update news documents
CREATE POLICY "Authenticated users can update news documents" ON storage.objects
  FOR UPDATE USING (bucket_id = 'news-documents' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete news documents
CREATE POLICY "Authenticated users can delete news documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'news-documents' AND auth.role() = 'authenticated');

-- Create folder structure for organization
-- (These are virtual folders - storage objects with null bytes in name)
INSERT INTO storage.objects (bucket_id, name, owner, created_at)
VALUES 
  ('news-images', 'featured/', NULL, CURRENT_TIMESTAMP),
  ('news-images', 'thumbnails/', NULL, CURRENT_TIMESTAMP),
  ('news-images', 'galleries/', NULL, CURRENT_TIMESTAMP)
ON CONFLICT (bucket_id, name) DO NOTHING;

