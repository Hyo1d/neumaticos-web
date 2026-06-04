import OrderTable from '@/components/admin/OrderTable'

export const dynamic = 'force-dynamic'

export default function AdminOrdersPage() {
  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Ventas</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Pedidos recibidos</h1>
      <div className="mt-8"><OrderTable /></div>
    </>
  )
}
