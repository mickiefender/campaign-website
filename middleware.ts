import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAdminExists(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('Error checking admin existence:', error)
      return false
    }
    
    return count ? count > 0 : false
  } catch (error) {
    console.error('Failed to check admin existence:', error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if admin setup is complete
  const adminExists = await checkAdminExists()

  // If no admin exists, only allow access to setup page
  if (!adminExists) {
    if (pathname.startsWith('/admin') && pathname !== '/admin/setup') {
      // Redirect all admin routes to setup page
      return NextResponse.redirect(new URL('/admin/setup', request.url))
    }
    // Allow access to setup page
    return NextResponse.next()
  }

  // Admin exists - handle normal authentication flow
  
  // If trying to access setup page when admin already exists, redirect to login
  if (pathname === '/admin/setup') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const authenticated = await isAuthenticated(request)

    if (!authenticated) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect to dashboard if already authenticated and trying to access login
  if (pathname === '/admin/login') {
    const authenticated = await isAuthenticated(request)
    
    if (authenticated) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
