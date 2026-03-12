import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const resolvedParams = await params
    const { id } = resolvedParams
    console.log('Fetching news ID:', id)

    if (!id) {
      console.error('No ID provided in params')
      return NextResponse.json({ error: 'News ID required' }, { status: 400 })
    }

    const { data: news, error } = await supabase
      .from('news')
      .select(`
        *,
        category:news_categories(
          id,
          name, 
          slug, 
          color
        )
      `)
      .eq('id', id)
      .single()

    if (error || !news) {
      console.error('Supabase query failed or no news. ID:', id, 'Error:', error)
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      news: {
        ...news,
        category_id: news.category?.id || null
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/news/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

