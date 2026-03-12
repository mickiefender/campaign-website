'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewsEditor } from './news-editor'
import { NewsList } from './news-list'
import { toast } from 'sonner'
import { Plus, Newspaper, Edit, Trash2, X } from 'lucide-react'

interface NewsCategory {
  id: string
  name: string
  slug: string
  color: string
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  slug: string
  is_published: boolean
  is_featured: boolean
  is_breaking: boolean
  published_at: string
  created_at: string
  category?: {
    name: string
    color: string
  }
}

export interface PaginationType {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function NewsManagement() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<NewsCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    featured: 'all'
  })
  const [selectedNews, setSelectedNews] = useState<string | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  useEffect(() => {
    fetchNews()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchNews()
  }, [filters, pagination.page])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: filters.status,
        category: filters.category,
        featured: filters.featured
      })
      
      const response = await fetch(`/api/admin/news?${params}`)
      if (response.ok) {
        const data = await response.json()
        setNews(data.news)
        setPagination(data.pagination)
      }
    } catch (error) {
      toast.error('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/news/categories?include_count=true')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleEditNews = (newsId: string) => {
    setSelectedNews(newsId)
    setIsEditorOpen(true)
  }

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return

    try {
      const response = await fetch(`/api/admin/news?id=${newsId}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('News deleted successfully')
        fetchNews()
      } else {
        toast.error('Failed to delete news')
      }
    } catch (error) {
      toast.error('Failed to delete news')
    }
  }

  const refreshNews = () => {
    fetchNews()
    setIsEditorOpen(false)
    setSelectedNews(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Management</h1>
          <p className="text-muted-foreground">Manage campaign news and updates</p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New News Article
        </Button>
      </div>

      {/* News Editor Dialog */}
{isEditorOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditorOpen(false)
              setSelectedNews(null)
            }
          }}
        >
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl relative">

            <NewsEditor 
              newsId={selectedNews || undefined}
              categories={categories}
              onSave={refreshNews}
              onClose={() => {
                setIsEditorOpen(false)
                setSelectedNews(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <select 
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <select 
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Featured</label>
              <select 
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                value={filters.featured}
                onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
              >
                <option value="all">All</option>
                <option value="true">Featured Only</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <NewsList 
        news={news}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditNews}
        onDelete={handleDeleteNews}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />
    </div>
  )
}

