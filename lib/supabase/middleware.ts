import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

type CookieToSet = {
  name: string
  value: string
  options?: Partial<ResponseCookie>
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return response

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      }
    }
  })

  const { data: { user } } = await supabase.auth.getUser()
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAccountRoute = request.nextUrl.pathname.startsWith('/cuenta')
  const role = user?.app_metadata?.role
  const adminBypass = process.env.ADMIN_BYPASS === 'true'

  if (isAdminRoute && !adminBypass && role !== 'admin') {
    return NextResponse.redirect(new URL('/cuenta/login', request.url))
  }

  if (isAccountRoute && !request.nextUrl.pathname.includes('/login') && !request.nextUrl.pathname.includes('/registro') && !user) {
    return NextResponse.redirect(new URL('/cuenta/login', request.url))
  }

  return response
}
