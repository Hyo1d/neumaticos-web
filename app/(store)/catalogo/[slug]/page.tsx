import Image from 'next/image'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/store/ProductCard'
import ProductPurchasePanel from '@/components/store/ProductPurchasePanel'
import { getProductBySlug, getProducts } from '@/lib/catalog'
import { formatPrice } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: `${product.name} | ${product.brand.name}`,
    description: `${product.brand.name} ${product.width}/${product.aspectRatio} R${product.rimSize} por ${formatPrice(product.price)}`
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  const products = await getProducts()
  const related = products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => {
      const aScore = Number(a.category.id === product.category.id) + Number(a.brand.id === product.brand.id)
      const bScore = Number(b.category.id === product.category.id) + Number(b.brand.id === product.brand.id)
      return bScore - aScore
    })
    .slice(0, 4)
  const installment = Math.round(product.price / 12)
  const transferPrice = Math.round(product.price * 0.8)

  return (
    <section className="container-x py-5 sm:py-8">
      <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative aspect-square overflow-hidden rounded-md bg-slate-100">
            <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain mix-blend-multiply" priority />
            <span className="absolute left-4 top-4 rounded-md bg-rubber px-3 py-1 text-sm font-black uppercase text-white">{product.brand.name}</span>
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  <Image src={image} alt={`${product.name} imagen ${index + 1}`} fill sizes="90px" className="object-contain mix-blend-multiply" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-black uppercase text-rubber">{product.brand.name}</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-none text-[#121629] sm:text-5xl lg:text-6xl">{product.name}</h1>
          <p className="mt-4 text-slate-600">{product.description}</p>
          <div className="mt-6">
            {product.priceCompare && <p className="text-lg text-slate-400 line-through">{formatPrice(product.priceCompare)}</p>}
            <p className="font-display text-4xl font-bold text-[#121629] sm:text-5xl">{formatPrice(product.price)}</p>
            <p className="mt-1 font-bold text-rubber">12 x {formatPrice(installment)} sin interes</p>
            <p className="font-semibold text-emerald-700">{formatPrice(transferPrice)} con transferencia</p>
          </div>
          <div className="mt-7 overflow-hidden rounded-lg border border-slate-200">
            {[
              ['Medida', `${product.width}/${product.aspectRatio} R${product.rimSize}`],
              ['Indice de carga', product.loadIndex],
              ['Codigo de velocidad', product.speedRating],
              ['Stock', `${product.stock} unidades`]
            ].map(([key, value]) => (
              <div key={key} className="grid grid-cols-[1fr_auto] gap-3 border-b border-slate-200 p-3 last:border-b-0">
                <span className="font-bold text-slate-400">{key}</span>
                <span className="font-black text-[#121629]">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <ProductPurchasePanel product={product} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-3xl font-bold text-[#121629] sm:text-4xl">Tambien te puede servir</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </div>
    </section>
  )
}
