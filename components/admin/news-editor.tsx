'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Upload, X, Save, Eye, EyeOff, Image as ImageIcon } from 'lucide-react'

interface NewsCategory {
  id: string
  name: string
  slug: string
  color: string
}

interface Props {
  newsId?: string
  categories: NewsCategory[]
  onSave: () => void
  onClose?: () => void
}

export function NewsEditor({ newsId, categories, onSave, onClose }: Props) {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category_id: '',
    featured_image_url: '',
    author_name: 'Campaign Press Office',
    source: '',
    is_published: false,
    is_featured: false,
    meta_title: '',
    meta_description: '',
    og_image: ''
  })
  useEffect(() => {
    if (newsId) {
      loadNews()
    }
  }, [newsId])

  const loadNews = async () => {
    console.log('Loading news for ID:', newsId)
    try {
      const response = await fetch(`/api/admin/news/${newsId}`)
      console.log('Fetch response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('News data:', data)
        setFormData({
          title: data.news?.title || '',
          slug: data.news?.slug || '',
          summary: data.news?.summary || '',
          content: data.news?.content || '',
          category_id: data.news?.category_id || '',
          featured_image_url: data.news?.featured_image_url || '',
          author_name: data.news?.author_name || 'Campaign Press Office',
          source: data.news?.source || '',
          is_published: data.news?.is_published || false,
          is_featured: data.news?.is_featured || false,
          meta_title: data.news?.meta_title || '',
          meta_description: data.news?.meta_description || '',
          og_image: data.news?.og_image || ''
        })
      } else {
        const errorText = await response.text()
        console.error('Response not ok:', response.status, errorText)
        if (response.status === 404) {
          toast.error('News not found. This item may have been deleted. Create new article or refresh list.')
          setFormData({
            title: '',
            slug: '',
            summary: '',
            content: '',
            category_id: '',
            featured_image_url: '',
            author_name: 'Campaign Press Office',
            source: '',
            is_published: false,
            is_featured: false,
            meta_title: '',
            meta_description: '',
            og_image: ''
          })
        } else {
          toast.error('Failed to load news')
        }
      }
    } catch (error) {
      console.error('Load news error:', error)
      toast.error('Failed to load news')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const finalFormData = formData

    try {
      const method = newsId ? 'PATCH' : 'POST'
      const body = { ...finalFormData, id: newsId }

      const response = await fetch('/api/admin/news', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(newsId ? 'News updated successfully' : 'News created successfully')
        onSave()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save news')
      }
    } catch (error) {
      toast.error('Failed to save news')
    } finally {
      setLoading(false)
    }
  }

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('type', 'image')
    if (newsId) {
      formDataUpload.append('news_id', newsId)
    }

    try {
      const response = await fetch('/api/admin/news/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          featured_image_url: data.publicUrl
        }))
        toast.success('Image uploaded successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed')
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      featured_image_url: ''
    }))
  }

  const handleContentImageUpload = async () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = (input.files as FileList)[0]
      if (!file) return

      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('type', 'image')
      if (newsId) {
        formDataUpload.append('news_id', newsId)
      }

      try {
        const response = await fetch('/api/admin/news/upload', {
          method: 'POST',
          body: formDataUpload,
        })

        if (response.ok) {
          const data = await response.json()
          const imgTag = `<img src="${data.publicUrl}" alt="Uploaded image" class="max-w-full h-auto rounded-lg mx-auto d-block">\n\n`
          setFormData(prev => ({
            ...prev,
            content: prev.content + imgTag
          }))
          toast.success('Image inserted!')
        } else {
          toast.error('Upload failed')
        }
      } catch (error) {
        toast.error('Upload failed')
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{newsId ? 'Edit News Article' : 'Create New News Article'}</CardTitle>
            <CardDescription>
              Fill out the form to {newsId ? 'update' : 'create'} a news article
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose || (() => {})}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    }))
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published" className="cursor-pointer">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="is_featured" className="cursor-pointer">Featured</Label>
              </div>
            </div>

            <div>
              <Label>Featured Image</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    className="flex-1"
                  />
                  <Button type="button" size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>
                {formData.featured_image_url && (
                  <div className="relative group">
                    <img
                      src={formData.featured_image_url}
                      alt="Featured"
                      className="w-full max-w-sm h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Content *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={handleContentImageUpload}
                    variant="outline"
                    className="flex-1 justify-start"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Insert Image to Content
                  </Button>
                </div>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={20}
                  placeholder="Write your news article here. Click 'Insert Image to Content' to add images (appends to end)..."
                  className="font-sans"
                />
              </div>
            </div>

            <div>
              <Label>Summary</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                rows={3}
                placeholder="Short summary for previews (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author_name">Author</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="News source (optional)"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {newsId ? 'Update News' : 'Create News'}
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setFormData(prev => ({ ...prev, is_published: !prev.is_published }))}
              >
                {formData.is_published ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
