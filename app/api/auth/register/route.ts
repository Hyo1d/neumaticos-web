import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

type RegisterPayload = {
  name?: string
  email?: string
  password?: string
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as RegisterPayload | null
  const name = payload?.name?.trim()
  const email = payload?.email?.trim().toLowerCase()
  const password = payload?.password

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Completa nombre, email y contrasena.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'La contrasena debe tener al menos 8 caracteres.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (!supabase) {
    return NextResponse.json({ error: 'Auth no esta configurado.' }, { status: 500 })
  }

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: 'user' },
    user_metadata: { name }
  })

  if (error) {
    const message = error.message.toLowerCase().includes('already')
      ? 'Ese email ya esta registrado.'
      : 'No pudimos crear la cuenta.'

    return NextResponse.json({ error: message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
