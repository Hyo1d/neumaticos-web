import { notFound } from 'next/navigation'
import { getOrderById, orderStatusLabels, paymentMethodLabels, paymentStatusLabels, shippingMethodLabels } from '@/lib/admin-data'
import { formatPrice } from '@/lib/utils'
import { updateOrderStatusAction } from '@/app/(admin)/admin/pedidos/actions'

export const dynamic = 'force-dynamic'

const orderStatusOptions = [
  ['pending', 'Pendiente'],
  ['confirmed', 'Confirmado'],
  ['processing', 'En preparacion'],
  ['ready', 'Listo para retirar'],
  ['delivered', 'Entregado'],
  ['cancelled', 'Cancelado']
]

const paymentStatusOptions = [
  ['pending', 'Pendiente'],
  ['paid', 'Pagado'],
  ['rejected', 'Rechazado']
]

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id)
  if (!order) notFound()

  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Pedido</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">{order.id}</h1>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-4xl font-bold text-[#121629]">Items</h2>
          <div className="mt-4 grid gap-3">
            {order.items.map((item) => <div key={item} className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-700">{item}</div>)}
          </div>
        </section>
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase text-slate-500">Cliente</p>
          <p className="mt-1 text-xl font-black text-[#121629]">{order.customer}</p>
          <dl className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Estado</dt><dd className="font-black">{orderStatusLabels[order.status] ?? order.status}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Metodo pago</dt><dd className="font-black">{paymentMethodLabels[order.payment] ?? order.payment}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Estado pago</dt><dd className="font-black">{paymentStatusLabels[order.paymentStatus] ?? order.paymentStatus}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Entrega</dt><dd className="font-black">{shippingMethodLabels[order.delivery] ?? order.delivery}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Total</dt><dd className="font-black">{formatPrice(order.total)}</dd></div>
          </dl>
          <form action={updateOrderStatusAction} className="mt-6 grid gap-3">
            <input type="hidden" name="orderNumber" value={order.id} />
            <select name="status" defaultValue={order.status} className="h-11 rounded-md border border-slate-200 px-3 text-sm font-bold">
              {orderStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select name="payment_status" defaultValue={order.paymentStatus} className="h-11 rounded-md border border-slate-200 px-3 text-sm font-bold">
              {paymentStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button className="w-full rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Actualizar estado</button>
          </form>
        </aside>
      </div>
    </>
  )
}
