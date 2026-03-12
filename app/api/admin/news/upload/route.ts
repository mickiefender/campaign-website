import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { cookies } from 'next/headers'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const newsId = formData.get('news_id') as string
    const type = formData.get('type') as string || 'image'

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    if (!file.size || file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 })
    }

    if (type === 'image' && file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size must be less than 10MB' }, { status: 400 })
    }

    // Determine bucket based on type
    const bucket = type === 'document' ? 'news-documents' : 'news-images'
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`
    const filePath = `${newsId || 'temp'}/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    // Save metadata to news_media table if news_id provided
    let mediaRecord = null
    if (newsId) {
      const { data: mediaData, error: mediaError } = await supabase
        .from('news_media')
        .insert({
          news_id: newsId,
          type,
          url: publicUrl,
          public_id: uploadData.path,
          filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          display_order: 0
        })
        .select()
        .single()

      if (mediaError) {
        console.error('Error saving media record:', mediaError)
        // Don't fail the upload if media record fails
        mediaRecord = null
      } else {
        mediaRecord = mediaData
      }
    }

    return NextResponse.json({
      success: true,
      publicUrl,
      filePath: uploadData.path,
      mediaRecord
    })

  } catch (error) {
    console.error('Upload error:', error)
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
    const bucket = searchParams.get('bucket')
    const filePath = searchParams.get('path')

    if (!bucket || !filePath) {
      return NextResponse.json({ error: 'Bucket and path are required' }, { status: 400 })
    }

    const { error } = await supabase.storage
      .from(bucket as string)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

