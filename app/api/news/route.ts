import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let query = supabase
      .from('news')
      .select(`
        *,
        category:news_categories(name, slug, color)
      `, { count: 'exact' })

    // Only fetch published news for public API
    query = query.eq('is_published', true)

    if (category && category !== 'all') {
      query = query.eq('category_slug', category)
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

    // Increment view count for each news item
    if (news && news.length > 0) {
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

