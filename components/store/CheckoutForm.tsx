'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CreditCard, MapPin, UserRound } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const steps = ['Datos', 'Envio', 'Pago']

export default function CheckoutForm() {
  const [step, setStep] = useState(0)
  const [shipping, setShipping] = useState('retiro_sucursal')
  const [payment, setPayment] = useState('transferencia')
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const { items, total, clearCart } = useCartStore()
  const shippingCost = shipping === 'envio' && total() < 250000 ? 12000 : 0
  const grandTotal = total() + shippingCost

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setCustomer((current) => ({
        ...current,
        name: current.name || String(data.user.user_metadata?.name ?? ''),
        email: current.email || (data.user.email ?? '')
      }))
    })
  }, [])

  async function confirm(event: FormEvent) {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          shipping,
          payment,
          shippingCost,
          total: grandTotal,
          items
        })
      })
      const result = await response.json()

      if (!response.ok) throw new Error(result.error ?? 'No se pudo confirmar el pedido')

      clearCart()
      toast.success(`Pedido ${result.orderNumber} confirmado`)
      window.location.href = `/checkout/confirmacion?order=${result.orderNumber}`
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo confirmar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={confirm} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6 grid grid-cols-3 gap-2">
          {steps.map((label, index) => (
            <button key={label} type="button" onClick={() => setStep(index)} className={`rounded-md px-3 py-2 text-sm font-black uppercase ${step === index ? 'bg-rubber text-white' : 'bg-slate-100 text-slate-500'}`}>
              {label}
            </button>
          ))}
        </div>
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-4xl font-bold text-[#121629]"><UserRound /> Datos del comprador</h2>
            <input value={customer.name} onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))} required className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Nombre y apellido" />
            <input value={customer.email} onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))} required className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Email" type="email" />
            <input value={customer.phone} onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} required className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Telefono" />
            <button type="button" onClick={() => setStep(1)} className="rounded-md bg-rubber px-5 py-3 font-black uppercase text-white">Continuar</button>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-4xl font-bold text-[#121629]"><MapPin /> Entrega</h2>
            <label className="block rounded-md border border-slate-200 p-4 font-bold text-slate-700"><input type="radio" checked={shipping === 'retiro_sucursal'} onChange={() => setShipping('retiro_sucursal')} /> Retiro en sucursal</label>
            <label className="block rounded-md border border-slate-200 p-4 font-bold text-slate-700"><input type="radio" checked={shipping === 'envio'} onChange={() => setShipping('envio')} /> Envio a domicilio</label>
            {shipping === 'envio' && <input value={customer.address} onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))} required className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Direccion completa" />}
            {total() >= 250000 && <p className="font-black text-rubber">Envio gratis aplicado.</p>}
            <button type="button" onClick={() => setStep(2)} className="rounded-md bg-rubber px-5 py-3 font-black uppercase text-white">Continuar</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-4xl font-bold text-[#121629]"><CreditCard /> Pago</h2>
            <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">MercadoPago quedara preparado para tarjetas, pero por ahora no se realiza ningun cobro online.</p>
            <label className="block rounded-md border border-slate-200 p-4 font-bold text-slate-700"><input type="radio" checked={payment === 'transferencia'} onChange={() => setPayment('transferencia')} /> Transferencia bancaria</label>
            <label className="block rounded-md border border-slate-200 p-4 font-bold text-slate-700"><input type="radio" checked={payment === 'tarjetas'} onChange={() => setPayment('tarjetas')} /> Tarjetas</label>
            <button disabled={!items.length || loading} className="rounded-md bg-rubber px-5 py-3 font-black uppercase text-white disabled:opacity-50">{loading ? 'Confirmando...' : 'Confirmar pedido'}</button>
          </div>
        )}
      </section>
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-4xl font-bold text-[#121629]">Resumen</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => <div key={item.productId} className="flex justify-between gap-3 text-sm font-semibold text-slate-600"><span>{item.quantity}x {item.name}</span><span>{formatPrice(item.price * item.quantity)}</span></div>)}
        </div>
        <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm font-semibold text-slate-600">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total())}</span></div>
          <div className="flex justify-between"><span>Envio</span><span>{shippingCost ? formatPrice(shippingCost) : 'Sin cargo'}</span></div>
          <div className="flex justify-between text-xl font-black text-[#121629]"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
        </div>
        {!items.length && <Link href="/catalogo" className="mt-4 block rounded-md border border-rubber/20 px-4 py-3 text-center font-black uppercase text-rubber">Volver al catalogo</Link>}
      </aside>
    </form>
  )
}
