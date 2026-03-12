'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis,
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination'
import { NewsArticle, Pagination as PaginationType } from './news-management'
import { Edit, Trash2, Eye, Newspaper } from 'lucide-react'
import Link from 'next/link'

interface Props {
  news: NewsArticle[]
  loading: boolean
  pagination: PaginationType
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPageChange: (page: number) => void
}

export function NewsList({ news, loading, pagination, onEdit, onDelete, onPageChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          News Articles ({pagination.total})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-muted-foreground">Loading news...</div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No news articles found</h3>
            <p className="text-muted-foreground mb-6">Create your first news article to get started.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {news.map((article) => (
                <div key={article.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent hover:border-accent-foreground transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg truncate">{article.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{article.summary}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" style={{ backgroundColor: (article.category?.color || '#dc2626') }}>
                        {article.category?.name || 'Uncategorized'}
                      </Badge>
                      {article.is_published && <Badge>Published</Badge>}
                      {article.is_featured && <Badge variant="secondary">Featured</Badge>}
                      {article.is_breaking && <Badge variant="destructive">Breaking</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Created {new Date(article.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(article.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(article.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Link href={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Pagination>
              <PaginationContent>
                {pagination.page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={(e) => {
                        e.preventDefault()
                        onPageChange(pagination.page - 1)
                      }}
                    />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationLink
                    isActive={pagination.page === 1}
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(1)
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                
                {pagination.page > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                {pagination.page !== 1 && pagination.page !== pagination.totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      isActive
                      onClick={(e) => e.preventDefault()}
                      className="pointer-events-none bg-primary text-primary-foreground"
                    >
                      {pagination.page}
                    </PaginationLink>
                  </PaginationItem>
                )}
                
                {pagination.totalPages > pagination.page + 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                {pagination.totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      isActive={pagination.page === pagination.totalPages}
                      onClick={(e) => {
                        e.preventDefault()
                        onPageChange(pagination.totalPages)
                      }}
                    >
                      {pagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                
                {pagination.page < pagination.totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={(e) => {
                        e.preventDefault()
                        onPageChange(pagination.page + 1)
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </>
        )}
      </CardContent>
    </Card>
  )
}

