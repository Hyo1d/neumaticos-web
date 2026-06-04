import type { Product } from '@/lib/types'
import ProductCard from '@/components/store/ProductCard'

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">No encontramos neumaticos con esos filtros.</div>
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
