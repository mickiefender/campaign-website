-- =====================================================
-- NEWS & UPDATES MANAGEMENT DATABASE SCHEMA
-- =====================================================

-- Create news_categories table for organizing news
CREATE TABLE IF NOT EXISTS news_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#DC2626',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO news_categories (name, slug, description, color, display_order) VALUES
  ('Campaign News', 'campaign-news', 'Latest updates from the campaign trail', '#DC2626', 1),
  ('Announcements', 'announcements', 'Official announcements and statements', '#1D4ED8', 2),
  ('Events', 'events', 'Campaign events and rallies', '#16A34A', 3),
  ('Policy Updates', 'policy-updates', 'Policy proposals and updates', '#D97706', 4),
  ('Press Releases', 'press-releases', 'Official press releases', '#7C3AED', 5)
ON CONFLICT (slug) DO NOTHING;

-- Create news table for campaign-specific news
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  content_html TEXT,
  category_id UUID REFERENCES news_categories(id) ON DELETE SET NULL,
  featured_image_url TEXT,
  featured_image_public_id TEXT,
  author_name TEXT DEFAULT 'Campaign Press Office',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source TEXT,
  external_link TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_breaking BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on news table
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published news
CREATE POLICY "Anyone can view published news" ON news
  FOR SELECT USING (is_published = true);

-- Policy: Admins can manage all news
CREATE POLICY "Admins can manage all news" ON news
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Policy: Authors can manage their own news
CREATE POLICY "Authors can manage their own news" ON news
  FOR ALL USING (author_id = auth.uid());

-- Create indices for news table
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_is_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- Create news_media table for storing news images and attachments
CREATE TABLE IF NOT EXISTS news_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document', 'gallery')),
  url TEXT NOT NULL,
  public_id TEXT,
  filename TEXT,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  caption TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on news_media
ALTER TABLE news_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news media" ON news_media
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage news media" ON news_media
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create index for news_media
CREATE INDEX IF NOT EXISTS idx_news_media_news_id ON news_media(news_id);

-- Create news_comments table for news engagement
CREATE TABLE IF NOT EXISTS news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID REFERENCES news(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  parent_id UUID REFERENCES news_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on news_comments
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved comments" ON news_comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create comments" ON news_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage comments" ON news_comments
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create news_subscribers table for news notifications
CREATE TABLE IF NOT EXISTS news_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on news_subscribers
ALTER TABLE news_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON news_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON news_subscribers
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_categories_updated_at ON news_categories;
CREATE TRIGGER update_news_categories_updated_at
  BEFORE UPDATE ON news_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON news TO authenticated;
GRANT ALL ON news_categories TO authenticated;
GRANT ALL ON news_media TO authenticated;
GRANT ALL ON news_comments TO authenticated;
GRANT ALL ON news_subscribers TO authenticated;
GRANT ALL ON SCHEMA public TO authenticated;

