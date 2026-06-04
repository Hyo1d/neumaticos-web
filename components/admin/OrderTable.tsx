import Link from 'next/link'
import { getAdminOrders, shippingMethodLabels } from '@/lib/admin-data'
import { formatPrice } from '@/lib/utils'
import { updateOrderStatusAction } from '@/app/(admin)/admin/pedidos/actions'

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

export default async function OrderTable() {
  const orders = await getAdminOrders()

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-xs font-black uppercase text-slate-500">
          <tr>
            <th className="p-3">Pedido</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Pago</th>
            <th>Entrega</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-slate-100 text-slate-700">
              <td className="p-3 font-black text-[#121629]">{order.id}</td>
              <td>{order.customer}</td>
              <td colSpan={2}>
                <form action={updateOrderStatusAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="orderNumber" value={order.id} />
                  <select name="status" defaultValue={order.status} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold">
                    {orderStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <select name="payment_status" defaultValue={order.paymentStatus} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold">
                    {paymentStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <button className="rounded-md bg-rubber px-2 py-1 text-xs font-black text-white">OK</button>
                </form>
              </td>
              <td>{shippingMethodLabels[order.delivery] ?? order.delivery}</td>
              <td className="font-black text-[#121629]">{formatPrice(order.total)}</td>
              <td><Link href={`/admin/pedidos/${order.id}`} className="font-black text-rubber">Ver</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
