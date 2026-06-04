import Link from 'next/link'
import { getOrderByNumber } from '@/lib/admin-data'
import { formatPrice } from '@/lib/utils'

export default async function ConfirmationPage({ searchParams }: { searchParams: { order?: string } }) {
  const orderNumber = searchParams.order ?? 'GOM-00000'
  const order = await getOrderByNumber(orderNumber)

  return (
    <section className="container-x min-h-[520px] py-16">
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-black uppercase text-rubber">Pedido confirmado</p>
        <h1 className="mt-2 font-display text-6xl font-bold text-[#121629]">Gracias por tu compra</h1>
        <p className="mt-4 text-slate-600">Numero de pedido: <span className="font-black text-[#121629]">{orderNumber}</span></p>
        {order && (
          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p><span className="font-black">Estado:</span> {order.status}</p>
            <p><span className="font-black">Metodo de pago:</span> {order.payment}</p>
            <p><span className="font-black">Estado de pago:</span> {order.paymentStatus}</p>
            <p><span className="font-black">Entrega:</span> {order.delivery}</p>
            <p><span className="font-black">Total:</span> {formatPrice(order.total)}</p>
          </div>
        )}
        <p className="mt-4 text-slate-500">El pago queda pendiente. Si elegiste tarjetas, MercadoPago se integrara en una etapa posterior; si elegiste transferencia, te vamos a contactar con los datos.</p>
        <Link href="/catalogo" className="mt-6 inline-block rounded-md bg-rubber px-5 py-3 font-black uppercase text-white">Volver al catalogo</Link>
      </div>
    </section>
  )
}
