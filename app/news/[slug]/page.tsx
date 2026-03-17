import { createClient } from '@supabase/supabase-js'
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Calendar, User, ArrowLeft, Share2, Newspaper, Twitter, Facebook, MessageCircle, Mail, Clock, ChevronRight, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NewsArticle {
  id: string
  title: string
  slug: string
  summary: string
  content_html: string
  featured_image_url?: string
  category: {
    name: string
    color: string
    slug: string
  }
  author_name: string
  published_at: string
  view_count: number
}

interface RelatedArticle {
  id: string
  title: string
  slug: string
  featured_image_url?: string
  published_at: string
  category: {
    name: string
    color: string
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function fetchArticle(slug: string): Promise<NewsArticle | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      category:news_categories(name, slug, color)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error || !data) return null

  // Increment view count
  await supabase
    .from('news')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id)

  return data as NewsArticle
}

async function fetchRelated(categorySlug: string, currentSlug: string): Promise<RelatedArticle[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data } = await supabase
    .from('news')
    .select(`
      id, title, slug, featured_image_url, published_at,
      category:news_categories(name, color)
    `)
    .eq('category.slug', categorySlug)
    .eq('is_published', true)
    .neq('slug', currentSlug)
    .limit(3)
    .order('published_at', { ascending: false })

  // Fix type: map category as single object
  return (data || []).map((item: any) => ({
    ...item,
    category: item.category || { name: 'News', color: '#dc2626' }
  })) as RelatedArticle[]
}

const baseUrl = (() => {
  if (typeof window !== 'undefined') return window.location.origin
  return process.env.NEXT_PUBLIC_BASE_URL || 
         process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
         process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
         'https://your-campaign-domain.vercel.app'
})()

const getReadingTime = (htmlContent: string) => {
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ')
  const words = text.trim().split(' ').length
  return Math.ceil(words / 225)
}

