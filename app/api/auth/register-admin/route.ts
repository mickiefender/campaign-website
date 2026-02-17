import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, secretKey } = body

    // Verify secret key to prevent unauthorized admin creation
    const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'setup-admin-2024'
    
    if (secretKey !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      )
    }

    // Check if any admin already exists (one-time setup)
    const { count, error: countError } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error checking existing admins:', countError)
      return NextResponse.json(
        { error: 'Failed to verify setup status' },
        { status: 500 }
      )
    }

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Admin account already exists. Setup is complete.' },
        { status: 403 }
      )
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if admin with this email already exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create admin user
    const { data: newAdmin, error } = await supabase
      .from('admin_users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          name: name || 'Admin',
          role: 'admin',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating admin:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Admin user created successfully',
        admin: { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
