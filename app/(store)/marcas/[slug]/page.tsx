import ProductGrid from '@/components/store/ProductGrid'
import { getBrands, getProducts } from '@/lib/catalog'

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const [brands, products] = await Promise.all([getBrands(), getProducts()])
  const brand = brands.find((item) => item.slug === params.slug)
  const results = products.filter((product) => product.brand.slug === params.slug)
  return (
    <section className="container-x py-10">
      <p className="text-sm font-bold uppercase text-rubber">Marca</p>
      <h1 className="font-display text-6xl font-bold">{brand?.name ?? 'Marca'}</h1>
      <div className="mt-8"><ProductGrid products={results} /></div>
    </section>
  )
}