export async function generateMetadata({ 
  params 
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await fetchArticle(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found'
    }
  }

  const imageUrl = article.featured_image_url || `${baseUrl}/image/campaign-logo1.png`
  
  return {
    title: `${article.title} | Dr. Charles Dwamena Campaign`,
    description: article.summary,
    openGraph: {
      title: `${article.title} | Dr. Charles Dwamena Campaign`,
      description: article.summary,
      images: imageUrl,
      url: `${baseUrl}/news/${slug}`,
      siteName: 'Dr. Charles Dwamena Campaign',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | Dr. Charles Dwamena Campaign`,
      description: article.summary,
      images: imageUrl
    }
  }
}

export default async function NewsArticlePage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const article = await fetchArticle(slug)
  let related: RelatedArticle[] = []

  if (article?.category?.slug) {
    related = await fetchRelated(article.category.slug, slug)
  }

  if (!article) {
    notFound()
  }

  const readingTime = getReadingTime(article.content_html || '')

  return (
    <>
      {/* SEO Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "image": article.featured_image_url || "",
            "author": {
              "@type": "Person",
              "name": article.author_name
            },
            "datePublished": article.published_at,
            "description": article.summary,
            "publisher": {
              "@type": "Organization",
              "name": "Dr. Charles Dwamena Campaign",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/image/campaign-logo1.png`
              }
            }
          }, null, 2)
        }}
        key="structured-data"
      />

      {/* Top Marquee Header - CSS classes instead of styled-jsx */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white py-1 overflow-hidden">
        <div className="animate-marquee-rtl whitespace-nowrap">
          <span className="text-sm md:text-base font-bold mx-8">
            Latest Campaign News & Updates • Latest Campaign News & Updates • Latest Campaign News & Updates •
          </span>
        </div>
      </div>

      {/* Fixed Header */}
      <header className="fixed top-[34px] md:top-[42px] left-0 right-0 z-50 bg-gradient-to-b backdrop-blur-md py-3 px-4 md:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/image/campaign-logo1.png"
              alt="Dr Dwamena Logo"
              width={150}
              height={50}
              className="object-contain"
              priority
            />
          </Link>

          <nav className="hidden sm:flex items-center gap-4 md:gap-8">
            <Link href="/" className="text-blue-900 text-sm md:text-base hover:text-primary transition font-medium">Home</Link>
            <Link href="/about" className="text-blue-900 text-sm md:text-base hover:text-primary transition font-medium">About</Link>
            <Link href="/vision" className="text-blue-900 text-sm md:text-base hover:text-primary transition font-medium">Vision</Link>
            <Link href="/news" className="text-blue-900 text-sm md:text-base hover:text-primary transition font-medium">News</Link>
            <Link href="/volunteer" className="text-blue-900 text-sm md:text-base hover:text-primary transition font-medium">Volunteer</Link>
            <Link href="/contact" className="text-blue-900 text-sm md:text-base hover:text-primary transition font-medium">Contact</Link>
          </nav>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-[140px] md:pt-[160px]">
        {/* Breadcrumbs */}
        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-red-600 transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/news" className="hover:text-red-600 transition">News</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-gray-900">{article.title}</span>
            </div>
          </div>
        </nav>

        {/* Hero Header */}
        <header className="bg-gradient-to-r from-gray-900/5 to-red-500/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6 pt-8 pb-4">
              <Badge className="text-xs px-3 py-1 font-medium" style={{backgroundColor: article.category.color || "#dc2626"}}>
                {article.category?.name || 'News'}
              </Badge>
             
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight text-gray-900 font-normal tracking-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-600 mb-12">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(article.published_at).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {article.author_name}
              </div>
            </div>
            {article.featured_image_url && (
              <div className="aspect-[3/2] lg:aspect-[16/9] relative rounded-3xl overflow-hidden shadow-2xl mb-16">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent/50 to-transparent" />
                <Image
                  src={article.featured_image_url}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 -mt-16 lg:-mt-24 relative z-10">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Main Content */}
            <article className="lg:col-span-2 prose prose-lg lg:prose-xl max-w-none mb-16 lg:mb-0">
              <div 
                className="prose prose-headings:font-black prose-headings:text-gray-900 prose-a:text-red-600 hover:prose-a:text-red-700 prose-strong:font-semibold prose-h2:border-b border-gray-200 pb-4 mb-8 prose-h3:border-l-4 border-red-500 pl-4"
                dangerouslySetInnerHTML={{ __html: article.content_html || article.summary || '' }} 
              />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Author Bio */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
                <h3 className="font-bold text-xl mb-4 text-gray-900">About Author</h3>
                <div className="flex items-center gap-4 mb-4">
<Image
                    src="/image/Dr.Dwamena_image.png"
                    alt="Dr. Charles Dwamena"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-2xl object-cover shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{article.author_name}</h4>
                    <p className="text-sm text-gray-600">Campaign Press Office</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Covering Dr. Charles Dwamena's campaign journey, policy announcements, and community engagements.
                </p>
              </div>

              {/* Share - Client component needed for interactivity, but basic for now */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
                <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share this article
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 break-all">
                    Copy link: {`${baseUrl}/news/${slug}`}
                  </div>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`${baseUrl}/news/${slug}`)}`} target="_blank" rel="noopener" className="block p-3 border rounded-xl hover:bg-gray-50 transition">
                    <Twitter className="w-4 h-4 inline mr-2" /> Twitter
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/news/${slug}`)}`} target="_blank" rel="noopener" className="block p-3 border rounded-xl hover:bg-gray-50 transition">
                    <Facebook className="w-4 h-4 inline mr-2" /> Facebook
                  </a>
                  <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + `${baseUrl}/news/${slug}`)}`} target="_blank" rel="noopener" className="block p-3 border rounded-xl hover:bg-gray-50 transition">
                    <MessageCircle className="w-4 h-4 inline mr-2" /> WhatsApp
                  </a>
                </div>
              </div>
            </aside>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-20 pt-12 border-t border-gray-200">
            <Button size="lg" variant="outline" asChild className="gap-2">
              <Link href="/news">
                <ArrowLeft className="w-5 h-5" />
                Back to News
              </Link>
            </Button>
            <Button size="lg" variant="default" className="gap-2 bg-red-600 hover:bg-red-700">
              <Mail className="w-5 h-5" />
              Contact Campaign
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="bg-gradient-to-r from-gray-50 to-white py-24 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">Related News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/news/${rel.slug}`} className="group block hover:shadow-xl transition-all rounded-3xl overflow-hidden bg-white shadow-lg hover:-translate-y-2">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      {rel.featured_image_url ? (
                        <Image
                          src={rel.featured_image_url}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <Newspaper className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <Badge variant="secondary" className="mb-4">{rel.category?.name || 'News'}</Badge>
                      <h3 className="font-bold text-xl line-clamp-2 mb-4 group-hover:text-red-600 transition">{rel.title}</h3>
                      <div className="text-sm text-gray-500">
                        {new Date(rel.published_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Print Styles - moved to CSS for server compatibility */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            aside, nav { display: none !important; }
            .prose { max-width: none; }
            header { page-break-after: avoid; }
          }
        `
      }} />
    </>
  )
}

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data } = await supabase
    .from('news')
    .select('slug')
    .eq('is_published', true)

  return data?.map(({ slug }) => ({ slug })) || []
}

