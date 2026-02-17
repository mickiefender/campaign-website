import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Convert skills string to array if it's a string
    let skillsArray: string[] = []
    if (body.skills) {
      if (typeof body.skills === 'string') {
        // Split by comma and trim whitespace
        skillsArray = body.skills
          .split(',')
          .map((skill: string) => skill.trim())
          .filter((skill: string) => skill.length > 0)
      } else if (Array.isArray(body.skills)) {
        skillsArray = body.skills
      }
    }
    
    // Ensure roles is an array
    const rolesArray = Array.isArray(body.roles) ? body.roles : []
    
    // Use service role client to bypass RLS for insert
    const { error } = await supabase
      .from('volunteers')
      .insert([
        {
          user_id: null, // Allow null for anonymous volunteer submissions
          full_name: body.fullName,
          email: body.email,
          phone: body.phone,
          region: body.region,
          address: body.address || null,
          city: body.city || null,
          skills: skillsArray,
          availability: body.availability,
          interested_roles: rolesArray,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])

    if (error) {
      console.error('Volunteer insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
