'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { site } from '@/lib/site'

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const quantity = useCartStore((state) => state.items.find((item) => item.productId === product.id)?.quantity ?? 0)
  const hasStock = product.stock > 0
  const canAdd = hasStock && quantity < product.stock

  function addToCart() {
    if (!canAdd) return
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      image: product.images[0],
      price: product.price,
      quantity: 1
    })
    toast.success('Producto agregado al carrito')
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-slate-500">Disponibilidad</p>
          <p className={hasStock ? 'mt-1 text-lg font-black text-emerald-700' : 'mt-1 text-lg font-black text-red-600'}>
            {hasStock ? `${product.stock} unidades disponibles` : 'Sin stock'}
          </p>
        </div>
        {quantity > 0 && (
          <span className="rounded-md bg-white px-3 py-2 text-sm font-black text-rubber">
            {quantity} en carrito
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr]">
        <div className="inline-flex h-12 overflow-hidden rounded-md border border-slate-200 bg-white">
          <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} disabled={quantity <= 0} className="grid w-12 place-items-center text-slate-600 disabled:opacity-40" aria-label="Restar">
            <Minus size={17} />
          </button>
          <span className="grid w-12 place-items-center border-x border-slate-200 text-sm font-black">{quantity}</span>
          <button type="button" onClick={() => addToCart()} disabled={!canAdd} className="grid w-12 place-items-center text-slate-600 disabled:opacity-40" aria-label="Sumar">
            <Plus size={17} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => addToCart()}
          disabled={!canAdd}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-rubber px-5 text-sm font-black uppercase text-white shadow-lg shadow-rubber/20 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ShoppingCart size={18} />
          Agregar al carrito
        </button>
      </div>

      {quantity > 0 && (
        <Link href="/checkout" className="mt-3 block rounded-md bg-[#121629] px-5 py-3 text-center text-sm font-black uppercase text-white">
          Finalizar compra
        </Link>
      )}

      <a href={`${site.whatsappHref}?text=Hola,%20quiero%20consultar%20por%20${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer" className="mt-3 block rounded-md border border-slate-200 bg-white px-5 py-3 text-center text-sm font-black uppercase text-rubber">
        Consultar por WhatsApp
      </a>

      <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
        Precio online: {formatPrice(product.price)}. El stock se confirma al generar el pedido.
      </p>
    </div>
  )
}
