import Link from 'next/link'
import { getBrands, getProducts } from '@/lib/catalog'
import SupabaseNotice from '@/components/admin/SupabaseNotice'
import { createBrandAction, deactivateBrandAction } from '@/app/(admin)/admin/marcas/actions'

export default async function AdminBrandsPage() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()])

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-rubber">Catalogo y carrusel</p>
          <h1 className="font-display text-6xl font-bold text-[#121629]">Marcas</h1>
        </div>
      </div>
      <div className="mt-8"><SupabaseNotice /></div>
      <form action={createBrandAction} className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_1.5fr_auto]">
        <input name="name" required className="h-11 rounded-md border border-slate-200 px-3 text-sm" placeholder="Nombre" />
        <input name="slug" required className="h-11 rounded-md border border-slate-200 px-3 text-sm" placeholder="slug" />
        <input name="logo_url" className="h-11 rounded-md border border-slate-200 px-3 text-sm" placeholder="/brand-logos/logo.png" />
        <button className="rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Crear</button>
      </form>
      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-black uppercase text-slate-500">
            <tr><th className="p-3">Marca</th><th>Slug</th><th>Logo</th><th>Productos</th><th>Visible</th><th></th></tr>
          </thead>
          <tbody>
            {brands.map((brand) => {
              const count = products.filter((product) => product.brand.id === brand.id).length

              return (
                <tr key={brand.id} className="border-t border-slate-100 text-slate-700">
                  <td className="p-3 font-black text-[#121629]">{brand.name}</td>
                  <td>/{brand.slug}</td>
                  <td className="max-w-[220px] truncate text-xs">{brand.logoUrl ?? 'Sin logo'}</td>
                  <td>{count}</td>
                  <td><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">Navbar y filtros</span></td>
                  <td className="flex gap-2 py-3">
                    <Link href={`/admin/marcas/${brand.id}`} className="font-black text-rubber">Editar</Link>
                    <form action={deactivateBrandAction}>
                      <input type="hidden" name="id" value={brand.id} />
                      <button className="font-black text-red-600">Desactivar</button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
