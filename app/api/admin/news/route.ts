import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { revalidateTag } from 'next/cache'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')

    let query = supabase
      .from('news')
      .select(`
        *,
        category:news_categories(name, slug, color)
      `, { count: 'exact' })

    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }

    if (status === 'published') {
      query = query.eq('is_published', true)
    } else if (status === 'draft') {
      query = query.eq('is_published', false)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    query = query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    const { data: news, error, count } = await query

    if (error) {
      console.error('Error fetching news:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      news: news || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error in GET /api/admin/news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      summary,
      content,
      category_id,
      featured_image_url,
      author_name,
      source,
      external_link,
      is_published,
      is_featured,
      is_breaking,
      published_at,
      meta_title,
      meta_description,
      og_image
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Fix: Convert empty category_id string to null for UUID field
    const cleanCategoryId = category_id === '' ? null : category_id

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now()

    const { data, error } = await supabase
      .from('news')
      .insert({
        title,
        slug,
        summary,
        content,
        content_html: content,
        category_id: cleanCategoryId,
        featured_image_url,
        author_name: author_name || 'Campaign Press Office',
        author_id: (session as any).userId || null,
        source,
        external_link,
        is_published: is_published || false,
        is_featured: is_featured || false,
        is_breaking: is_breaking || false,
        published_at: is_published ? (published_at || new Date().toISOString()) : null,
        meta_title,
        meta_description,
        og_image
      })
      .select()
      .single()

    revalidateTag('news-all', '/news')
    revalidateTag('news-all', '/')

    if (error) {
      console.error('Error creating news:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ news: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      title,
      summary,
      content,
      content_html,
      category_id,
      featured_image_url,
      author_name,
      source,
      external_link,
      is_published,
      is_featured,
      is_breaking,
      published_at,
      meta_title,
      meta_description,
      og_image
    } = body

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 })
    }

    // Check if news exists
    const { data: existingNews } = await supabase
      .from('news')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!existingNews) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    // Update slug if title changed
    let slug
    if (title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now()
    }

    const updateData: any = {
      title,
      slug,
      summary,
      content,
      content_html: content,
      category_id: category_id === '' ? null : category_id,
      featured_image_url,
      author_name,
      source,
      external_link,
      is_published,
      is_featured,
      is_breaking,
      meta_title,
      meta_description,
      og_image
    }

    // Handle published_at
    if (is_published === true && !published_at) {
      updateData.published_at = new Date().toISOString()
    } else if (is_published === false) {
      updateData.published_at = null
    } else if (published_at) {
      updateData.published_at = published_at
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { data, error } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    revalidateTag('news-all', '/news')
    revalidateTag('news-all', '/')

    if (error) {
      console.error('Error updating news:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ news: data })
  } catch (error) {
    console.error('Error in PATCH /api/admin/news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting news:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidateTag('news-all', '/news')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

