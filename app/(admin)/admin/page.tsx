import OrderTable from '@/components/admin/OrderTable'
import StatsCards from '@/components/admin/StatsCards'

export default function AdminPage() {
  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Panel admin</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Dashboard</h1>
      <div className="mt-8"><StatsCards /></div>
      <h2 className="mt-10 font-display text-4xl font-bold text-[#121629]">Ultimos pedidos</h2>
      <div className="mt-4"><OrderTable /></div>
    </>
  )
}
