import ProductGrid from '@/components/store/ProductGrid'
import { getCategories, getProducts } from '@/lib/catalog'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  const category = categories.find((item) => item.slug === params.slug)
  const results = products.filter((product) => product.category.slug === params.slug)

  return (
    <section className="container-x py-10">
      <p className="text-sm font-bold uppercase text-rubber">Categoria</p>
      <h1 className="font-display text-6xl font-bold">{category?.name ?? 'Categoria'}</h1>
      <div className="mt-8"><ProductGrid products={results} /></div>
    </section>
  )
}
