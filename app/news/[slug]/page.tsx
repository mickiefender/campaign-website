'use client'

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, User, ArrowLeft, Share2, Newspaper } from "lucide-react"
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
  }
  author_name: string
  published_at: string
  view_count: number
}

export default function NewsArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchArticle()
    }
  }, [slug])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/news?slug=${slug}`)
      if (!response.ok) {
        setError(true)
        return
      }
      const data = await response.json()
      if (data.news && data.news.length > 0) {
        setArticle(data.news[0])
      } else {
        setError(true)
      }
    } catch (err) {
      console.error("Error fetching article:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center">
          <Newspaper className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    notFound()
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 py-16 lg:py-24">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="text-xs" style={{backgroundColor: (article.category?.color || "#dc2626")}}>
              {article.category?.name || 'News'}
            </Badge>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.published_at).toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author_name}
            </div>
            <div className="flex items-center gap-1">
              👁️ {article.view_count || 0} views
            </div>
          </div>
          {article.featured_image_url && (
            <div className="rounded-2xl overflow-hidden shadow-2xl mb-12">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-16 lg:py-24">
        <div className="prose prose-lg max-w-none lg:prose-xl">
          <div dangerouslySetInnerHTML={{ __html: article.content_html || article.summary || "" }} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-12 pt-12 border-t border-border">
          <Button variant="outline" asChild>
            <Link href="/news" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Article
          </Button>
        </div>
      </article>

      {/* Related Articles Placeholder */}
      <section className="bg-secondary/50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <p className="text-muted-foreground text-center">More campaign updates coming soon...</p>
        </div>
      </section>
    </div>
  )
}

