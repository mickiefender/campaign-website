'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Newspaper, ArrowRight, Calendar, User, Loader2, Heart, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface NewsArticle {
  id: string
  title: string
  slug: string
  summary: string
  featured_image_url?: string
  category: {
    name: string
    slug: string
    color: string
  }
  published_at: string
  author_name?: string
  is_featured: boolean
  view_count?: number
}

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch news
      const newsRes = await fetch('/api/news?limit=12')
      if (!newsRes.ok) throw new Error('Failed to fetch news')
      const newsData = await newsRes.json()
      setNews(newsData.news || [])
      setFeaturedNews(newsData.news?.filter((n: NewsArticle) => n.is_featured) || [])

      // Fetch categories
      const catRes = await fetch('/api/news/categories')
      if (!catRes.ok) throw new Error('Failed to fetch categories')
      const catData = await catRes.json()
      setCategories(catData.categories || [])
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const SkeletonCard = () => (
    <div className="animate-pulse bg-card border border-border rounded-lg p-6">
      <div className="h-48 bg-muted rounded-md mb-4"></div>
      <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
      <div className="flex justify-between text-sm">
        <div className="h-4 bg-muted rounded w-20"></div>
        <div className="h-4 bg-muted rounded w-20"></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Red Marquee - Fixed Top z-60 */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white py-1 overflow-hidden">
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .marquee-text {
            animation: marquee 20s linear infinite;
            white-space: nowrap;
          }
        `}</style>
        <div className="marquee-text">
          <span className="text-sm md:text-base font-bold mx-8">
            Latest Campaign News & Updates • Latest Campaign News & Updates • Latest Campaign News & Updates •
          </span>
        </div>
      </div>

      {/* Fixed Header z-50 */}
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

      {/* Hero Section pt-32 */}
      <section className="relative pt-32 md:pt-36 py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Newspaper className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Campaign News
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest news, announcements, events, and achievements from Dr. Charles Dwamena&apos;s campaign journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="bg-gray-900 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg"
            >
              Support the Campaign
            </Link>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Get Involved</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="relative py-20 px-4 -mt-10">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-6">{error}</p>
              <Button onClick={fetchData} className="gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Retry
              </Button>
            </div>
          ) : (
            <>
              {/* Featured News */}
              {featuredNews.length > 0 && (
                <div className="mb-20">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured News</h2>
                  <p className="text-gray-600 mb-12">Highlighted campaign updates and announcements</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredNews.map((article) => (
                      <article key={article.id} className="group bg-white border border-gray-200 hover:border-red-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full">
                        <div className="relative h-56 lg:h-64 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-red-50 overflow-hidden">
                          {article.featured_image_url ? (
                            <Image
                              src={article.featured_image_url}
                              alt={article.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                          )}
                        </div>
                        <div className="p-8">
                          {article.category && (
                            <Badge 
                              className="mb-4 text-xs"
                              style={{ backgroundColor: article.category.color }}
                            >
                              {article.category.name}
                            </Badge>
                          )}
                          <h3 className="font-bold text-xl md:text-2xl mb-4 line-clamp-2 group-hover:text-red-600 transition text-gray-900">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">
                            {article.summary}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                            <span className="flex items-center gap-1">
                              <Calendar size={16} />
                              {new Date(article.published_at).toLocaleDateString()}
                            </span>
                            {article.author_name && (
                              <span className="flex items-center gap-1">
                                <User size={16} />
                                {article.author_name}
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/news/${article.slug}`}
                            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-base group-hover:translate-x-1 transition-all"
                          >
                            Read Full Story <ArrowRight size={18} />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* All News */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">All News</h2>
                <p className="text-gray-600 mb-12">
                  {news.length} total articles •{' '}
                  <Button variant="ghost" size="sm" onClick={fetchData} className="gap-1 h-8">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Refresh
                  </Button>
                </p>
                {news.length === 0 ? (
                  <div className="text-center py-24">
                    <Newspaper className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No news available</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                      Campaign news will appear here once published from the admin dashboard.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link href="/admin" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90">
                        Admin Dashboard
                      </Link>
                      <Link href="/donate" className="px-6 py-3 border border-gray-300 text-gray-900 rounded-xl font-semibold hover:bg-gray-50">
                        Support Us
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {news.map((article) => (
                      <article key={article.id} className="group bg-white border border-gray-200 hover:border-red-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                        <div className="relative h-48 md:h-52 bg-gradient-to-br from-gray-50 to-white group-hover:from-red-50 overflow-hidden">
                          {article.featured_image_url ? (
                            <Image
                              src={article.featured_image_url}
                              alt={article.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <Newspaper className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          {article.category && (
                            <Badge 
                              className="mb-3 text-xs"
                              style={{ backgroundColor: article.category.color }}
                            >
                              {article.category.name}
                            </Badge>
                          )}
                          <h3 className="font-bold text-lg md:text-xl mb-3 line-clamp-2 group-hover:text-red-600 transition text-gray-900">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
                            {article.summary}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(article.published_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart size={14} className="text-red-500 fill-red-50" />
                              {article.view_count || 0}
                            </span>
                          </div>
                          <Link
                            href={`/news/${article.slug}`}
                            className="mt-4 inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold text-sm group-hover:translate-x-1 transition-all block pt-2"
                          >
                            Read More <ArrowRight size={14} />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

