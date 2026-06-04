'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/cuenta/login')
    router.refresh()
  }

  return (
    <button type="button" onClick={logout} className="mt-3 flex w-full items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700">
      <LogOut size={18} />
      Cerrar sesion
    </button>
  )
}
