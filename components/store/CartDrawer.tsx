'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { items, updateQuantity, removeItem, total } = useCartStore()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#121629]/60" onClick={() => onOpenChange(false)}>
      <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white text-[#121629] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-display text-4xl font-bold">Carrito</h2>
          <button onClick={() => onOpenChange(false)} className="rounded-md border border-slate-200 p-2 text-slate-600" aria-label="Cerrar carrito"><X size={18} /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-auto bg-slate-50 p-5">
          {items.length === 0 && <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-500">Todavia no agregaste productos.</p>}
          {items.map((item) => (
            <div key={item.productId} className="grid grid-cols-[78px_1fr] gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div className="relative aspect-square overflow-hidden rounded-md bg-slate-100">
                <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply" />
              </div>
              <div>
                <div className="flex justify-between gap-3">
                  <p className="font-black leading-tight">{item.name}</p>
                  <button onClick={() => removeItem(item.productId)} className="text-slate-400" aria-label="Eliminar"><X size={16} /></button>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-500">{item.brand} - {formatPrice(item.price)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="rounded-md border border-slate-200 p-1 text-slate-600" aria-label="Restar"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="rounded-md border border-slate-200 p-1 text-slate-600" aria-label="Sumar"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between text-xl font-black">
            <span>Total</span>
            <span>{formatPrice(total())}</span>
          </div>
          <Link onClick={() => onOpenChange(false)} href="/checkout" className="block rounded-md bg-rubber px-5 py-3 text-center font-black uppercase text-white">Finalizar compra</Link>
        </div>
      </aside>
    </div>
  )
}
