'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { LogOut, Save, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ProfileFormProps = {
  email: string
  initialProfile: {
    name: string
    phone: string
    document: string
    address: string
    city: string
    province: string
    postal_code: string
  }
}

export default function ProfileForm({ email, initialProfile }: ProfileFormProps) {
  const router = useRouter()
  const [profile, setProfile] = useState(initialProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  function updateField(field: keyof typeof profile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        document: profile.document.trim(),
        address: profile.address.trim(),
        city: profile.city.trim(),
        province: profile.province.trim(),
        postal_code: profile.postal_code.trim()
      }
    })

    setIsSaving(false)

    if (error) {
      toast.error('No pudimos guardar los datos.')
      return
    }

    toast.success('Datos guardados')
    router.refresh()
  }

  async function signOut() {
    setIsSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/cuenta/login')
    router.refresh()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={saveProfile} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-rubber">Mi cuenta</p>
            <h1 className="font-display text-4xl font-bold text-[#121629] sm:text-6xl">Mis datos</h1>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-md bg-rubber text-white">
            <UserRound size={22} />
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-black text-slate-700">
            Nombre y apellido
            <input
              value={profile.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10"
              required
            />
          </label>

          <label className="block text-sm font-black text-slate-700">
            Email de acceso
            <input
              value={email}
              className="mt-2 w-full rounded-md border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
              readOnly
            />
          </label>

          <label className="block text-sm font-black text-slate-700">
            Telefono
            <input
              value={profile.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10"
              type="tel"
              required
            />
          </label>

          <label className="block text-sm font-black text-slate-700">
            DNI / CUIT
            <input
              value={profile.document}
              onChange={(event) => updateField('document', event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10"
            />
          </label>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h2 className="font-display text-3xl font-bold text-[#121629]">Direccion de entrega</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-black text-slate-700 md:col-span-2">
              Calle, numero, piso o referencia
              <input
                value={profile.address}
                onChange={(event) => updateField('address', event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10"
              />
            </label>

            <label className="block text-sm font-black text-slate-700">
              Localidad
              <input
                value={profile.city}
                onChange={(event) => updateField('city', event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10"
              />
            </label>

            <label className="block text-sm font-black text-slate-700">
              Provincia
              <input
                value={profile.province}
                onChange={(event) => updateField('province', event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10"
              />
            </label>

            <label className="block text-sm font-black text-slate-700">
              Codigo postal
              <input
                value={profile.postal_code}
                onChange={(event) => updateField('postal_code', event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-rubber focus:bg-white focus:ring-4 focus:ring-rubber/10"
              />
            </label>
          </div>
        </div>

        <button
          disabled={isSaving}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white shadow-lg shadow-rubber/20 transition hover:bg-[#1c205f] disabled:opacity-70 sm:w-auto"
        >
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar datos'}
        </button>
      </form>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase text-rubber">Cuenta</p>
        <div className="mt-4 grid gap-2">
          <Link href="/cuenta/mis-pedidos" className="rounded-md border border-slate-200 px-4 py-3 text-sm font-black text-[#121629] transition hover:border-rubber hover:text-rubber">Mis pedidos</Link>
          <Link href="/catalogo" className="rounded-md border border-slate-200 px-4 py-3 text-sm font-black text-[#121629] transition hover:border-rubber hover:text-rubber">Comprar neumaticos</Link>
          <button
            type="button"
            onClick={signOut}
            disabled={isSigningOut}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-50 disabled:opacity-70"
          >
            <LogOut size={17} />
            {isSigningOut ? 'Saliendo...' : 'Cerrar sesion'}
          </button>
        </div>
      </aside>
    </div>
  )
}
