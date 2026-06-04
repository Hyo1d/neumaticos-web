import { notFound } from 'next/navigation'
import SupabaseNotice from '@/components/admin/SupabaseNotice'
import { getBrands } from '@/lib/catalog'
import { updateBrandAction } from '@/app/(admin)/admin/marcas/actions'

export default async function EditBrandPage({ params }: { params: { id: string } }) {
  const brands = await getBrands()
  const brand = brands.find((item) => item.id === params.id)
  if (!brand) notFound()

  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Marca</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Editar marca</h1>
      <div className="mt-8"><SupabaseNotice /></div>
      <form action={updateBrandAction} className="mt-4 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <input type="hidden" name="id" value={brand.id} />
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Nombre
          <input name="name" defaultValue={brand.name} required className="h-11 rounded-md border border-slate-200 px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Slug
          <input name="slug" defaultValue={brand.slug} required className="h-11 rounded-md border border-slate-200 px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Logo URL
          <input name="logo_url" defaultValue={brand.logoUrl} className="h-11 rounded-md border border-slate-200 px-3 text-sm" />
        </label>
        <button className="w-fit rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Guardar cambios</button>
      </form>
    </>
  )
}
