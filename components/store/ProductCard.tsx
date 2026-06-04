'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, ShoppingCart, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const discount = product.priceCompare ? Math.max(0, Math.round((1 - product.price / product.priceCompare) * 100)) : 0
  const transferPrice = Math.round(product.price * 0.8)
  const installment = Math.round(product.price / 12)
  const hasStock = product.stock > 0

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(18,22,41,0.14)]">
      <Link href={`/catalogo/${product.slug}`} className="relative block aspect-[1.08] bg-slate-100">
        <Image src={product.images[0]} alt={product.name} fill className="object-cover mix-blend-multiply transition duration-300 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-md bg-rubber px-2.5 py-1 text-xs font-black uppercase text-white">{product.brand.name}</span>
        {discount > 0 && <span className="absolute right-3 top-3 rounded-md bg-[#ffc400] px-2.5 py-1 text-xs font-black text-[#121629]">{discount}% OFF</span>}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
          <Truck size={14} /> Retiro en sucursal
        </span>
      </Link>

      <div className="p-4">
        <Link href={`/catalogo/${product.slug}`} className="block min-h-12 text-[15px] font-black leading-tight text-[#121629]">
          Neumatico {product.width}/{product.aspectRatio} R{product.rimSize} {product.name.replace(`${product.width}/${product.aspectRatio} R${product.rimSize}`, '').trim()}
        </Link>

        <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-md border border-slate-200 text-center text-xs">
          <div className="bg-slate-50 p-2"><p className="font-bold text-slate-400">Ancho</p><p className="font-black text-[#121629]">{product.width}</p></div>
          <div className="border-x border-slate-200 bg-slate-50 p-2"><p className="font-bold text-slate-400">Alto</p><p className="font-black text-[#121629]">{product.aspectRatio}</p></div>
          <div className="bg-slate-50 p-2"><p className="font-bold text-slate-400">Rodado</p><p className="font-black text-[#121629]">{product.rimSize}</p></div>
        </div>

        <div className="mt-4">
          {product.priceCompare && <p className="text-sm text-slate-400 line-through">{formatPrice(product.priceCompare)}</p>}
          <p className="text-2xl font-black text-[#121629]">{formatPrice(product.price)}</p>
          <p className="mt-1 text-sm font-bold text-rubber">12 x {formatPrice(installment)} sin interes</p>
          <p className="text-sm font-semibold text-emerald-700">{formatPrice(transferPrice)} con transferencia</p>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-500">
          <Check size={14} className={hasStock ? 'text-emerald-600' : 'text-slate-400'} /> {hasStock ? `Stock disponible: ${product.stock}` : 'Sin stock'}
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <Link href={`/catalogo/${product.slug}`} className="rounded-md border border-rubber/20 px-3 py-2 text-center text-sm font-black uppercase text-rubber">
            Comprar
          </Link>
          <button
            onClick={() => {
              if (!hasStock) return
              addItem({ productId: product.id, slug: product.slug, name: product.name, brand: product.brand.name, image: product.images[0], price: product.price, quantity: 1 })
              toast.success('Producto agregado al carrito')
            }}
            disabled={!hasStock}
            className="inline-flex h-10 w-11 items-center justify-center rounded-md bg-rubber text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}
