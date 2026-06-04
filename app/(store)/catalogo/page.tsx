import Link from 'next/link'
import ProductGrid from '@/components/store/ProductGrid'
import TireSearch from '@/components/store/TireSearch'
import { getBrands, getCategories, searchProducts } from '@/lib/catalog'

export const revalidate = 60

export default async function CatalogPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const [brands, categories, results] = await Promise.all([
    getBrands(),
    getCategories(),
    searchProducts(searchParams.q, {
    width: searchParams.width ? Number(searchParams.width) : undefined,
    aspectRatio: searchParams.aspectRatio ? Number(searchParams.aspectRatio) : undefined,
    rimSize: searchParams.rimSize ? Number(searchParams.rimSize) : undefined
    })
  ])

  return (
    <section className="container-x py-5 sm:py-8">
      <div className="mb-5 rounded-lg bg-rubber p-5 text-white shadow-[0_20px_55px_rgba(37,42,120,0.18)] sm:mb-6 sm:p-6">
        <p className="text-sm font-black uppercase text-white/70">Catalogo</p>
        <h1 className="font-display text-4xl font-bold leading-none sm:text-6xl">Neumaticos disponibles</h1>
        <p className="mt-2 max-w-2xl text-white/80">Filtra por medida o revisa oportunidades con cuotas y precio especial por transferencia.</p>
      </div>

      <div className="mb-7">
        <TireSearch />
      </div>

      <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
        <aside className="h-fit overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#121629] px-4 py-3 font-black uppercase text-white">Filtros</div>
          <div className="p-4">
            <p className="text-sm font-black uppercase text-rubber">Marcas</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm lg:grid-cols-1">
              {brands.map((brand) => <Link key={brand.id} href={`/marcas/${brand.slug}`} className="rounded-md border border-slate-200 px-3 py-2 font-bold text-slate-700 hover:border-rubber hover:text-rubber">{brand.name}</Link>)}
            </div>
            <p className="mt-6 text-sm font-black uppercase text-rubber">Categorias</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm lg:grid-cols-1">
              {categories.map((category) => <Link key={category.id} href={`/categorias/${category.slug}`} className="rounded-md border border-slate-200 px-3 py-2 font-bold text-slate-700 hover:border-rubber hover:text-rubber">{category.name}</Link>)}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <span className="font-black text-[#121629]">{results.length} resultados</span>
            <span className="font-bold text-slate-500">Orden: oportunidades primero</span>
          </div>
          <ProductGrid products={results} />
        </div>
      </div>
    </section>
  )
}
