import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

type OrderRow = {
  order_number: string
  status: string | null
  payment_method: string | null
  payment_status: string | null
  total: number | string | null
  created_at: string | null
  order_items?: Array<{
    quantity: number
    product_snapshot: { name?: string } | null
  }>
}

export default async function MyOrdersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/cuenta/login')

  const { data: orders, error } = await supabase
    .from('orders')
    .select('order_number, status, payment_method, payment_status, total, created_at, order_items(quantity, product_snapshot)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (
    <section className="container-x min-h-[520px] py-8 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-rubber">Mi cuenta</p>
          <h1 className="font-display text-4xl font-bold text-[#121629] sm:text-6xl">Mis pedidos</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/cuenta/perfil" className="rounded-md border border-rubber/20 bg-white px-4 py-3 text-sm font-black uppercase text-rubber">Mis datos</Link>
          <Link href="/catalogo" className="rounded-md bg-rubber px-4 py-3 text-sm font-black uppercase text-white">Comprar</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {((orders ?? []) as OrderRow[]).map((order) => (
          <article key={order.order_number} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-slate-500">Pedido</p>
                <h2 className="mt-1 text-xl font-black text-[#121629]">{order.order_number}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{String(order.created_at ?? '').slice(0, 10)}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-rubber">{formatPrice(Number(order.total ?? 0))}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{order.payment_method ?? 'Pago pendiente'} - {order.payment_status ?? 'pending'}</p>
              </div>
            </div>

            <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600">
              <p><span className="font-black text-[#121629]">Estado:</span> {order.status ?? 'pending'}</p>
              {(order.order_items ?? []).map((item, index) => (
                <p key={index} className="mt-1">{item.quantity}x {item.product_snapshot?.name ?? 'Producto'}</p>
              ))}
            </div>
          </article>
        ))}

        {!orders?.length && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="font-black text-[#121629]">Todavia no tenes pedidos.</p>
            <Link href="/catalogo" className="mt-4 inline-block rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Ver catalogo</Link>
          </div>
        )}
      </div>
    </section>
  )
}
