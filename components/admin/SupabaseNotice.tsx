import { hasSupabaseAdminEnv } from '@/lib/supabase/admin'

export default function SupabaseNotice() {
  if (hasSupabaseAdminEnv()) return null

  return (
    <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
      Supabase no esta configurado en este entorno. El admin muestra datos de desarrollo, pero crear/editar requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
    </div>
  )
}
