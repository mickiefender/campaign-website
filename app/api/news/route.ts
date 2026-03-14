import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    // Only fetch published news for public API
    let query = supabase
      .from('news')
      .select(`
        *,
        category:news_categories(name, slug, color)
      `)

    query = query.eq('is_published', true)

    if (slug) {
      // Single article by slug
      const { data: newsData, error: slugError } = await query
        .eq('slug', slug)
        .maybeSingle()

      if (slugError) {
        console.error('Slug query error:', slugError)
        return NextResponse.json({ error: slugError.message }, { status: 500 })
      }

      if (newsData) {
        // Increment view count
        await supabase
          .from('news')
          .update({ view_count: (newsData.view_count || 0) + 1 })
          .eq('id', newsData.id)

        return NextResponse.json({
          news: [newsData],
          pagination: { page: 1, limit: 1, total: 1, totalPages: 1 }
        })
      } else {
        return NextResponse.json({ news: [], pagination: { page: 1, limit: 1, total: 0, totalPages: 0 } }, { status: 404 })
      }
    }

    // List mode
    if (category && category !== 'all') {
      query = query.eq('category.slug', category)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    query = query
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    const { data: news, error, count } = await query

    if (error) {
      console.error('Error fetching news:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Increment view count for list items (skip for single slug to avoid double-count)
    if (news && news.length > 0 && !slug) {
      for (const item of news) {
        await supabase
          .from('news')
          .update({ view_count: (item.view_count || 0) + 1 })
          .eq('id', item.id)
      }
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
    console.error('Error in GET /api/news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

