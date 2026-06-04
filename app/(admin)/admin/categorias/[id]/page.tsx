import { notFound } from 'next/navigation'
import SupabaseNotice from '@/components/admin/SupabaseNotice'
import { getCategories } from '@/lib/catalog'
import { updateCategoryAction } from '@/app/(admin)/admin/categorias/actions'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const categories = await getCategories()
  const category = categories.find((item) => item.id === params.id)
  if (!category) notFound()

  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Categoria</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Editar categoria</h1>
      <div className="mt-8"><SupabaseNotice /></div>
      <form action={updateCategoryAction} className="mt-4 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <input type="hidden" name="id" value={category.id} />
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Nombre
          <input name="name" defaultValue={category.name} required className="h-11 rounded-md border border-slate-200 px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Slug
          <input name="slug" defaultValue={category.slug} required className="h-11 rounded-md border border-slate-200 px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Icono
          <input name="icon" defaultValue={category.icon} className="h-11 rounded-md border border-slate-200 px-3 text-sm" />
        </label>
        <button className="w-fit rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Guardar cambios</button>
      </form>
    </>
  )
}
