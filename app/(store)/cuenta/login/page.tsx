'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, LockKeyhole, PackageCheck, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setIsLoading(false)

    if (signInError) {
      setError('Email o contrasena incorrectos.')
      return
    }

    const role = data.user?.app_metadata?.role === 'admin' ? 'admin' : 'user'
    router.push(role === 'admin' ? '/admin' : '/cuenta/mis-pedidos')
    router.refresh()
  }

  return (
    <section className="relative overflow-hidden bg-[#f3f5fb]">
      <div className="absolute inset-x-0 top-0 h-56 bg-rubber" />

      <div className="container-x relative grid min-h-[calc(100vh-180px)] items-center gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_430px]">
        <div className="relative hidden min-h-[520px] overflow-hidden rounded-lg bg-[#121629] text-white shadow-2xl shadow-slate-950/20 lg:block">
          <Image
            src="/fantini-hero-showroom.png"
            alt="Showroom de neumaticos Fantini"
            fill
            sizes="55vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,22,41,0.94),rgba(37,42,120,0.70),rgba(18,22,41,0.18))]" />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-xs font-black uppercase">
              <PackageCheck size={16} />
              Mi cuenta
            </p>
            <h1 className="max-w-xl font-display text-6xl font-bold leading-none">Segui tus pedidos y consultas</h1>
            <p className="mt-4 max-w-lg text-base font-semibold leading-7 text-white/82">
              Entra para revisar compras, datos de contacto y el historial de pedidos realizados en la tienda.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/10 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-rubber">Fantini Neumaticos</p>
              <h2 className="mt-1 font-display text-4xl font-bold leading-none text-[#121629]">Ingresar</h2>
            </div>
            <span className="grid h-11 w-11 flex-none place-items-center rounded-md bg-rubber text-white">
              <UserRound size={21} />
            </span>
          </div>

          <label className="block text-sm font-black text-slate-700" htmlFor="email">Email</label>
          <input
            id="email"
            className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="mt-4 block text-sm font-black text-slate-700" htmlFor="password">Contrasena</label>
          <input
            id="password"
            className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10"
            type="password"
            placeholder="Tu contrasena"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

          <button
            disabled={isLoading}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white shadow-lg shadow-rubber/20 transition hover:bg-[#1c205f] disabled:opacity-70"
          >
            {isLoading ? 'Ingresando...' : 'Entrar a mi cuenta'}
            {isLoading ? <LockKeyhole size={18} /> : <ArrowRight size={18} />}
          </button>

          <p className="mt-5 text-center text-sm font-semibold text-slate-600">
            No tenes cuenta?{' '}
            <Link href="/cuenta/registro" className="font-black text-rubber">
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}
