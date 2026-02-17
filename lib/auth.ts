import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SessionPayload {
  userId: string
  email: string
  role: string
  expiresAt: Date
}

export async function createSession(userId: string, email: string, role: string = 'admin') {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  const session = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

  return session
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as SessionPayload
  } catch (error) {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  
  if (!token) return null
  
  return verifySession(token)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function verifyAdminCredentials(email: string, password: string): Promise<{ valid: boolean; user?: any }> {
  try {
    // Query admin_users table
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !adminUser) {
      return { valid: false }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash)

    if (!isValidPassword) {
      return { valid: false }
    }

    return { valid: true, user: adminUser }
  } catch (error) {
    console.error('Error verifying credentials:', error)
    return { valid: false }
  }
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('session')?.value
  
  if (!token) return false
  
  const session = await verifySession(token)
  return session !== null
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
