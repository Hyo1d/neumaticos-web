'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      const role = data.user.app_metadata?.role === 'admin' ? 'admin' : 'user'
      router.replace(role === 'admin' ? '/admin' : '/cuenta/perfil')
      router.refresh()
    })
  }, [router])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setError(payload?.error ?? 'No pudimos crear la cuenta.')
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    })

    setIsLoading(false)

    if (signInError) {
      router.push('/cuenta/login?created=1')
      return
    }

    router.push('/cuenta/perfil')
    router.refresh()
  }

  return (
    <section className="bg-[#f3f5fb]">
      <div className="container-x grid min-h-[calc(100vh-180px)] place-items-center py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/10 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-rubber">Mi cuenta</p>
              <h1 className="mt-1 font-display text-4xl font-bold leading-none text-[#121629]">Crear cuenta</h1>
            </div>
            <span className="grid h-11 w-11 flex-none place-items-center rounded-md bg-rubber text-white">
              <UserPlus size={21} />
            </span>
          </div>

          <label className="block text-sm font-black text-slate-700" htmlFor="name">Nombre</label>
          <input id="name" className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10" value={name} onChange={(event) => setName(event.target.value)} required />

          <label className="mt-4 block text-sm font-black text-slate-700" htmlFor="email">Email</label>
          <input id="email" className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

          <label className="mt-4 block text-sm font-black text-slate-700" htmlFor="phone">Telefono</label>
          <input id="phone" className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />

          <label className="mt-4 block text-sm font-black text-slate-700" htmlFor="password">Contrasena</label>
          <input id="password" className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />

          {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

          <button disabled={isLoading} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white shadow-lg shadow-rubber/20 transition hover:bg-[#1c205f] disabled:opacity-70">
            {isLoading ? 'Creando...' : 'Crear cuenta'}
            <ArrowRight size={18} />
          </button>

          <p className="mt-5 text-center text-sm font-semibold text-slate-600">
            Ya tenes cuenta? <Link href="/cuenta/login" className="font-black text-rubber">Ingresar</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
