import Link from 'next/link'
import { getCategories, getProducts } from '@/lib/catalog'
import SupabaseNotice from '@/components/admin/SupabaseNotice'
import { createCategoryAction, deactivateCategoryAction } from '@/app/(admin)/admin/categorias/actions'

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-rubber">Navegacion y catalogo</p>
          <h1 className="font-display text-6xl font-bold text-[#121629]">Categorias</h1>
        </div>
      </div>
      <div className="mt-8"><SupabaseNotice /></div>
      <form action={createCategoryAction} className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_1fr_auto]">
        <input name="name" required className="h-11 rounded-md border border-slate-200 px-3 text-sm" placeholder="Nombre" />
        <input name="slug" required className="h-11 rounded-md border border-slate-200 px-3 text-sm" placeholder="slug" />
        <input name="icon" className="h-11 rounded-md border border-slate-200 px-3 text-sm" placeholder="Icono" />
        <button className="rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Crear</button>
      </form>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const count = products.filter((product) => product.category.id === category.id).length

          return (
            <div key={category.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-display text-4xl font-bold text-[#121629]">{category.name}</p>
              <p className="mt-2 text-sm font-bold text-slate-500">/{category.slug}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase">
                <span className="rounded-full bg-rubber/10 px-2 py-1 text-rubber">Navbar</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{count} productos</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/admin/categorias/${category.id}`} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-black text-rubber">Editar</Link>
                <form action={deactivateCategoryAction}>
                  <input type="hidden" name="id" value={category.id} />
                  <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-black text-red-600">Desactivar</button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
